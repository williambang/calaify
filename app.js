// Register service worker to control making site work offline

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/calify/sw.js')
    .then(() => { console.log('Service Worker Registered'); });
}

document.addEventListener('DOMContentLoaded', () => {
  const adjustButtons = document.querySelectorAll('.adjust-button');
  const currentCaloriesSpan = document.getElementById('current-calories');
  const progressBar = document.getElementById('progress-bar');
  let currentCalories = parseInt(currentCaloriesSpan.textContent);

  adjustButtons.forEach(button => {
      button.addEventListener('click', () => {
          const amount = parseInt(button.getAttribute('data-amount'));
          currentCalories += amount;
          currentCalories = Math.max(0, currentCalories); // Prevent negative calories
          currentCaloriesSpan.textContent = currentCalories;
          updateProgressBar();
      });
  });

  function updateProgressBar() {
      const totalCalories = parseInt(document.getElementById('total-calories').textContent);
      const filledBoxes = Math.round((currentCalories / totalCalories) * 100);
      progressBar.innerHTML = ''; // Clear previous boxes
      for (let i = 0; i < filledBoxes; i++) {
          const box = document.createElement('div');
          progressBar.appendChild(box);
      }
  }

  updateProgressBar(); // Initial update
});
