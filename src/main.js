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
import { initAnimations, initMagneticButtons } from './js/animations.js';
import { initNavbar } from './js/navbar.js';
import { initCursor } from './js/cursor.js';
import { initTyping } from './js/typing.js';
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
  initCursor();
  initTyping();
  initDynamicExperience();
  initScrollProgress();

  // GSAP animations
  initAnimations();
  initMagneticButtons();

  // Tilt effect
  initTilt();

  // Skill tag proficiency tooltip
  initSkillTooltips();
});

// ── Scroll Progress Bar ──
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  progressBar.style.width = '0%';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

// ── Skill Tag Proficiency Tooltip ──
function initSkillTooltips() {
  const tags = document.querySelectorAll('.skill-tag[data-proficiency]');
  tags.forEach((tag) => {
    const proficiency = tag.dataset.proficiency;
    tag.style.setProperty('--tag-proficiency', `${proficiency}%`);

    // Add a subtle bottom border that fills based on proficiency
    const fill = document.createElement('span');
    fill.className = 'skill-tag__fill';
    fill.style.width = '0%';
    tag.appendChild(fill);
  });
}
