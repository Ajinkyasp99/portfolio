/**
 * typing.js — Terminal Typing Effect
 * Simulates typing commands in the hero terminal.
 * Edit the `commands` array below to change what gets typed.
 */

export function initTyping() {
  const textEl = document.getElementById('typing-text');
  const cursorEl = document.getElementById('cursor');
  if (!textEl) return;

  const commands = [
    'cat about.md',
    'echo "4+ years building scalable backends"',
    'docker swarm init --advertise-addr manager',
    'python manage.py runserver 0.0.0.0:8000',
    'kafka-console-consumer --topic alerts',
    'ollama run qwen2.5-coder:7b',
    'ssh deploy@production -i ~/.ssh/id_ed25519',
  ];

  let commandIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let currentText = '';

  const TYPE_SPEED = 55;
  const DELETE_SPEED = 30;
  const PAUSE_AFTER_TYPE = 2500;
  const PAUSE_AFTER_DELETE = 500;

  function tick() {
    const fullText = commands[commandIdx];

    if (!isDeleting) {
      // Typing
      charIdx++;
      currentText = fullText.substring(0, charIdx);
      textEl.textContent = currentText;

      if (charIdx === fullText.length) {
        // Finished typing, pause then delete
        setTimeout(() => {
          isDeleting = true;
          tick();
        }, PAUSE_AFTER_TYPE);
        return;
      }

      setTimeout(tick, TYPE_SPEED + Math.random() * 40);
    } else {
      // Deleting
      charIdx--;
      currentText = fullText.substring(0, charIdx);
      textEl.textContent = currentText;

      if (charIdx === 0) {
        isDeleting = false;
        commandIdx = (commandIdx + 1) % commands.length;
        setTimeout(tick, PAUSE_AFTER_DELETE);
        return;
      }

      setTimeout(tick, DELETE_SPEED);
    }
  }

  // Start after a small delay
  setTimeout(tick, 1200);
}
