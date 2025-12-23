const CORRECT_PASSWORD = "anna131";
const RATE_LIMIT_HOURS = 3;
const RATE_LIMIT_MS = RATE_LIMIT_HOURS * 60 * 60 * 1000;

// Global rate limit storage key - shared across all users
const GLOBAL_RATE_LIMIT_KEY = 'jasmin_counter_global_last_change';

// State
let counterHistory = [];
let currentHistoryIndex = 0;
let isAuthenticated = false;
let rateLimitTimerId = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    checkAuthentication();

    // Allow Enter key on password input
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
    }
});

// Authentication
function checkAuthentication() {
    const authenticated = localStorage.getItem('authenticated');
    if (authenticated === 'true') {
        isAuthenticated = true;
        showCounterPage();
    } else {
        showLoginPage();
    }
}

function checkPassword() {
    const input = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');

    if (input.value === CORRECT_PASSWORD) {
        localStorage.setItem('authenticated', 'true');
        isAuthenticated = true;
        errorMessage.textContent = '';
        input.value = '';
        showCounterPage();
    } else {
        errorMessage.textContent = 'Incorrect password. Please try again.';
        input.value = '';
    }
}

function logout() {
    localStorage.removeItem('authenticated');
    isAuthenticated = false;
    showLoginPage();
}

function showLoginPage() {
    document.getElementById('loginPage').classList.add('active');
    document.getElementById('counterPage').classList.remove('active');
}

function showCounterPage() {
    document.getElementById('loginPage').classList.remove('active');
    document.getElementById('counterPage').classList.add('active');
    updateDisplay();
}

// Load state from localStorage
function loadState() {
    const savedHistory = localStorage.getItem('counterHistory');
    const savedIndex = localStorage.getItem('currentHistoryIndex');

    if (savedHistory) {
        counterHistory = JSON.parse(savedHistory);
        currentHistoryIndex = savedIndex ? parseInt(savedIndex) : counterHistory.length - 1;
    } else {
        // Initialize with starting value
        counterHistory = [{
            value: 0,
            timestamp: Date.now(),
            action: 'initialized'
        }];
        currentHistoryIndex = 0;
        saveState();
    }
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('counterHistory', JSON.stringify(counterHistory));
    localStorage.setItem('currentHistoryIndex', currentHistoryIndex.toString());
}

// Check if rate limit allows change (global across all users)
function canModifyCounter() {
    // Get the global last modification timestamp
    const lastChangeTimestamp = localStorage.getItem(GLOBAL_RATE_LIMIT_KEY);

    // If no previous global modification, allow change
    if (!lastChangeTimestamp) return true;

    const timeSinceLastChange = Date.now() - parseInt(lastChangeTimestamp);
    return timeSinceLastChange >= RATE_LIMIT_MS;
}

// Get remaining time until next allowed change (global)
function getRemainingTime() {
    const lastChangeTimestamp = localStorage.getItem(GLOBAL_RATE_LIMIT_KEY);

    // If no previous global modification, return 0
    if (!lastChangeTimestamp) return 0;

    const timeSinceLastChange = Date.now() - parseInt(lastChangeTimestamp);
    const remainingTime = RATE_LIMIT_MS - timeSinceLastChange;

    return Math.max(0, remainingTime);
}

// Format remaining time
function formatRemainingTime(ms) {
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
}

// Increment counter
function incrementCounter() {
    if (!canModifyCounter()) {
        showRateLimitMessage();
        return;
    }

    const currentValue = counterHistory[currentHistoryIndex].value;
    const newEntry = {
        value: currentValue + 1,
        timestamp: Date.now(),
        action: 'increment'
    };

    // If we're not at the end of history, remove everything after current position
    if (currentHistoryIndex < counterHistory.length - 1) {
        counterHistory = counterHistory.slice(0, currentHistoryIndex + 1);
    }

    counterHistory.push(newEntry);
    currentHistoryIndex = counterHistory.length - 1;

    // Update global rate limit timestamp
    localStorage.setItem(GLOBAL_RATE_LIMIT_KEY, Date.now().toString());

    saveState();
    updateDisplay();
}

