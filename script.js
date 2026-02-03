// ========================================
// Soul Solutions 3D - Modern Interactive JS
// Three.js + Advanced Animations
// ========================================

const ProjectCore = {
    init() {
        this.init3DHero();
        this.init3DMenu();
        this.initNavbar();
        this.initMobileMenu();
        this.initScrollAnimations();
        this.initTiltEffect();
        this.initContactForm();
        this.initSmoothScroll();
    }
};

document.addEventListener('DOMContentLoaded', () => ProjectCore.init.call(ProjectCore));


// ========================================
// Three.js 3D Hero Background
// ========================================
function init3DHero() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesCount = window.innerWidth > 768 ? 2000 : 1000;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 15;

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({ size: 0.015, color: 0x0066FF, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const geometries = [];
    // Moved torus further left and down to avoid navbar center/logo area
    const torus = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.2, 16, 100), new THREE.MeshBasicMaterial({ color: 0x0066FF, wireframe: true, transparent: true, opacity: 0.2 }));
    torus.position.set(-4, -1, -3);
    scene.add(torus);
    geometries.push(torus);

    const icosahedron = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8, 1), new THREE.MeshBasicMaterial({ color: 0x00D4FF, wireframe: true, transparent: true, opacity: 0.25 }));
    icosahedron.position.set(3, -2, -4);
    scene.add(icosahedron);
    geometries.push(icosahedron);

    const octahedron = new THREE.Mesh(new THREE.OctahedronGeometry(0.6, 0), new THREE.MeshBasicMaterial({ color: 0xA855F7, wireframe: true, transparent: true, opacity: 0.2 }));
    octahedron.position.set(-2, 2, -5);
    scene.add(octahedron);
    geometries.push(octahedron);

    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    document.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();
    const animate = () => {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        particlesMesh.rotation.y = elapsedTime * 0.1;
        particlesMesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.2;

        geometries.forEach((geo, i) => {
            geo.rotation.x = elapsedTime * (0.3 + i * 0.1);
            geo.rotation.y = elapsedTime * (0.2 + i * 0.05);
            geo.position.y += Math.sin(elapsedTime + i) * 0.001;
        });

        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    window.addEventListener('beforeunload', () => {
        scene.traverse(obj => { if (obj.geometry) obj.geometry.dispose(); if (obj.material) obj.material.dispose(); });
        renderer.dispose();
    });
}


// ========================================
// Navbar Scroll Effect
// ========================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const handleScroll = () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

// ========================================
// Mobile Menu Toggle with 3D Interaction
// ========================================
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const menuOverlay = document.getElementById('mobileMenuOverlay');
    const menuLinks = document.querySelectorAll('.menu-link');

    if (!mobileMenuBtn || !menuOverlay) return;

    let menuSceneStarted = false;

    const toggleMenu = () => {
        const isActive = menuOverlay.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        
        document.body.style.overflow = isActive ? 'hidden' : '';

        if (isActive) {
            if (!menuSceneStarted) {
                init3DMenu();
                menuSceneStarted = true;
            }
            // Stagger link animation
            menuLinks.forEach((link, i) => {
                link.style.transitionDelay = `${0.1 + i * 0.1}s`;
            });
        }
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    menuLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
}

