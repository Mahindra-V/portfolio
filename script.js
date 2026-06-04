// === PARTICLE SYSTEM ===
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.speedX; this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124,108,240,${this.opacity})`; ctx.fill();
    }
  }
  for (let i = 0; i < 80; i++) particles.push(new Particle());
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,108,240,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// === CURSOR GLOW ===
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow) {
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
  });
}

// === NAVBAR SCROLL ===
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// === MOBILE MENU ===
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// === ACTIVE NAV LINK ===
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 150;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
});

// === SCROLL REVEAL ===
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => { entry.target.classList.add('visible'); }, index * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
revealElements.forEach(el => observer.observe(el));

// === SKILL BARS ANIMATION ===
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-bars').forEach(el => barObserver.observe(el));

// === TYPING EFFECT ===
const typeTarget = document.querySelector('.typing-text');
if (typeTarget) {
  const words = ['Flutter Developer', 'React Native Developer', 'Mobile App Developer', 'AI Integration Expert'];
  let wordIndex = 0, charIndex = 0, isDeleting = false;
  function typeEffect() {
    const current = words[wordIndex];
    typeTarget.textContent = current.substring(0, charIndex);
    if (!isDeleting && charIndex < current.length) {
      charIndex++; setTimeout(typeEffect, 70);
    } else if (isDeleting && charIndex > 0) {
      charIndex--; setTimeout(typeEffect, 35);
    } else if (!isDeleting && charIndex === current.length) {
      isDeleting = true; setTimeout(typeEffect, 2000);
    } else {
      isDeleting = false; wordIndex = (wordIndex + 1) % words.length;
      setTimeout(typeEffect, 400);
    }
  }
  typeEffect();
}

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// === COUNTER ANIMATION ===
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const suffix = counter.getAttribute('data-suffix') || '';
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      counter.textContent = Math.floor(current) + suffix;
    }, 25);
  });
}
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { animateCounters(); statsObserver.unobserve(entry.target); }
  });
}, { threshold: 0.5 });
const statsSection = document.querySelector('.hero-stats');
if (statsSection) statsObserver.observe(statsSection);

// === FORM HANDLING ===
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-primary');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #00e676, #00e0d0)';
    setTimeout(() => { btn.innerHTML = originalText; btn.style.background = ''; form.reset(); }, 3000);
  });
}

// === 3D TILT EFFECT ON CARDS ===
document.querySelectorAll('.project-card-v2, .skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    // Dynamic glow effect following cursor
    const glowX = ((e.clientX - rect.left) / rect.width) * 100;
    const glowY = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(124,108,240,0.06) 0%, rgba(255,255,255,0.025) 50%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.background = '';
  });
});

// === 3D AVATAR TILT ON MOUSE MOVE ===
const heroTilt = document.getElementById('hero-tilt');
const hero3dScene = document.querySelector('.hero-3d-scene');
if (hero3dScene) {
  hero3dScene.addEventListener('mousemove', (e) => {
    const rect = hero3dScene.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    if (heroTilt) {
      heroTilt.style.transform = `perspective(800px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) scale(1.02)`;
    }
  });
  hero3dScene.addEventListener('mouseleave', () => {
    if (heroTilt) {
      heroTilt.style.transform = '';
    }
  });
}

// === PARALLAX SCROLL EFFECT ===
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  // Hero parallax layers
  const heroOrbs = document.querySelectorAll('.hero-orb');
  heroOrbs.forEach((orb, i) => {
    const speed = 0.1 + i * 0.05;
    orb.style.transform = `translate(0, ${scrolled * speed}px)`;
  });
  // Sections subtle parallax
  document.querySelectorAll('.section-header').forEach(header => {
    const rect = header.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      header.style.transform = `translateY(${(progress - 0.5) * -15}px)`;
    }
  });
});

// === MAGNETIC HOVER ON BUTTONS ===
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// === 3D CERT CARD TILT ===
document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-4px) perspective(600px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// === SMOOTH REVEAL WITH STAGGER ===
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const children = entry.target.querySelectorAll('.project-card-v2, .skill-card, .cert-card');
      children.forEach((child, i) => {
        setTimeout(() => {
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        }, i * 120);
      });
      staggerObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.projects-showcase, .skills-masonry, .certs-grid').forEach(el => staggerObserver.observe(el));

// === AUTO SCROLL SECTIONS ===
const autoScrollSections = ['#home', '#about', '#skills', '#projects'];
let currentScrollIndex = 0;
let autoScrollTimer = setInterval(scrollToNextSection, 5000);

function scrollToNextSection() {
  currentScrollIndex = (currentScrollIndex + 1) % autoScrollSections.length;
  const target = document.querySelector(autoScrollSections[currentScrollIndex]);
  if (target) {
    // Add offset for the sticky navbar if needed
    const headerOffset = 80;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;
    
    window.scrollTo({
         top: offsetPosition,
         behavior: "smooth"
    });
  }
}

// Pause auto-scroll on user interaction so we don't annoy the user if they want to stop and read
function stopAutoScroll() {
  if (autoScrollTimer) {
    clearInterval(autoScrollTimer);
    autoScrollTimer = null;
  }
}

// Listen to various interactions to stop the auto scroll
window.addEventListener('wheel', stopAutoScroll, { passive: true });
window.addEventListener('touchmove', stopAutoScroll, { passive: true });
window.addEventListener('keydown', stopAutoScroll, { passive: true });
window.addEventListener('mousedown', stopAutoScroll, { passive: true });

