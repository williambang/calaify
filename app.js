let dailyGoal = localStorage.getItem('dailyGoal') ? parseInt(localStorage.getItem('dailyGoal'), 10) : 0;
let currentCalories = localStorage.getItem('currentCalories') ? parseInt(localStorage.getItem('currentCalories'), 10) : 0;

// Display initial values if present
document.getElementById('current-calories').textContent = currentCalories;
document.getElementById('daily-goal').value = dailyGoal;

// Function to update progress bar and save data to localStorage
function updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    if (dailyGoal > 0) {
        const progress = Math.min((currentCalories / dailyGoal) * 100, 100);
        progressBar.style.width = progress + '%';
    }

    // Save current state to localStorage
    localStorage.setItem('dailyGoal', dailyGoal);
    localStorage.setItem('currentCalories', currentCalories);
}

// Event listener for setting daily goal
document.getElementById('set-goal').addEventListener('click', () => {
    const goalInput = document.getElementById('daily-goal').value;
    if (goalInput) {
        dailyGoal = parseInt(goalInput, 10);
        updateProgress();
    }
});

// Event listener for adding calories
document.getElementById('add-calories').addEventListener('click', () => {
    const calorieInput = document.getElementById('calorie-input').value;
    if (calorieInput) {
        currentCalories += parseInt(calorieInput, 10);
        document.getElementById('current-calories').textContent = currentCalories;
        updateProgress();
    }
});

// Initialize progress bar on load
updateProgress();
