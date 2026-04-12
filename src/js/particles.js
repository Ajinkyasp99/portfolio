/**
 * particles.js — Three.js Particle Field
 * Creates an interactive floating particle system in the hero canvas.
 * Gracefully degrades on mobile (fewer particles).
 * To swap with a different effect:
 *   - Replace the init/animate functions below with your own Three.js scene
 *   - Or import a different WebGL library and target the #hero-canvas element
 */

import * as THREE from 'three';

export function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth < 1024;

  // ── Scene Setup ──
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isMobile,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ── Particles ──
  const particleCount = isMobile ? 800 : isTablet ? 1500 : 2500;
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const colors = new Float32Array(particleCount * 3);

  const colorCyan = new THREE.Color(0x00f0ff);
  const colorPurple = new THREE.Color(0x7b2ff7);
  const colorWhite = new THREE.Color(0xffffff);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 120;
    positions[i3 + 1] = (Math.random() - 0.5) * 120;
    positions[i3 + 2] = (Math.random() - 0.5) * 80;

    velocities[i3] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

    sizes[i] = Math.random() * 2.5 + 0.5;

    // Color distribution: cyan, purple, white
    const colorChoice = Math.random();
    let color;
    if (colorChoice < 0.4) color = colorCyan;
    else if (colorChoice < 0.7) color = colorPurple;
    else color = colorWhite;

    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Custom shader for soft round particles
  const vertexShader = `
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      vAlpha = smoothstep(100.0, 20.0, -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      float alpha = smoothstep(0.5, 0.1, dist) * vAlpha * 0.6;
      gl_FragColor = vec4(vColor, alpha);
    }
  `;

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // ── Connection Lines ──
  const lineCount = isMobile ? 50 : 150;
  const lineGeometry = new THREE.BufferGeometry();
  const linePositions = new Float32Array(lineCount * 6);
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.06,
    blending: THREE.AdditiveBlending,
  });

  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  // ── Mouse Interaction ──
  const mouse = { x: 0, y: 0 };
  let mouseTarget = { x: 0, y: 0 };

  function onMouseMove(e) {
    mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  if (!isMobile) {
    window.addEventListener('mousemove', onMouseMove, { passive: true });
  }

  // ── Resize ──
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onResize, { passive: true });

  // ── Animation Loop ──
  let frame = 0;
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    frame++;

    const elapsed = clock.getElapsedTime();
    const posArray = geometry.attributes.position.array;

    // Smooth mouse lerp
    mouse.x += (mouseTarget.x - mouse.x) * 0.05;
    mouse.y += (mouseTarget.y - mouse.y) * 0.05;

    // Update particle positions
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      posArray[i3] += velocities[i3] + Math.sin(elapsed * 0.3 + i * 0.01) * 0.008;
      posArray[i3 + 1] += velocities[i3 + 1] + Math.cos(elapsed * 0.2 + i * 0.01) * 0.008;
      posArray[i3 + 2] += velocities[i3 + 2];

      // Boundary wrap
      if (Math.abs(posArray[i3]) > 60) posArray[i3] *= -0.98;
      if (Math.abs(posArray[i3 + 1]) > 60) posArray[i3 + 1] *= -0.98;
      if (Math.abs(posArray[i3 + 2]) > 40) posArray[i3 + 2] *= -0.98;
    }

    geometry.attributes.position.needsUpdate = true;

    // Update connection lines (every 3rd frame for performance)
    if (frame % 3 === 0) {
      const linePosArray = lineGeometry.attributes.position.array;
      let lineIdx = 0;
      const maxDist = isMobile ? 15 : 20;

      for (let i = 0; i < Math.min(particleCount, 200) && lineIdx < lineCount * 6; i++) {
        for (let j = i + 1; j < Math.min(particleCount, 200) && lineIdx < lineCount * 6; j++) {
          const i3 = i * 3;
          const j3 = j * 3;
          const dx = posArray[i3] - posArray[j3];
          const dy = posArray[i3 + 1] - posArray[j3 + 1];
          const dz = posArray[i3 + 2] - posArray[j3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDist) {
            linePosArray[lineIdx++] = posArray[i3];
            linePosArray[lineIdx++] = posArray[i3 + 1];
            linePosArray[lineIdx++] = posArray[i3 + 2];
            linePosArray[lineIdx++] = posArray[j3];
            linePosArray[lineIdx++] = posArray[j3 + 1];
            linePosArray[lineIdx++] = posArray[j3 + 2];
          }
        }
      }

      // Clear remaining lines
      for (let i = lineIdx; i < lineCount * 6; i++) {
        linePosArray[i] = 0;
      }

      lineGeometry.attributes.position.needsUpdate = true;
    }

    // Camera sway with mouse
    particles.rotation.y = mouse.x * 0.15 + elapsed * 0.03;
    particles.rotation.x = mouse.y * 0.1;

    renderer.render(scene, camera);
  }

  animate();

  // ── Cleanup ──
  return () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
    geometry.dispose();
    material.dispose();
  };
}
