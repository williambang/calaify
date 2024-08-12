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

function getDailyData() {
  let dailyData = JSON.parse(localStorage.getItem('dailyData'));
  return Array.isArray(dailyData) ? dailyData : [];
}

function initializeDailyData() {
  let dailyData = getDailyData();
  const currentDate = new Date().toISOString().slice(0, 10);
  const totalCalories = 3000; // Example daily goal

  if (!dailyData.some(entry => entry.date === currentDate)) {
      let previousDay = getPreviousDate(currentDate);
      let previousEntry = dailyData.find(entry => entry.date === previousDay);
      let overflow = previousEntry ? Math.max(0, previousEntry.calories - totalCalories) : 0;
      let deficit = previousEntry ? Math.min(0, previousEntry.calories - totalCalories) : 0;
      dailyData.push({ date: currentDate, calories: overflow, deficit });
      localStorage.setItem('dailyData', JSON.stringify(dailyData));
  }
}

function adjustCalories(amount) {
  let dailyData = getDailyData();
  const currentDate = new Date().toISOString().slice(0, 10);
  let todayEntry = dailyData.find(entry => entry.date === currentDate);

  if (todayEntry) {
      // Ensure calories don't drop below 0
      todayEntry.calories = Math.max(0, todayEntry.calories + amount);
      localStorage.setItem('dailyData', JSON.stringify(dailyData));
      updateUI();
  }
}

function updateUI() {
  const currentDate = new Date().toISOString().slice(0, 10);
  let dailyData = getDailyData();
  let todayEntry = dailyData.find(entry => entry.date === currentDate);
  let previousDay = getPreviousDate(currentDate);
  let previousEntry = dailyData.find(entry => entry.date === previousDay);
  const totalCalories = 3000; // Example daily goal

  if (todayEntry) {
      // Calculate deficit or overflow from the previous day
      let previousOverflow = previousEntry ? Math.max(0, previousEntry.calories - totalCalories) : 0;
      let previousDeficit = previousEntry ? Math.min(0, previousEntry.calories - totalCalories) : 0;
      let adjustedCalories = todayEntry.calories + previousOverflow;
      let displayCalories = todayEntry.calories + previousDeficit;
      document.getElementById('current-calories').textContent = displayCalories;
      updateProgressBar(adjustedCalories, previousDeficit);
  }
}

function updateProgressBar(currentCalories, previousDeficit) {
  const progressBar = document.getElementById('progress-bar');
  const totalCalories = 3000; // Example daily goal
  const maxBoxes = 100; // Maximum number of boxes

  // Calculate the number of red boxes for deficit
  let deficitBoxes = Math.min(maxBoxes, Math.round((Math.abs(previousDeficit) / totalCalories) * maxBoxes));
  // Calculate the number of black boxes for positive calories
  let filledBoxes = Math.min(maxBoxes, Math.round((currentCalories / totalCalories) * maxBoxes));

  // Calculate actual black boxes to show after covering the deficit
  let positiveBoxes = Math.max(0, filledBoxes - deficitBoxes);

  progressBar.innerHTML = ''; // Clear previous content

  // Add red boxes for the deficit
  for (let i = 0; i < deficitBoxes; i++) {
      const box = document.createElement('div');
      box.className = 'calorie-box red-box';
      progressBar.appendChild(box);
  }

  // Add black boxes for the positive calories
  for (let i = 0; i < positiveBoxes; i++) {
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
