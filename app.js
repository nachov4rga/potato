const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const setupCursorGlow = () => {
    const cursorGlow = document.querySelector('.cursor-glow');

    if (!cursorGlow || prefersReducedMotion.matches) {
        return;
    }

    let rafId = null;
    let pointer = { x: 0, y: 0 };

    const render = () => {
        cursorGlow.style.left = `${pointer.x}px`;
        cursorGlow.style.top = `${pointer.y}px`;
        rafId = null;
    };

    document.addEventListener('mousemove', (event) => {
        pointer = { x: event.clientX, y: event.clientY };

        if (rafId === null) {
            rafId = window.requestAnimationFrame(render);
        }
    });
};

const setupProjectTilt = () => {
    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach((card) => {
        const spotlight = card.querySelector('.project-spotlight');

        const resetCard = () => {
            card.style.transform = '';
        };

        card.addEventListener('mousemove', (event) => {
            if (prefersReducedMotion.matches) {
                return;
            }

            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            if (spotlight) {
                spotlight.style.left = `${x - 208}px`;
                spotlight.style.top = `${y - 208}px`;
            }

            const rotateY = clamp(((x / rect.width) - 0.5) * 10, -5, 5);
            const rotateX = clamp((((y / rect.height) - 0.5) * -10), -5, 5);

            card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', resetCard);
        card.addEventListener('blur', resetCard, true);
    });
};

const setupRevealAnimations = () => {
    const targets = document.querySelectorAll(
        '.services, .projects, .process, .about, .contact, .trust-item, .service-card, .project-card, .process-step, .hero-stat'
    );

    if (!targets.length) {
        return;
    }

    targets.forEach((element) => {
        element.classList.add('is-reveal');
    });

    if (prefersReducedMotion.matches) {
        targets.forEach((element) => element.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.16,
        rootMargin: '0px 0px -60px 0px',
    });

    targets.forEach((element) => observer.observe(element));
};

const setupCounterAnimation = () => {
    const counters = document.querySelectorAll('[data-count]');

    if (!counters.length) {
        return;
    }

    const animateCounter = (element) => {
        const rawTarget = Number(element.dataset.count);
        const suffix = element.textContent.replace(String(rawTarget), '');
        const startTime = performance.now();
        const duration = 1200;

        const update = (now) => {
            const progress = clamp((now - startTime) / duration, 0, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(rawTarget * eased);
            element.textContent = `${value}${suffix}`;

            if (progress < 1) {
                window.requestAnimationFrame(update);
            }
        };

        window.requestAnimationFrame(update);
    };

    if (prefersReducedMotion.matches) {
        counters.forEach((counter) => {
            const target = counter.dataset.count;
            const suffix = counter.textContent.replace(String(target), '');
            counter.textContent = `${target}${suffix}`;
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            animateCounter(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.8 });

    counters.forEach((counter) => observer.observe(counter));
};

const setupSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');

            if (!targetId || targetId === '#') {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const offset = target.getBoundingClientRect().top + window.scrollY - 96;
            window.scrollTo({
                top: offset,
                behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
            });
        });
    });
};

const setupActiveNav = () => {
    const links = [...document.querySelectorAll('.nav-links a')];
    const sections = links
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (!links.length || !sections.length) {
        return;
    }

    const updateActiveLink = () => {
        const marker = window.scrollY + 160;
        let activeId = sections[0].id;

        sections.forEach((section) => {
            if (section.offsetTop <= marker) {
                activeId = section.id;
            }
        });

        links.forEach((link) => {
            const matches = link.getAttribute('href') === `#${activeId}`;
            link.classList.toggle('is-active', matches);
        });
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
};

const setupNavBackground = () => {
    const nav = document.querySelector('.nav');
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');

    if (!nav) {
        return;
    }

    const updateState = () => {
        const scrolled = window.scrollY;
        const elevated = scrolled > 40;

        nav.style.background = elevated
            ? 'rgba(5, 16, 29, 0.84)'
            : 'rgba(6, 17, 31, 0.62)';
        nav.style.boxShadow = elevated
            ? '0 16px 42px rgba(0, 0, 0, 0.22)'
            : '0 12px 40px rgba(0, 0, 0, 0.16)';

        if (prefersReducedMotion.matches) {
            return;
        }

        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.08}px)`;
            heroContent.style.opacity = String(clamp(1 - scrolled / 1200, 0, 1));
        }

        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrolled * 0.12}px)`;
        }
    };

    window.addEventListener('scroll', updateState, { passive: true });
    updateState();
};

const setupFooterYear = () => {
    const year = document.getElementById('currentYear');

    if (year) {
        year.textContent = String(new Date().getFullYear());
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setupCursorGlow();
    setupProjectTilt();
    setupRevealAnimations();
    setupCounterAnimation();
    setupSmoothScroll();
    setupActiveNav();
    setupNavBackground();
    setupFooterYear();
});
