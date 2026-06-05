// === PREMIUM CONSTELLATION PARTICLE SYSTEM ===
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  
  function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  document.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });
  
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = (Math.random() - 0.5) * canvas.width * 2;
      this.y = (Math.random() - 0.5) * canvas.height * 2;
      this.z = Math.random() * 1500 + 100; // 3D Depth
      this.baseZ = this.z;
      this.speedZ = (Math.random() - 0.5) * 2;
      this.size = Math.random() * 2 + 0.5;
    }
    update() {
      // Move in Z space
      this.z += this.speedZ;
      if (this.z < 100) this.z = 1600;
      if (this.z > 1600) this.z = 100;
      
      // Calculate 3D to 2D perspective projection
      const fov = 800;
      const scale = fov / this.z;
      
      // Interactive camera tilt based on mouse
      let cameraX = 0;
      let cameraY = 0;
      if (mouse.x !== -1000) {
        cameraX = (mouse.x - canvas.width / 2) * 0.5;
        cameraY = (mouse.y - canvas.height / 2) * 0.5;
      }
      
      // Scroll Parallax mapped to Y with infinite wrap
      const scrollY = window.scrollY;
      let viewY = this.y - scrollY * 0.3;
      
      // Wrap viewY so particles never run out
      const wrapHeight = canvas.height * 4;
      viewY = ((viewY % wrapHeight) + wrapHeight) % wrapHeight - wrapHeight / 2;
      
      this.screenX = (this.x - cameraX) * scale + canvas.width / 2;
      this.screenY = (viewY - cameraY) * scale + canvas.height / 2;
      this.screenSize = this.size * scale;
      this.opacity = Math.max(0, 1 - (this.z / 1600));
    }
    draw() {
      if (this.screenX > -100 && this.screenX < canvas.width + 100 && this.screenY > -100 && this.screenY < canvas.height + 100) {
        ctx.beginPath(); 
        ctx.arc(this.screenX, this.screenY, this.screenSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 224, 208, ${this.opacity})`; 
        ctx.fill();
      }
    }
  }
  
  for (let i = 0; i < 150; i++) particles.push(new Particle());
  
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Add glowing effect
    ctx.globalCompositeOperation = 'screen';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00e0d0';

    particles.forEach(p => { p.update(); p.draw(); });
    
    // Draw 3D network connections
    ctx.shadowBlur = 0; // Turn off shadow for lines to save performance
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        
        // Only connect if close in Z-space AND screen space
        if (Math.abs(p1.z - p2.z) < 300) {
          const dx = p1.screenX - p2.screenX;
          const dy = p1.screenY - p2.screenY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120 * (800 / Math.min(p1.z, p2.z))) { // Dynamic distance based on depth
            const opacity = (1 - dist / (120 * (800 / Math.min(p1.z, p2.z)))) * Math.min(p1.opacity, p2.opacity) * 0.5;
            if (opacity > 0) {
              ctx.beginPath(); 
              ctx.moveTo(p1.screenX, p1.screenY);
              ctx.lineTo(p2.screenX, p2.screenY);
              ctx.strokeStyle = `rgba(124, 108, 240, ${opacity})`;
              ctx.lineWidth = 1 * (800 / p1.z); // Line thickness scales with depth
              ctx.stroke();
            }
          }
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

// === GLOBAL PARALLAX SCROLL EFFECT ===
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  
  // Sections subtle parallax
  document.querySelectorAll('.section-header').forEach(header => {
    const rect = header.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      header.style.transform = `translateY(${(progress - 0.5) * -20}px)`;
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