// ========================================
// Three.js 3D Mobile Menu Background
// ========================================
function init3DMenu() {
    const canvas = document.getElementById('menuCanvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Experience: Digital Flow Lines
    const linesCount = 30;
    const lines = [];

    for (let i = 0; i < linesCount; i++) {
        const points = [];
        for (let j = 0; j < 50; j++) {
            points.push(new THREE.Vector3(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10
            ));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
            color: i % 2 === 0 ? 0x0066FF : 0x00D4FF,
            transparent: true,
            opacity: 0.4
        });
        
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        lines.push({ line, originalPoints: points, speed: 0.01 + Math.random() * 0.02 });
    }

    const animate = () => {
        if (!document.getElementById('mobileMenuOverlay').classList.contains('active')) {
            requestAnimationFrame(animate);
            return;
        }

        requestAnimationFrame(animate);

        const time = Date.now() * 0.001;

        lines.forEach((item, i) => {
            item.line.rotation.z = time * item.speed;
            item.line.rotation.y = Math.sin(time * 0.5 + i) * 0.2;
            
            const pos = item.line.geometry.attributes.position.array;
            for(let j = 0; j < pos.length; j += 3) {
                pos[j+1] += Math.sin(time + j) * 0.005;
            }
            item.line.geometry.attributes.position.needsUpdate = true;
        });

        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ========================================
// Scroll-triggered Animations
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll(`
        .service-card,
        .tech-column,
        .timeline-item,
        .stat-card
    `);

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// ========================================
// 3D Tilt Effect on Cards
// ========================================
function initTiltEffect() {
    if (window.innerWidth < 768) return; // Skip on mobile

    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ========================================
// Contact Form with Web3Forms
// ========================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;

        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span>Enviando...</span>
            <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round">
                    <animateTransform 
                        attributeName="transform" 
                        type="rotate" 
                        from="0 12 12" 
                        to="360 12 12" 
                        dur="1s" 
                        repeatCount="indefinite"/>
                </path>
            </svg>
        `;

        try {
            const formData = new FormData(form);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                // Success state
                submitBtn.innerHTML = `
                    <span>¡Mensaje Enviado!</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                `;
                submitBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
                
                // Reset form
                form.reset();

                // Show success message
                showNotification('¡Mensaje enviado exitosamente! Te contactaré pronto.', 'success');
            } else {
                throw new Error(data.message || 'Error al enviar');
            }
        } catch (error) {
            // Error state
            submitBtn.innerHTML = `
                <span>Error - Reintentar</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            `;
            submitBtn.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
            
            showNotification('Error al enviar el mensaje. Por favor, intenta de nuevo.', 'error');
            console.error('Form error:', error);
        }

        // Reset button after 3s
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
            submitBtn.style.background = '';
        }, 3000);
    });

    // Input focus effects
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.style.transform = 'scale(1.01)';
        });

        input.addEventListener('blur', () => {
            input.parentElement.style.transform = 'scale(1)';
        });
    });
}

// ========================================
// Notification System
// ========================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 32px;
        padding: 20px 28px;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
        backdrop-filter: blur(20px);
        border: 1px solid ${type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
        border-radius: 16px;
        color: white;
        font-weight: 500;
        font-size: 0.9375rem;
        z-index: 10000;
        animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        max-width: 400px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 40;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// Animated Counter for Stats
// ========================================
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const finalValue = stat.textContent;
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

    stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element, start, end, suffix, duration = 2000) {
    const startTime = performance.now();

    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        const current = start + (end - start) * easeProgress;
        const displayValue = Number.isInteger(end) 
            ? Math.round(current) 
            : current.toFixed(1);

        element.textContent = displayValue + suffix;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
}

// Initialize counter on load
initStatsCounter();

// ========================================
// Parallax Effect on Scroll
// ========================================
function initParallax() {
    if (window.innerWidth < 768) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                // Parallax for hero elements
                const heroContent = document.querySelector('.hero-content');
                if (heroContent) {
                    heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
                }

                ticking = false;
            });
            ticking = true;
        }
    });
}

initParallax();

// ========================================
// Console Easter Egg
// ========================================
console.log(
    '%c⚡ Soul Solutions ',
    'color: #0066FF; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,102,255,0.5);'
);
console.log(
    '%cTransformando mainframes con Three.js 🚀',
    'color: #00D4FF; font-size: 14px; font-weight: 500;'
);
console.log(
    '%c¿Te gusta el código? Contáctame: juliansoto.dev@gmail.com',
    'color: #A855F7; font-size: 12px;'
);
