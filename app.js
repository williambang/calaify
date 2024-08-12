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

let totalCalories = parseInt(localStorage.getItem('totalCalories'), 10) || 3000; // Example daily goal

function initializeDailyData() {
  let dailyData = getDailyData();
  const currentDate = new Date().toISOString().slice(0, 10);

  if (!dailyData.some(entry => entry.date === currentDate)) {
    let previousDay = getPreviousDate(currentDate);
    let previousEntry = dailyData.find(entry => entry.date === previousDay);
    let overflow = previousEntry ? Math.max(0, previousEntry.calories - totalCalories) : 0;
    let deficit = previousEntry ? Math.min(0, previousEntry.calories - totalCalories) : 0;
    dailyData.push({ date: currentDate, calories: overflow });
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

  if (todayEntry) {
    // Calculate deficit or overflow from the previous day
    let previousDeficit = previousEntry ? previousEntry.calories - totalCalories : 0;
    let adjustedCalories = todayEntry.calories + previousDeficit;
    let displayCalories = adjustedCalories;
    document.getElementById('current-calories').textContent = displayCalories;
    updateProgressBar(adjustedCalories, previousDeficit);
  }
}

function updateProgressBar(currentCalories, previousDeficit) {
  const progressBar = document.getElementById('progress-bar');
  const maxBoxes = 100; // Maximum number of boxes

  // Calculate the number of red boxes for deficit
  let deficit = Math.abs(currentCalories);
  let deficitBoxes = Math.round((deficit / totalCalories) * maxBoxes);

  if (currentCalories > 0) {
    deficitBoxes = 0;
  }

  // Calculate the number of black boxes for positive calories
  let positiveBoxes = Math.max(0, Math.min(maxBoxes - deficitBoxes, Math.round((currentCalories / totalCalories) * maxBoxes)));

  progressBar.innerHTML = ''; // Clear previous content

  if (currentCalories < 0) {
    // Add red boxes for the deficit
    for (let i = 0; i < deficitBoxes; i++) {
      const box = document.createElement('div');
      box.className = 'calorie-box red-box';
      progressBar.appendChild(box);
    }
  }

  // Add black boxes for the positive calories only if the deficit is fully covered
  if (currentCalories > 0) {
    let remainingBoxes = Math.max(0, maxBoxes - deficitBoxes);
    for (let i = 0; i < positiveBoxes; i++) {
      const box = document.createElement('div');
      box.className = 'calorie-box';
      progressBar.appendChild(box);
    }
  }
}

function setupEventHandlers() {
  document.querySelectorAll('.adjust-button').forEach(button => {
    button.addEventListener('click', function () {
      const amount = parseInt(this.getAttribute('data-amount'), 10);
      adjustCalories(amount);
    });
  });

  // Settings overlay
  const settingsBtn = document.getElementById('settings-btn');
  const settingsOverlay = document.getElementById('settings-overlay');
  const closeOverlay = document.getElementById('close-overlay');
  const saveSettingsBtn = document.getElementById('save-settings');
  const dailyGoalInput = document.getElementById('daily-goal');

  settingsBtn.addEventListener('click', () => {
    settingsOverlay.classList.remove('hidden');
  });

  closeOverlay.addEventListener('click', () => {
    settingsOverlay.classList.add('hidden');
  });

  saveSettingsBtn.addEventListener('click', () => {
    totalCalories = parseInt(dailyGoalInput.value, 10);
    localStorage.setItem('totalCalories', totalCalories);
    settingsOverlay.classList.add('hidden');
    updateUI(); // Update the UI to reflect the new total calorie goal
  });
}
