/**
 * main.js — Portfolio Entry Point
 * Imports all styles and initializes all interactive modules.
 */

// ── Styles ──
import './styles/variables.css';
import './styles/base.css';
import './styles/components.css';
import './styles/animations.css';
import './styles/responsive.css';

// ── Modules ──
import { initParticles } from './js/particles.js';
import { initAnimations, initMagneticButtons } from './js/animations.js';
import { initTyping } from './js/typing.js';
import { initNavbar } from './js/navbar.js';
import { initCursor } from './js/cursor.js';
import Lenis from 'lenis';
import VanillaTilt from 'vanilla-tilt';

// ── Initialize Lenis Smooth Scroll ──
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Handle anchor clicks with Lenis
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      lenis.scrollTo(target, { offset: -40 });
    }
  });
});

// ── Initialize Vanilla Tilt (desktop only) ──
function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const tiltElements = document.querySelectorAll('[data-tilt]');
  VanillaTilt.init(Array.from(tiltElements), {
    max: 6,
    speed: 400,
    glare: true,
    'max-glare': 0.08,
    perspective: 1200,
  });
}

// ── Dynamic Experience Years Calculator ──
// Automatically calculates years of experience from the start date
function initDynamicExperience() {
  const statEl = document.getElementById('stat-years');
  const bioEl = document.getElementById('dynamic-years');
  if (!statEl) return;

  const startDate = new Date(statEl.dataset.startDate || '2022-02-01');
  const now = new Date();
  const diffMs = now - startDate;
  const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
  const years = Math.floor(diffYears);

  // Update the stat counter's data-count so GSAP animates to the right number
  statEl.setAttribute('data-count', years);

  // Update the bio text
  if (bioEl) {
    bioEl.textContent = `${years}+`;
  }
}

// ── Initialize Everything When DOM is Ready ──
document.addEventListener('DOMContentLoaded', () => {
  // Core
  initNavbar();
  initTyping();
  initCursor();
  initDynamicExperience();

  // WebGL particles (with fallback)
  try {
    initParticles();
  } catch (err) {
    console.warn('WebGL particles failed to initialize:', err);
    // Fallback: just show a gradient background
    const canvas = document.getElementById('hero-canvas');
    if (canvas) canvas.style.display = 'none';
  }

  // GSAP animations
  initAnimations();
  initMagneticButtons();

  // Tilt effect
  initTilt();
});
