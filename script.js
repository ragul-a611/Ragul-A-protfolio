(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================= Hero cursor spotlight ================= */
  const heroSection = document.querySelector('.hero');
  if (heroSection && !prefersReducedMotion) {
    heroSection.addEventListener('pointermove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      heroSection.style.setProperty('--spot-x', `${x}%`);
      heroSection.style.setProperty('--spot-y', `${y}%`);
    });
  }

  /* ================= Magnetic tilt on cards & photo ================= */
  function attachTilt(el, maxDeg) {
    if (prefersReducedMotion) return;
    let raf = null;

    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0 → 1
      const py = (e.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 2 * maxDeg;
      const rotateX = (0.5 - py) * 2 * maxDeg;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });
    });

    el.addEventListener('pointerleave', () => {
      if (raf) cancelAnimationFrame(raf);
      el.style.transform = '';
    });
  }

  const heroPhotoFrame = document.querySelector('.hero-photo-frame');
  if (heroPhotoFrame) attachTilt(heroPhotoFrame, 8);

  document.querySelectorAll('.skill-card, .cert-card, .fact-card').forEach(card => {
    attachTilt(card, 5);
  });

  /* ================= Mobile nav ================= */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ================= Active nav link on scroll ================= */
  const sections = document.querySelectorAll('main .section, .hero');
  const navLinkMap = new Map();
  document.querySelectorAll('.nav-link').forEach(link => {
    const id = link.getAttribute('href').replace('#', '');
    navLinkMap.set(id, link);
  });

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = navLinkMap.get(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  sections.forEach(sec => { if (sec.id) navObserver.observe(sec); });

  /* ================= Scroll reveal ================= */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ================= Hero role crossfade ================= */
  const heroRoleEl = document.getElementById('heroRole');
  if (heroRoleEl && !prefersReducedMotion) {
    const roles = [
      'Full Stack Developer',
      'Cyber Security Enthusiast',
      'UI/UX Explorer',
      'CSE Student'
    ];
    let roleIndex = 0;

    setInterval(() => {
      heroRoleEl.classList.add('is-swapping');
      setTimeout(() => {
        roleIndex = (roleIndex + 1) % roles.length;
        heroRoleEl.textContent = roles[roleIndex];
        heroRoleEl.classList.remove('is-swapping');
      }, 450);
    }, 2800);
  }

  /* ================= Lightbox ================= */
  const galleries = {
    patient: [
      { src: 'assets/images/project-patient-mgmt.jpg', caption: 'Patient Record & Prescription Management System — Dashboard, Medical History, Prescription & Billing' }
    ],
    cybersec: [
      { src: 'assets/images/project-cybersec-dashboard.jpg', caption: 'Cyber Security Toolkit — Dashboard' },
      { src: 'assets/images/project-cybersec-welcome.jpg', caption: 'Cyber Security Toolkit — Welcome screen' },
      { src: 'assets/images/project-cybersec-login.jpg', caption: 'Cyber Security Toolkit — Login screen' }
    ],
    certs: [
      { src: 'assets/certificates/cert-mern-aalan.jpg', caption: 'MERN Stack Internship — Aalan Tech Soft' },
      { src: 'assets/certificates/cert-cybersecurity-thinkinfo.jpg', caption: 'Cyber Security Internship — ThinkInfo Expert Solutions' },
      { src: 'assets/certificates/cert-python-imagecon.jpg', caption: 'Python Internship — Imagecon India Private Limited' },
      { src: 'assets/certificates/cert-fullstack-novitech.jpg', caption: 'Full Stack Development — NoviTech R&D Private Limited' },
      { src: 'assets/certificates/cert-uiux-novitech.jpg', caption: 'UI/UX Design — NoviTech R&D Private Limited' }
    ]
  };

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let activeGroup = null;
  let activeIndex = 0;
  let lastFocused = null;

  function renderLightbox() {
    const items = galleries[activeGroup];
    const item = items[activeIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.caption;
    lightboxCaption.textContent = `${item.caption}  ·  ${activeIndex + 1}/${items.length}`;
    const multi = items.length > 1;
    lightboxPrev.hidden = !multi;
    lightboxNext.hidden = !multi;
  }

  function openLightbox(group, index, triggerEl) {
    activeGroup = group;
    activeIndex = index;
    lastFocused = triggerEl;
    renderLightbox();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close').focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  function step(delta) {
    const items = galleries[activeGroup];
    activeIndex = (activeIndex + delta + items.length) % items.length;
    renderLightbox();
  }

  document.querySelectorAll('.lightbox-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.lightboxGroup;
      const index = parseInt(btn.dataset.lightboxIndex, 10) || 0;
      if (galleries[group]) openLightbox(group, index, btn);
    });
  });

  document.querySelectorAll('[data-lightbox-close]').forEach(el => {
    el.addEventListener('click', closeLightbox);
  });

  lightboxPrev.addEventListener('click', () => step(-1));
  lightboxNext.addEventListener('click', () => step(1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  /* ================= Contact form ================= */
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('cfStatus');
  const submitBtn = document.getElementById('cfSubmit');

  // Static hosting has no backend, so the form submits via FormSubmit
  // (https://formsubmit.co) straight to the owner's inbox — no server needed.
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/ragularthanari@gmail.com';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // honeypot spam check
    if (form._honey.value) return;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      statusEl.textContent = 'Please fill in your name, email and message.';
      statusEl.className = 'form-status is-error';
      return;
    }

    submitBtn.disabled = true;
    const originalLabel = submitBtn.innerHTML;
    submitBtn.textContent = 'Sending…';
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: form.phone.value.trim(),
          message,
          _subject: 'New message from portfolio site'
        })
      });

      if (res.ok) {
        statusEl.textContent = 'Message sent — thanks! I\'ll get back to you soon.';
        statusEl.className = 'form-status is-success';
        form.reset();
      } else {
        throw new Error('Request failed');
      }
    } catch (err) {
      statusEl.textContent = 'Could not send right now — please email me directly at ragularthanari@gmail.com.';
      statusEl.className = 'form-status is-error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalLabel;
    }
  });

})();
