// ============================================
//  REKOVA RECOVERY — MASTER SCRIPT
// ============================================

// ===== EVENT GALLERY SLIDESHOW =====
(function() {
    const track = document.getElementById('slideshowTrack');
    if (!track) return;
    const slides = Array.from(track.querySelectorAll('.slide'));
    const dotsWrap = document.getElementById('slideDots');
    let current = 0;
    let autoTimer;

    // Build dots
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
    });

    function goTo(n) {
        slides[current].classList.remove('active');
        dotsWrap.children[current].classList.remove('active');
        current = (n + slides.length) % slides.length;
        slides[current].classList.add('active');
        dotsWrap.children[current].classList.add('active');
        resetTimer();
    }

    function resetTimer() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => goTo(current + 1), 5000);
    }

    document.getElementById('slidePrev').addEventListener('click', () => goTo(current - 1));
    document.getElementById('slideNext').addEventListener('click', () => goTo(current + 1));

    resetTimer();
})();

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
});

// ===== VIDEO REEL SCROLL =====
const reelTrack = document.getElementById('reelTrack');
const reelPrev = document.getElementById('reelPrev');
const reelNext = document.getElementById('reelNext');

if (reelTrack) {
    const scrollAmount = 340;
    reelNext && reelNext.addEventListener('click', () => {
        reelTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
    reelPrev && reelPrev.addEventListener('click', () => {
        reelTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.form-submit');
        btn.textContent = 'Sending...';
        btn.disabled = true;

        // Simulate send — in production hook to Formspree/EmailJS/etc
        setTimeout(() => {
            contactForm.style.display = 'none';
            if (formSuccess) formSuccess.style.display = 'block';
        }, 1200);
    });
}

// ===== HERO VIDEO FALLBACK =====
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
    heroVideo.addEventListener('error', () => {
        heroVideo.closest('.hero-video-wrap').style.background =
            'linear-gradient(135deg, #0a0000 0%, #000 60%, #0d0000 100%)';
    });
}

// ===== ACTIVE NAV LINK =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});