// Decrement counter
function decrementCounter() {
    if (!canModifyCounter()) {
        showRateLimitMessage();
        return;
    }

    const currentValue = counterHistory[currentHistoryIndex].value;
    const newEntry = {
        value: currentValue - 1,
        timestamp: Date.now(),
        action: 'decrement'
    };

    // If we're not at the end of history, remove everything after current position
    if (currentHistoryIndex < counterHistory.length - 1) {
        counterHistory = counterHistory.slice(0, currentHistoryIndex + 1);
    }

    counterHistory.push(newEntry);
    currentHistoryIndex = counterHistory.length - 1;

    // Update global rate limit timestamp
    localStorage.setItem(GLOBAL_RATE_LIMIT_KEY, Date.now().toString());

    saveState();
    updateDisplay();
}

// Navigate through history
function navigateHistory(direction) {
    const newIndex = currentHistoryIndex + direction;

    if (newIndex >= 0 && newIndex < counterHistory.length) {
        currentHistoryIndex = newIndex;
        saveState();
        updateDisplay();
    }
}

// Show rate limit message
function showRateLimitMessage() {
    const messageElement = document.getElementById('rateLimitMessage');
    const remaining = getRemainingTime();
    messageElement.textContent = `Please wait ${formatRemainingTime(remaining)} before making another change.`;

    // Clear message after 5 seconds
    setTimeout(() => {
        messageElement.textContent = '';
    }, 5000);
}

// Update display
function updateDisplay() {
    if (!isAuthenticated) return;

    // Update counter value
    const currentEntry = counterHistory[currentHistoryIndex];
    document.getElementById('counterValue').textContent = currentEntry.value;

    // Update history position
    document.getElementById('historyPosition').textContent = 
        `${currentHistoryIndex + 1}/${counterHistory.length}`;

    // Update history navigation buttons
    const prevButton = document.querySelector('.btn-history:first-child');
    const nextButton = document.querySelector('.btn-history:last-child');

    if (prevButton) prevButton.disabled = currentHistoryIndex === 0;
    if (nextButton) nextButton.disabled = currentHistoryIndex === counterHistory.length - 1;

    // Update logs
    updateLogs();

    // Update rate limit status
    updateRateLimitStatus();
}

// Update logs display
function updateLogs() {
    const logContainer = document.getElementById('logContainer');
    logContainer.innerHTML = '';

    // Show logs in reverse order (newest first)
    for (let i = counterHistory.length - 1; i >= 0; i--) {
        const entry = counterHistory[i];
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${entry.action}`;

        const timestamp = new Date(entry.timestamp);
        const timeString = timestamp.toLocaleString();

        let actionText = '';
        if (entry.action === 'increment') {
            actionText = `Incremented to ${entry.value}`;
        } else if (entry.action === 'decrement') {
            actionText = `Decremented to ${entry.value}`;
        } else {
            actionText = `Initialized at ${entry.value}`;
        }

        logEntry.innerHTML = `
            <div class="log-entry-time">${timeString}</div>
            <div class="log-entry-action">${actionText}</div>
        `;

        logContainer.appendChild(logEntry);
    }
}

// Update rate limit status
function updateRateLimitStatus() {
    const canModify = canModifyCounter();
    const incrementBtn = document.querySelector('.btn-increment');
    const decrementBtn = document.querySelector('.btn-decrement');

    if (incrementBtn) incrementBtn.disabled = !canModify;
    if (decrementBtn) decrementBtn.disabled = !canModify;

    // Clear any existing timer
    if (rateLimitTimerId) {
        clearTimeout(rateLimitTimerId);
        rateLimitTimerId = null;
    }

    // Show remaining time if rate limited
    if (!canModify && isAuthenticated) {
        const messageElement = document.getElementById('rateLimitMessage');
        const remaining = getRemainingTime();
        messageElement.textContent = `Next change available in: ${formatRemainingTime(remaining)}`;

        // Update every second only if still rate limited
        if (remaining > 0) {
            rateLimitTimerId = setTimeout(updateRateLimitStatus, 1000);
        }
    } else if (isAuthenticated) {
        // Clear message when rate limit expires
        const messageElement = document.getElementById('rateLimitMessage');
        if (messageElement) {
            messageElement.textContent = '';
        }
    }
}
