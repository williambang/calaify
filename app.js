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

  function getPreviousDate(date) {
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    return prevDate.toISOString().slice(0, 10);
}

function initializeDailyData() {
    let dailyData = JSON.parse(localStorage.getItem('dailyData')) || {};
    const prevDate = getPreviousDate(currentDate);
    const totalCalories = parseInt(document.getElementById('total-calories').textContent);

    if (!dailyData[currentDate]) {
        dailyData[currentDate] = 0; // Start with 0 calories for the new day
    }

    if (dailyData[prevDate] && dailyData[prevDate] > totalCalories) {
        dailyData[currentDate] = dailyData[prevDate] - totalCalories; // Carry over the excess calories
    }

    localStorage.setItem('dailyData', JSON.stringify(dailyData));
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
        const minimumCalories = dailyData[currentDate] - dailyData[getPreviousDate(currentDate)];
        dailyData[currentDate] = Math.max(minimumCalories, dailyData[currentDate] + amount);
        localStorage.setItem('dailyData', JSON.stringify(dailyData)); // Save updated data to Local Storage
        updateUI();
    });
});



  function updateProgressBar() {
    const totalCalories = parseInt(document.getElementById('total-calories').textContent);
    const currentCalories = dailyData[currentDate];
    const filledBoxes = Math.round((currentCalories / totalCalories) * 100);
    const overflowBoxes = dailyData[currentDate] < 0 ? 0 : Math.round((dailyData[currentDate] / totalCalories) * 100);
    
    progressBar.innerHTML = ''; // Clear previous boxes
    // First fill in the overflow boxes in green
    for (let i = 0; i < overflowBoxes; i++) {
        const box = document.createElement('div');
        box.style.backgroundColor = 'green';
        progressBar.appendChild(box);
    }
    // Then fill in the normal boxes in black
    for (let i = overflowBoxes; i < filledBoxes; i++) {
        const box = document.createElement('div');
        box.style.backgroundColor = 'black';
        progressBar.appendChild(box);
    }
}


  updateUI(); // Initial UI update based on today's data
});

