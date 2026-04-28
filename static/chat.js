//+++ static/chat.js (修改后)
// Chat page JavaScript - handles chat interface and connection exchange

// Configuration from Flask template (set via data attributes or inline)
let chatConfig = {
    matchId: null,
    socket: null
};

// State variables
let chatTimer = null;
let timeLeft = 120; // 2 minutes in seconds
let currentPromptIndex = 0;
let prompts = [];
let wantsToConnect = false;

/**
 * Initialize the chat page
 * @param {string} matchId - Match ID from URL or template
 */
function initChatPage(matchId) {
    chatConfig.matchId = matchId;
    chatConfig.socket = initSocket();

    console.log('Chat page initialized for match:', matchId);

    loadMatchInfo();
    loadPrompts();
    setupEventListeners();
}

/**
 * Load match information
 */
function loadMatchInfo() {
    // Check if this is a demo match
    if (chatConfig.matchId.startsWith('demo_')) {
        console.log('Demo match detected, setting up demo chat...');

        // Simulate loading delay
        setTimeout(() => {
            setTextContent('partnerUsername', 'Dan_DevOps');
            setDisplay('chatCard', 'block');
            setDisplay('loadingCard', 'none');

            // Start the timer
            startChatTimer();
        }, 2000); // 2 second delay to simulate loading

        return;
    }

    // Real API call for actual matches
    fetchJSON(`/api/matches/${chatConfig.matchId}`)
        .then(data => {
            if (data.error) {
                showError('Match not found. Please go back and try again.');
                return;
            }

            setTextContent('partnerUsername', data.user2_username);
            setDisplay('chatCard', 'block');
            setDisplay('loadingCard', 'none');

            // Start the timer
            startChatTimer();
        })
        .catch(error => {
            console.error('Error loading match info:', error);
            showError('Failed to load chat. Please refresh the page.');
        });
}

/**
 * Load conversation prompts
 */
function loadPrompts() {
    fetchJSON('/api/prompts')
        .then(data => {
            prompts = data;
            displayCurrentPrompt();
        })
        .catch(error => {
            console.error('Error loading prompts:', error);
            // Use fallback prompts
            prompts = [
                "What's one thing you're excited about this weekend?",
                "What's your favorite snack at hackathons?",
                "If you could steal one skill from another hacker, what would it be?",
                "What's your favorite debugging story?",
                "What's the most interesting project you've worked on recently?"
            ];
            displayCurrentPrompt();
        });
}

/**
 * Setup event listeners for chat page
 */
function setupEventListeners() {
    addEventListenerSafe('nextPromptBtn', 'click', nextPrompt);
    addEventListenerSafe('extend2MinBtn', 'click', () => extendChat(120)); // 2 minutes
    addEventListenerSafe('extendIndefiniteBtn', 'click', () => extendChat(-1)); // indefinite
    addEventListenerSafe('endChatBtn', 'click', showSlackConnection);
    addEventListenerSafe('endExtendedChatBtn', 'click', showSlackConnection);
    addEventListenerSafe('yesConnectBtn', 'click', () => setConnectionPreference(true));
    addEventListenerSafe('noConnectBtn', 'click', () => setConnectionPreference(false));
    addEventListenerSafe('newChatBtn', 'click', () => {
        window.location.href = '/';
    });

    // Socket events
    if (chatConfig.socket) {
        chatConfig.socket.on('connection_exchanged', handleConnectionExchanged);
        chatConfig.socket.on('connection_declined', handleConnectionDeclined);
    }
}

/**
 * Start chat timer
 */
function startChatTimer() {
    chatTimer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(chatTimer);
            showTimeUp();
        }
    }, 1000);
}

/**
 * Update timer display
 */
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    setTextContent('timerMinutes', minutes);
    setTextContent('timerSeconds', seconds.toString().padStart(2, '0'));

    // Change color as time runs out
    const timer = getElementById('timer');
    if (timer) {
        if (timeLeft <= 30) {
            timer.classList.add('timer-warning');
        }
        if (timeLeft <= 10) {
            timer.classList.add('timer-danger');
        }
    }
}

/**
 * Display current prompt
 */
