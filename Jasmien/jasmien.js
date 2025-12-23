const CORRECT_PASSWORD = "anna131";
const RATE_LIMIT_HOURS = 3;
const RATE_LIMIT_MS = RATE_LIMIT_HOURS * 60 * 60 * 1000;
const COUNTER_DATA_URL = './counter-data.json'; // In same folder (Jasmien/)

// GitHub API settings
const GITHUB_TOKEN = 'ghp_YOUR_TOKEN_HERE'; // ⚠️ SECURITY RISK - visible to everyone
const REPO_OWNER = 'harmfulladvocado';
const REPO_NAME = 'harmfulladvocado. github.io';
const FILE_PATH = 'Jasmien/counter-data. json'; // Updated path

// State
let counterHistory = [];
let currentHistoryIndex = 0;
let isAuthenticated = false;
let rateLimitTimerId = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();

    const passwordInput = document. getElementById('passwordInput');
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
        loadStateFromJSON().then(() => showCounterPage());
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
        errorMessage. textContent = '';
        input. value = '';
        loadStateFromJSON().then(() => showCounterPage());
    } else {
        errorMessage.textContent = 'Incorrect password. Please try again.';
        input. value = '';
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

// Load state from JSON file
async function loadStateFromJSON() {
    try {
        // Add timestamp to prevent caching
        const response = await fetch(`${COUNTER_DATA_URL}? t=${Date.now()}`);
        const data = await response. json();
        
        counterHistory = data.history || [{
            value: 0,
            timestamp: Date.now(),
            action: 'initialized'
        }];
        currentHistoryIndex = counterHistory.length - 1;
        
    } catch (error) {
        console.error('Error loading counter data:', error);
        // Fallback to default
        counterHistory = [{
            value: 0,
            timestamp:  Date.now(),
            action: 'initialized'
        }];
        currentHistoryIndex = 0;
    }
}

// Save state to JSON file via GitHub API
async function saveStateToJSON() {
    try {
        // First, get the current file SHA (required for updates)
        const getResponse = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
            {
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd. github.v3+json'
                }
            }
        );
        
        const fileData = await getResponse.json();
        const fileSha = fileData. sha;
        
        // Prepare the new content
        const newContent = {
            value: counterHistory[currentHistoryIndex].value,
            lastModified: Date.now(),
            history: counterHistory
        };
        
        const contentBase64 = btoa(JSON. stringify(newContent, null, 2));
        
        // Update the file
        const updateResponse = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Update counter to ${newContent.value}`,
                    content: contentBase64,
                    sha: fileSha
                })
            }
        );
        
        if (! updateResponse.ok) {
            throw new Error('Failed to update counter');
        }
        
        return true;
    } catch (error) {
        console.error('Error saving counter data:', error);
        alert('Failed to save counter.  Please try again.');
        return false;
    }
}

// Check if rate limit allows change
function canModifyCounter() {
    const lastEntry = counterHistory[counterHistory.length - 1];
    const timeSinceLastChange = Date.now() - lastEntry.timestamp;
    return timeSinceLastChange >= RATE_LIMIT_MS;
}

// Get remaining time
function getRemainingTime() {
    const lastEntry = counterHistory[counterHistory. length - 1];
    const timeSinceLastChange = Date.now() - lastEntry.timestamp;
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
async function incrementCounter() {
    // Reload data first to check latest state
    await loadStateFromJSON();
    
    if (!canModifyCounter()) {
        showRateLimitMessage();
        return;
    }

    const currentValue = counterHistory[currentHistoryIndex].value;
    const newEntry = {
        value: currentValue + 1,
        timestamp:  Date.now(),
        action: 'increment'
    };

    counterHistory.push(newEntry);
    currentHistoryIndex = counterHistory.length - 1;

    const saved = await saveStateToJSON();
    if (saved) {
        updateDisplay();
    }
}

// Decrement counter
async function decrementCounter() {
    // Reload data first to check latest state
    await loadStateFromJSON();
    
    if (!canModifyCounter()) {
        showRateLimitMessage();
        return;
    }

    const currentValue = counterHistory[currentHistoryIndex].value;
    const newEntry = {
        value: currentValue - 1,
        timestamp: Date. now(),
        action: 'decrement'
    };

    counterHistory.push(newEntry);
    currentHistoryIndex = counterHistory.length - 1;

    const saved = await saveStateToJSON();
    if (saved) {
        updateDisplay();
    }
}

// Navigate through history
function navigateHistory(direction) {
    const newIndex = currentHistoryIndex + direction;

    if (newIndex >= 0 && newIndex < counterHistory.length) {
        currentHistoryIndex = newIndex;
        updateDisplay();
    }
}

// Show rate limit message
function showRateLimitMessage() {
    const messageElement = document.getElementById('rateLimitMessage');
    const remaining = getRemainingTime();
    messageElement.textContent = `Please wait ${formatRemainingTime(remaining)} before making another change. `;

    setTimeout(() => {
        messageElement.textContent = '';
    }, 5000);
}

// Update display
function updateDisplay() {
    if (!isAuthenticated) return;

    const currentEntry = counterHistory[currentHistoryIndex];
    document. getElementById('counterValue').textContent = currentEntry.value;

    document.getElementById('historyPosition').textContent = 
        `${currentHistoryIndex + 1}/${counterHistory.length}`;

    const prevButton = document.querySelector('. btn-history: first-child');
    const nextButton = document.querySelector('.btn-history:last-child');

    if (prevButton) prevButton.disabled = currentHistoryIndex === 0;
    if (nextButton) nextButton.disabled = currentHistoryIndex === counterHistory.length - 1;

    updateLogs();
    updateRateLimitStatus();
}

// Update logs display
function updateLogs() {
    const logContainer = document. getElementById('logContainer');
    logContainer.innerHTML = '';

    for (let i = counterHistory.length - 1; i >= 0; i--) {
        const entry = counterHistory[i];
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${entry.action}`;

        const timestamp = new Date(entry.timestamp);
        const timeString = timestamp. toLocaleString();

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

    if (incrementBtn) incrementBtn.disabled = ! canModify;
    if (decrementBtn) decrementBtn.disabled = !canModify;

    if (rateLimitTimerId) {
        clearTimeout(rateLimitTimerId);
        rateLimitTimerId = null;
    }

    if (! canModify && isAuthenticated) {
        const messageElement = document.getElementById('rateLimitMessage');
        const remaining = getRemainingTime();
        messageElement.textContent = `Next change available in: ${formatRemainingTime(remaining)}`;

        if (remaining > 0) {
            rateLimitTimerId = setTimeout(updateRateLimitStatus, 1000);
        }
    } else if (isAuthenticated) {
        const messageElement = document.getElementById('rateLimitMessage');
        if (messageElement) {
            messageElement.textContent = '';
        }
    }
}

// Auto-refresh data every 30 seconds to see changes from other users
setInterval(() => {
    if (isAuthenticated && currentHistoryIndex === counterHistory.length - 1) {
        loadStateFromJSON().then(() => updateDisplay());
    }
}, 30000);
