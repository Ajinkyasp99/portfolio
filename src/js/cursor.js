/**
 * cursor.js — Custom Cursor Effect
 * Shows a small dot + larger circle follower that react to hovering on interactive elements.
 * Automatically disabled on touch devices.
 */

export function initCursor() {
  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = -100;
  let mouseY = -100;
  let followerX = -100;
  let followerY = -100;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animate() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;

    cursor.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    follower.style.transform = `translate(${followerX - 18}px, ${followerY - 18}px)`;

    requestAnimationFrame(animate);
  }

  animate();

  // Hover detection for interactive elements
  const interactiveSelectors = 'a, button, input, textarea, .bento-item, .timeline__content, .skill-tag';
  
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      follower.classList.add('hovering');
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      follower.classList.remove('hovering');
    }
  }, { passive: true });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
}