function displayCurrentPrompt() {
    if (prompts.length === 0) return;

    const prompt = prompts[currentPromptIndex];
    const promptsContainer = getElementById('promptsScroll');

    // Create prompt element
    const promptElement = document.createElement('div');
    promptElement.className = 'prompt-item';
    promptElement.textContent = prompt;

    // Clear previous prompts and add new one
    promptsContainer.innerHTML = '';
    promptsContainer.appendChild(promptElement);

    // Auto-scroll to show the prompt
    promptElement.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Show next prompt
 */
function nextPrompt() {
    currentPromptIndex = (currentPromptIndex + 1) % prompts.length;
    displayCurrentPrompt();
}

/**
 * Show time's up card
 */
function showTimeUp() {
    setDisplay('chatCard', 'none');
    setDisplay('timeUpCard', 'block');
}

/**
 * Extend chat time
 * @param {number} additionalTime - Additional time in seconds (-1 for indefinite)
 */
function extendChat(additionalTime) {
    if (additionalTime === -1) {
        // Indefinite extension
        setDisplay('timeUpCard', 'none');
        setDisplay('extendedChatCard', 'block');
        setTextContent('extendedPartnerName', 'Dan_DevOps');
        const extendedTimerText = getElementById('extendedTimerText');
        if (extendedTimerText) {
            extendedTimerText.innerHTML = '⏰ <strong>No time limit</strong> - chat as long as you want!';
        }

        // Clear any existing timer
        if (chatTimer) {
            clearInterval(chatTimer);
        }
    } else {
        // 2-minute extension
        timeLeft = additionalTime;
        setDisplay('timeUpCard', 'none');
        setDisplay('extendedChatCard', 'block');
        setTextContent('extendedPartnerName', 'Dan_DevOps');

        // Start new timer
        startExtendedChatTimer();
    }
}

/**
 * Start extended chat timer
 */
function startExtendedChatTimer() {
    chatTimer = setInterval(() => {
        timeLeft--;
        updateExtendedTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(chatTimer);
            showSlackConnection();
        }
    }, 1000);
}

/**
 * Update extended timer display
 */
function updateExtendedTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    setTextContent('extendedTimeLeft', `${minutes}:${seconds.toString().padStart(2, '0')}`);
}

/**
 * Show Slack connection card
 */
function showSlackConnection() {
    setDisplay('timeUpCard', 'none');
    setDisplay('extendedChatCard', 'none');
    setDisplay('slackConnectionCard', 'block');
}

/**
 * Set connection preference
 * @param {boolean} connectPreference - Whether user wants to connect
 */
function setConnectionPreference(connectPreference) {
    wantsToConnect = connectPreference;

    // Check if this is a demo match
    if (chatConfig.matchId.startsWith('demo_')) {
        console.log('Demo connection preference:', connectPreference);

        // Simulate connection exchange for demo
        setTimeout(() => {
            if (connectPreference) {
                // Simulate both wanting to connect
                handleConnectionExchanged({
                    user1_username: 'You',
                    user2_username: 'Dan_DevOps'
                });
            } else {
                // Simulate connection declined
                handleConnectionDeclined();
            }
        }, 2000); // 2 second delay to simulate processing

        return;
    }

    // Real API call for actual matches
    fetchJSON(`/api/matches/${chatConfig.matchId}/connect`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            user_id: getUserId(),
            wants_to_connect: connectPreference
        })
    })
    .then(data => {
        if (data.success) {
            // Show waiting state
            setDisplay('slackConnectionCard', 'none');
            showWaitingForConnection();
        }
    })
    .catch(error => {
        console.error('Error setting connection preference:', error);
        showError('Failed to process connection preference. Please try again.');
    });
}

/**
 * Show waiting for connection response
 */
function showWaitingForConnection() {
    const resultCard = getElementById('connectionResultCard');
    resultCard.style.display = 'block';

    const title = getElementById('connectionResultTitle');
    const content = getElementById('connectionResultContent');

    title.textContent = '⏳ Waiting for Response...';
    content.innerHTML = '<p>Waiting for your chat partner to respond...</p>';
}

/**
 * Handle connection exchanged event
 * @param {object} data - Connection data with usernames
 */
function handleConnectionExchanged(data) {
    const resultCard = getElementById('connectionResultCard');
    resultCard.style.display = 'block';

    const title = getElementById('connectionResultTitle');
    const content = getElementById('connectionResultContent');

    title.textContent = '🎉 Connection Exchanged!';
    content.innerHTML = `
        <div class="connection-success">
            <p>You both want to connect! Here are your usernames:</p>
            <div class="username-exchange">
                <div class="username-item">
                    <strong>You:</strong> ${data.user1_username}
                </div>
                <div class="username-item">
                    <strong>Partner:</strong> ${data.user2_username}
                </div>
            </div>
            <p class="connection-note">You can now find each other and continue the conversation!</p>
        </div>
    `;
}

/**
 * Handle connection declined event
 */
function handleConnectionDeclined() {
    const resultCard = getElementById('connectionResultCard');
    resultCard.style.display = 'block';

    const title = getElementById('connectionResultTitle');
    const content = getElementById('connectionResultContent');

    title.textContent = '👋 Chat Complete';
    content.innerHTML = `
        <div class="connection-declined">
            <p>Thanks for the great chat! Your partner chose not to exchange contact info, and that's perfectly okay.</p>
            <p>You can start a new chat anytime!</p>
        </div>
    `;
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get match ID from data attribute or URL
    const chatContainer = document.getElementById('chatPageContainer');
    if (chatContainer && chatContainer.dataset.matchId) {
        initChatPage(chatContainer.dataset.matchId);
    } else {
        // Fallback: look for inline script config
        if (typeof window.chatMatchId !== 'undefined') {
            initChatPage(window.chatMatchId);
        }
    }
});

console.log('IntroChat chat.js loaded');