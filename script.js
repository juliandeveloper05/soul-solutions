// ========================================
// Soul Solutions - Interactive JavaScript
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all modules
  initNavbar();
  initScrollAnimations();
  initMobileMenu();
  initContactForm();
  initSmoothScroll();
});

// ========================================
// Navbar Scroll Effect
// ========================================
function initNavbar() {
  const navbar = document.querySelector(".navbar");

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Initial check
}

// ========================================
// Scroll Animations with Intersection Observer
// ========================================
function initScrollAnimations() {
  // Add fade-in class to animated elements
  const animatedElements = document.querySelectorAll(
    ".service-card, .tech-column, .method-card, .contact-wrapper > *"
  );

  animatedElements.forEach((el) => el.classList.add("fade-in"));

  // Create observer
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements
  animatedElements.forEach((el) => observer.observe(el));

  // Stagger animation for grids
  const grids = document.querySelectorAll(
    ".services-grid, .methodology-grid, .tech-badges"
  );
  grids.forEach((grid) => {
    const children = grid.children;
    Array.from(children).forEach((child, index) => {
      child.style.transitionDelay = `${index * 0.1}s`;
    });
  });
}

// ========================================
// Mobile Menu Toggle
// ========================================
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector(".mobile-menu");
  const navLinks = document.querySelector(".nav-links");

  if (!mobileMenuBtn || !navLinks) return;

  const closeMobileMenu = () => {
    navLinks.classList.remove("active");
    mobileMenuBtn.classList.remove("active");
    const spans = mobileMenuBtn.querySelectorAll("span");
    spans[0].style.transform = "none";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "none";
  };

  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    mobileMenuBtn.classList.toggle("active");

    // Animate hamburger to X
    const spans = mobileMenuBtn.querySelectorAll("span");
    if (mobileMenuBtn.classList.contains("active")) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
    } else {
      closeMobileMenu();
    }
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Close menu on scroll (mobile UX improvement)
  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    if (
      Math.abs(window.scrollY - lastScrollY) > 50 &&
      navLinks.classList.contains("active")
    ) {
      closeMobileMenu();
    }
    lastScrollY = window.scrollY;
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      navLinks.classList.contains("active") &&
      !navLinks.contains(e.target) &&
      !mobileMenuBtn.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });
}

// ========================================
// Contact Form Handling
// ========================================
function initContactForm() {
  const form = document.getElementById("contactForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
            <span>Enviando...</span>
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round">
                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                </path>
            </svg>
        `;

    try {
      const formData = new FormData(form);
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Show success state
        submitBtn.innerHTML = `
                    <span>¡Mensaje Enviado!</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                `;
        submitBtn.style.background =
          "linear-gradient(135deg, #10B981 0%, #059669 100%)";
        form.reset();
      } else {
        throw new Error(data.message || "Error al enviar");
      }
    } catch (error) {
      // Show error state
      submitBtn.innerHTML = `
                <span>Error - Reintentar</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            `;
      submitBtn.style.background =
        "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)";
      console.error("Form error:", error);
    }

    // Reset button after delay
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = "";
    }, 3000);
  });

  // Input focus effects
  const inputs = form.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      input.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", () => {
      input.parentElement.classList.remove("focused");
    });
  });
}

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      if (href === "#") return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const navHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition =
          target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// ========================================
// Tech Badge Hover Effects (Desktop only)
// ========================================
if (window.innerWidth > 768) {
  document.querySelectorAll(".tech-badge").forEach((badge) => {
    badge.addEventListener("mouseenter", () => {
      badge.style.transform = "translateY(-4px) scale(1.02)";
    });

    badge.addEventListener("mouseleave", () => {
      badge.style.transform = "";
    });
  });
}

// ========================================
// Parallax Effect for Hero Orbs (Desktop only)
// ========================================
if (window.innerWidth > 768) {
  document.addEventListener("mousemove", (e) => {
    const orbs = document.querySelectorAll(".gradient-orb");
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    orbs.forEach((orb, index) => {
      const speed = (index + 1) * 20;
      const xOffset = (x - 0.5) * speed;
      const yOffset = (y - 0.5) * speed;

      orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
  });
}

// ========================================
// Stats Counter Animation
// ========================================
function animateStats() {
  const stats = document.querySelectorAll(".stat-number");

  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const stat = entry.target;
        const finalValue = stat.textContent;

        // Extract number and suffix
        const match = finalValue.match(/^([\d.]+)(.*)$/);
        if (match) {
          const number = parseFloat(match[1]);
          const suffix = match[2];

          animateNumber(stat, 0, number, suffix);
        }

        observer.unobserve(stat);
      }
    });
  }, observerOptions);

  stats.forEach((stat) => observer.observe(stat));
}

function animateNumber(element, start, end, suffix, duration = 2000) {
  const startTime = performance.now();

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-out-quad)
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    const current = start + (end - start) * easeProgress;

    // Format number
    let displayValue;
    if (Number.isInteger(end)) {
      displayValue = Math.round(current);
    } else {
      displayValue = current.toFixed(1);
    }

    element.textContent = displayValue + suffix;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
}

// Initialize stats animation
animateStats();
