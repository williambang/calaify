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
  const currentDate = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

  // Initialize or update daily data from Local Storage
  function initializeDailyData() {
      let dailyData = JSON.parse(localStorage.getItem('dailyData')) || {};
      if (!dailyData[currentDate]) {
          dailyData[currentDate] = 0; // Start with 0 calories for new day
          localStorage.setItem('dailyData', JSON.stringify(dailyData));
      }
      return dailyData;
  }

  let dailyData = initializeDailyData();

  // Update UI with current day's calorie data
  function updateUI() {
      currentCaloriesSpan.textContent = dailyData[currentDate];
      updateProgressBar();
  }

  adjustButtons.forEach(button => {
      button.addEventListener('click', () => {
          const amount = parseInt(button.getAttribute('data-amount'));
          dailyData[currentDate] = Math.max(0, dailyData[currentDate] + amount); // Prevent negative calories
          localStorage.setItem('dailyData', JSON.stringify(dailyData)); // Save updated data to Local Storage
          updateUI();
      });
  });

  function updateProgressBar() {
      const totalCalories = parseInt(document.getElementById('total-calories').textContent);
      const filledBoxes = Math.round((dailyData[currentDate] / totalCalories) * 100);
      progressBar.innerHTML = ''; // Clear previous boxes
      for (let i = 0; i < filledBoxes; i++) {
          const box = document.createElement('div');
          progressBar.appendChild(box);
      }
  }

  updateUI(); // Initial UI update based on today's data
});

