import '../styles.css';

function startCelebration() {
  // Play music
  const audio = document.getElementById('bg-music');
  audio.play();

  // Dynamically load the main scene (animation)
  import('./scenes/mainScene.js');

  // Hide the button
  document.getElementById('start-btn').style.display = 'none';

  // Stop music after 30 seconds
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
  }, 18000);
}

// Create button and audio in JS
window.addEventListener('DOMContentLoaded', () => {
  // Create audio element
  const audio = document.createElement('audio');
  audio.id = 'bg-music';
  audio.src = '/hbd.mp3';
  audio.loop = true;
  document.body.appendChild(audio);

  // Create button
  const btn = document.createElement('button');
  btn.id = 'start-btn';
  btn.textContent = 'Start the Celebration!';
  btn.style.position = 'absolute';
  btn.style.top = '50%';
  btn.style.left = '50%';
  btn.style.transform = 'translate(-50%, -50%)';
  btn.style.fontSize = '2.2rem';
  btn.style.padding = '1.2rem 3rem';
  btn.style.background = 'linear-gradient(90deg, #ff1744 0%, #ff9100 100%)';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.borderRadius = '50px';
  btn.style.cursor = 'pointer';
  btn.style.zIndex = '1000';
  btn.style.boxShadow = '0 8px 24px rgba(255, 23, 68, 0.2), 0 1.5px 6px rgba(0,0,0,0.08)';
  btn.style.letterSpacing = '2px';
  btn.style.fontWeight = 'bold';
  btn.style.transition = 'background 0.3s, transform 0.2s';

  btn.addEventListener('mouseenter', () => {
    btn.style.background = 'linear-gradient(90deg, #ff9100 0%, #ff1744 100%)';
    btn.style.transform = 'translate(-50%, -50%) scale(1.05)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = 'linear-gradient(90deg, #ff1744 0%, #ff9100 100%)';
    btn.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  btn.addEventListener('click', startCelebration);

  document.body.appendChild(btn);
});