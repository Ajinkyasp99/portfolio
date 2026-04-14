/**
 * animations.js — GSAP Scroll Animations
 * Handles all reveal animations, stagger effects, counter animations,
 * skill bar fills, and interactive hover effects.
 *
 * Uses a batch-based approach that sets initial invisible states via CSS
 * and animates them to visible on scroll, with proper handling
 * for elements already in view on page load.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Helper: Animate elements from hidden to visible on scroll.
 * Sets elements to hidden first, then uses ScrollTrigger.batch
 * or standard ScrollTrigger to reveal them.
 */
function revealOnScroll(selector, triggerSelector, fromVars, toVars, staggerVal = 0.1) {
  const elements = gsap.utils.toArray(selector);
  if (!elements.length) return;

  const trigger = triggerSelector 
    ? document.querySelector(triggerSelector) 
    : elements[0];
  if (!trigger) return;

  // Set initial hidden state
  gsap.set(elements, fromVars);

  // Create scroll trigger
  ScrollTrigger.create({
    trigger: trigger,
    start: 'top 90%',
    once: true,
    onEnter: () => {
      gsap.to(elements, {
        ...toVars,
        stagger: staggerVal,
        overwrite: 'auto',
      });
    },
  });
}

export function initAnimations() {
  // ── Hero entrance (no scroll trigger, plays on load) ──
  const heroTl = gsap.timeline({ delay: 0.3 });

  heroTl
    .from('.hero__terminal', {
      y: -30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
    .from('#hero-status', {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.2')
    .from('#hero-greeting', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.2')
    .from('#hero-name .hero__name-line', {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
    }, '-=0.3')
    .from('#hero-accent-line', {
      scaleX: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.2')
    .from('#hero-roles', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.2')
    .from('#hero-stats .hero__stat, #hero-stats .hero__stat-divider', {
      y: 15,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power3.out',
    }, '-=0.2')
    .from('#hero-actions .btn', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out',
    }, '-=0.2')
    .from('#scroll-indicator', {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.2');

  // ── Role rotation ──
  initRoleRotation();

  // ── Section headers ──
  gsap.utils.toArray('.section__header').forEach((header) => {
    const children = gsap.utils.toArray(header.children);
    revealOnScroll(
      children, null,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
      0.1
    );
    // Set trigger to the header itself
    ScrollTrigger.getAll().at(-1).vars.trigger = header;
  });

  // ── About cards ──
  revealOnScroll(
    '.about__card', '.about__grid',
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
    0.15
  );

  // ── Stats counter ──
  gsap.utils.toArray('.stat__number').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => {
        gsap.to(el, {
          textContent: target,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].textContent);
          },
        });
      },
    });
  });

  // ── Skill cards ──
  revealOnScroll(
    '.skill-card', '.skills__bento',
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
    0.1
  );

  // ── Skill bars fill ──
  gsap.utils.toArray('.skill-bar').forEach((bar) => {
    ScrollTrigger.create({
      trigger: bar,
      start: 'top 92%',
      once: true,
      onEnter: () => bar.classList.add('animated'),
    });
  });

  // ── Timeline items ──
  gsap.utils.toArray('.timeline__item').forEach((item, i) => {
    gsap.set(item, { x: -30, opacity: 0 });
    ScrollTrigger.create({
      trigger: item,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(item, {
          x: 0,
          opacity: 1,
          duration: 0.7,
          delay: i * 0.08,
          ease: 'power3.out',
        });
      },
    });
  });

  // ── Project cards ──
  revealOnScroll(
    '.project-card', '.projects__grid',
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
    0.15
  );

  // ── Contact info ──
  revealOnScroll(
    '.contact__info', '.contact__centered',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
    0
  );

  // ── Contact links ──
  revealOnScroll(
    '.contact-link', '.contact__links',
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' },
    0.08
  );

  // ── Currently section cards ──
  revealOnScroll(
    '.currently__card', '.currently__grid',
    { y: 40, opacity: 0, scale: 0.95 },
    { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' },
    0.15
  );

  // ── Skill tag proficiency fills ──
  gsap.utils.toArray('.skill-tag__fill').forEach((fill) => {
    const tag = fill.parentElement;
    const proficiency = tag.dataset.proficiency || '0';
    ScrollTrigger.create({
      trigger: tag,
      start: 'top 95%',
      once: true,
      onEnter: () => {
        gsap.to(fill, {
          width: `${proficiency}%`,
          duration: 1.2,
          ease: 'power2.out',
        });
      },
    });
  });

  // ── Parallax on gradient orbs ──
  gsap.utils.toArray('.about::before, .skills::before, .projects::before').forEach(() => {
    // Pseudo-elements can't be animated with GSAP directly,
    // so we use scroll-linked transforms on sections
  });

  // ── Timeline achievement hover animation ──
  gsap.utils.toArray('.timeline__achievement').forEach((item) => {
    gsap.set(item, { opacity: 0.7 });
    ScrollTrigger.create({
      trigger: item,
      start: 'top 95%',
      once: true,
      onEnter: () => {
        gsap.to(item, {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
        });
      },
    });
  });

  // ── Hero name gradient animation ──
  const heroAccent = document.querySelector('.hero__name-line--accent');
  if (heroAccent) {
    heroAccent.classList.add('text-gradient-animated');
  }

  // Force refresh so already-visible sections trigger immediately
  ScrollTrigger.refresh(true);
}

/**
 * initRoleRotation — Cycles through role text in the hero section
 * Uses a clip-path reveal animation for smooth text transitions.
 */
function initRoleRotation() {
  const roleEl = document.getElementById('hero-role');
  if (!roleEl) return;

  const roles = [
    'Scalable Backend Systems',
    'Distributed Data Pipelines',
    'Real-time IoT Platforms',
    'Local AI Infrastructure',
    'Microservice Architectures',
    'Docker Swarm Clusters',
  ];

  let currentIdx = 0;

  function rotateRole() {
    const tl = gsap.timeline();

    tl.to(roleEl, {
      y: -20,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        currentIdx = (currentIdx + 1) % roles.length;
        roleEl.textContent = roles[currentIdx];
      },
    })
    .set(roleEl, { y: 20 })
    .to(roleEl, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power3.out',
    });
  }

  // Start rotating after initial hero animation completes
  setInterval(rotateRole, 3000);
}

/**
 * initMagneticButtons — Magnetic hover effect on buttons
 * Buttons follow the cursor slightly when hovered.
 */
export function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const buttons = document.querySelectorAll('.magnetic-btn');

  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.2,
        y: y * 0.2,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      });
    });
  });
}
