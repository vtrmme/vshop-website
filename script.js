/**
 * VSHOP Official Website Core Engine
 * Estilo modular encapsulado en JavaScript nativo.
 */

// ==========================================================================
// 1. CONFIGURACIÓN CENTRALIZADA DE ENLACES (MODIFICA AQUÍ)
// ==========================================================================
const SOCIAL_LINKS = {
    discord: "https://discord.gg/DV9XUK685F", 
    instagram: "https://instagram.com/vtrmme_",
    youtube: "https://www.youtube.com/@aipunto",
    github: "https://github.com/vtrmme",
    steam: "https://steamcommunity.com/id/vtrmme_/",
    guns: "https://guns.lol/vtrmme_"
};

const CONFIG = {
    particleVelocityFactor: 0.25,
    particleConnectionDistance: 100,
    scrollThreshold: 40,
    revealOffset: 0.12
};

// ==========================================================================
// 2. SISTEMA AUTOMATIZADO Y DINÁMICO DE REDIRECCIONES (NO TOCAR)
// ==========================================================================
function initDynamicLinks() {
    // Captura cualquier elemento con la clase .dynamic-link en todo el DOM
    const interactiveElements = document.querySelectorAll('.dynamic-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = element.getAttribute('data-platform');
            
            if (platform && SOCIAL_LINKS[platform]) {
                window.open(SOCIAL_LINKS[platform], '_blank', 'noopener,noreferrer');
            } else {
                console.warn(`Plataforma solicitada "${platform}" no configurada en el objeto SOCIAL_LINKS.`);
            }
        });
    });
}

// 3. SISTEMA DE MENÚ E INTERACCIÓN DE NAVEGACIÓN
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > CONFIG.scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('active');
            }
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        });
    });
}

// 4. GENERADOR Y RENDERIZADOR DE RENDIMIENTO PARA PARTÍCULAS
function initCanvasParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    let numberOfParticles = 0;

    function resizeContext() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        if (window.innerWidth < 768) {
            numberOfParticles = Math.floor((canvas.width * canvas.height) / 18000);
        } else {
            numberOfParticles = Math.floor((canvas.width * canvas.height) / 9000);
        }
        generateFleet();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.2 + 0.4;
            this.speedX = (Math.random() - 0.5) * CONFIG.particleVelocityFactor;
            this.speedY = (Math.random() - 0.5) * CONFIG.particleVelocityFactor;
            this.color = Math.random() > 0.5 ? 'rgba(230, 57, 70, 0.12)' : 'rgba(212, 175, 55, 0.1)';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
            if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function generateFleet() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function traceConnections() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < CONFIG.particleConnectionDistance) {
                    let opacity = (1 - (distance / CONFIG.particleConnectionDistance)) * 0.03;
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function renderLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        traceConnections();
        requestAnimationFrame(renderLoop);
    }

    window.addEventListener('resize', resizeContext);
    resizeContext();
    renderLoop();
}

// 5. ANIMACIONES SUAVES DE CONTADORES CON INTERSECTION OBSERVER
function initAnimatedCounters() {
    const statsSection = document.getElementById('estadisticas');
    const numbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    if (!statsSection) return;

    function executeCounting() {
        const totalDuration = 2000;

        numbers.forEach(num => {
            const finalValue = parseInt(num.getAttribute('data-target'), 10);
            const initialTimestamp = performance.now();

            function frameStep(currentTimestamp) {
                const elapsedTime = currentTimestamp - initialTimestamp;
                const linearProgress = Math.min(elapsedTime / totalDuration, 1);
                const smoothedProgress = 1 - Math.pow(1 - linearProgress, 3);
                const currentFrameValue = Math.floor(smoothedProgress * finalValue);

                num.textContent = currentFrameValue;

                if (linearProgress < 1) {
                    requestAnimationFrame(frameStep);
                } else {
                    num.textContent = finalValue;
                }
            }
            requestAnimationFrame(frameStep);
        });
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                executeCounting();
                counterObserver.unobserve(statsSection);
            }
        });
    }, { threshold: 0.2 });

    counterObserver.observe(statsSection);
}

// 6. DETECCIÓN DE ELEMENTOS Y ANIMACIÓN SCROLL REVEAL NATIVA
function initScrollReveal() {
    const targets = document.querySelectorAll('.reveal-element');
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('active');
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: CONFIG.revealOffset,
        rootMargin: "0px 0px -30px 0px"
    });

    targets.forEach(element => {
        if (!element.classList.contains('hero-content')) {
            revealObserver.observe(element);
        }
    });
}

// 7. ORQUESTRADOR CENTRALIZADO (INICIALIZADOR ÚNICO)
function init() {
    initDynamicLinks(); // Inicializa el gestor único de enlaces
    initNavigation();
    initCanvasParticles();
    initAnimatedCounters();
    initScrollReveal();
}

document.addEventListener('DOMContentLoaded', init);