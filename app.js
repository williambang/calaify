// Check if Service Worker is supported
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/calify/sw.js').then(() => {
      console.log('Service Worker Registered');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeDailyData();
  updateUI();
  setupEventHandlers();
});

function getPreviousDate(date) {
  const prevDate = new Date(date);
  prevDate.setDate(prevDate.getDate() - 1);
  return prevDate.toISOString().slice(0, 10);
}

function initializeDailyData() {
  let dailyData = JSON.parse(localStorage.getItem('dailyData')) || [];
  const currentDate = new Date().toISOString().slice(0, 10);
  const totalCalories = 3000; // Example daily goal

  if (!dailyData.some(entry => entry.date === currentDate)) {
      let previousDay = getPreviousDate(currentDate);
      let previousEntry = dailyData.find(entry => entry.date === previousDay);
      let overflow = previousEntry ? Math.max(0, previousEntry.calories - totalCalories) : 0;
      dailyData.push({ date: currentDate, calories: overflow });
      localStorage.setItem('dailyData', JSON.stringify(dailyData));
  }
}

function adjustCalories(amount) {
  let dailyData = JSON.parse(localStorage.getItem('dailyData')) || [];
  const currentDate = new Date().toISOString().slice(0, 10);
  let todayEntry = dailyData.find(entry => entry.date === currentDate);

  if (todayEntry) {
      todayEntry.calories += amount;
      localStorage.setItem('dailyData', JSON.stringify(dailyData));
      updateUI();
  }
}

function updateUI() {
  const currentDate = new Date().toISOString().slice(0, 10);
  let dailyData = JSON.parse(localStorage.getItem('dailyData')) || [];
  let todayEntry = dailyData.find(entry => entry.date === currentDate);

  if (todayEntry) {
      document.getElementById('current-calories').textContent = todayEntry.calories;
      updateProgressBar(todayEntry.calories);
  }
}

function updateProgressBar(currentCalories) {
  const progressBar = document.getElementById('progress-bar');
  const totalCalories = 3000; // Example daily goal
  const filledBoxes = Math.round((currentCalories / totalCalories) * 100);

  progressBar.innerHTML = ''; // Clear previous content
  for (let i = 0; i < filledBoxes; i++) {
      const box = document.createElement('div');
      box.className = 'calorie-box';
      progressBar.appendChild(box);
  }
}

function setupEventHandlers() {
  document.querySelectorAll('.adjust-button').forEach(button => {
      button.addEventListener('click', function() {
          const amount = parseInt(this.getAttribute('data-amount'), 10);
          adjustCalories(amount);
      });
  });
}
