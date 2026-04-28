//+++ static/room.js (修改后)
// Room page JavaScript - handles room selection and user matching

// Configuration from Flask template (set via data attributes or inline)
let roomConfig = {
    eventId: null,
    socket: null
};

// State variables
let currentRoomId = null;
let currentUserId = null;
let matchId = null;
let countdownInterval = null;
let selectedPerson = null;

/**
 * Initialize the room page
 */
function initRoomPage(eventId) {
    roomConfig.eventId = eventId;
    roomConfig.socket = initSocket();

    console.log('Room page initialized for event:', eventId);

    // Initialize sample users first
    addSampleUsers();
    console.log('Sample users added:', window.sampleUsers);

    ensureUserExists().then(() => {
        loadRooms();
        setupEventListeners();
        console.log('Event listeners set up');
    });
}

/**
 * Ensure user exists, create if not
 * @returns {Promise} Resolves when user is ready
 */
function ensureUserExists() {
    return new Promise((resolve) => {
        // Check if user already exists
        currentUserId = getUserId();
        if (currentUserId) {
            console.log('Using existing user:', currentUserId);
            resolve();
            return;
        }

        // Create new user
        console.log('Creating new user for event:', roomConfig.eventId);
        fetchJSON(`/api/events/${roomConfig.eventId}/join`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: generateUsername()})
        })
        .then(data => {
            currentUserId = data.user_id;
            storeUserId(currentUserId);
            console.log('Created new user:', currentUserId);
            resolve();
        })
        .catch(error => {
            console.error('Error creating user:', error);
            // Create a fallback user ID
            currentUserId = 'user_' + generateRandomString(8);
            storeUserId(currentUserId);
            console.log('Using fallback user:', currentUserId);
            resolve();
        });
    });
}

/**
 * Load rooms for the event
 */
function loadRooms() {
    console.log('Loading rooms for event:', roomConfig.eventId);
    fetchJSON(`/api/events/${roomConfig.eventId}/rooms`)
        .then(rooms => {
            console.log('Rooms received:', rooms);
            const select = getElementById('roomSelect');

            if (rooms && rooms.length > 0) {
                rooms.forEach(room => {
                    const option = document.createElement('option');
                    option.value = room.id;
                    option.textContent = room.name;
                    select.appendChild(option);
                });
                console.log('Rooms loaded successfully');

                // Add sample users to each room for demo purposes
                addSampleUsers();
            } else {
                console.error('No rooms found for event');
                showError('No rooms found for this event. Please check the event code.');
            }
        })
        .catch(error => {
            console.error('Error loading rooms:', error);
            // Fallback: show default rooms
            const select = getElementById('roomSelect');
            const defaultRooms = ['Main Hall', 'Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Quiet Corner', 'Coffee Area'];
            defaultRooms.forEach((roomName, index) => {
                const option = document.createElement('option');
                option.value = `fallback_${index}`;
                option.textContent = roomName;
                select.appendChild(option);
            });

            // Add sample users for fallback
            addSampleUsers();

            console.log('Using fallback rooms due to API error');
        });
}

/**
 * Setup event listeners for room page
 */
function setupEventListeners() {
    // Room selection
    const roomSelect = getElementById('roomSelect');
    if (roomSelect) {
        roomSelect.addEventListener('change', function() {
            const btn = getElementById('selectRoomBtn');
            if (btn) {
                btn.disabled = !this.value;
            }
        });
    }

    addEventListenerSafe('selectRoomBtn', 'click', selectRoom);
    addEventListenerSafe('requestChatBtn', 'click', requestChatWithPerson);
    addEventListenerSafe('cancelRequestBtn', 'click', cancelRequest);
    addEventListenerSafe('changeRoomBtn', 'click', changeRoom);
    addEventListenerSafe('backToHomeBtn', 'click', () => {
        window.location.href = '/';
    });
    addEventListenerSafe('testBtn', 'click', testFunction);

    // Socket events
    if (roomConfig.socket) {
        roomConfig.socket.on('match_found', handleMatchFound);
    }
}

/**
 * Select a room
 */
function selectRoom() {
    const roomId = getElementById('roomSelect').value;
    const roomSelect = getElementById('roomSelect');
    const roomName = roomSelect.selectedOptions[0].textContent;

    if (!roomId) return;

    // Show loading state
    const selectBtn = getElementById('selectRoomBtn');
    const originalText = selectBtn.textContent;
    selectBtn.disabled = true;
    selectBtn.textContent = 'Selecting...';

    // Handle fallback rooms (don't send to API)
    if (roomId.startsWith('fallback_')) {
        currentRoomId = roomId;
        roomConfig.socket.emit('join_room', {room_id: roomId});

        // Update UI
        setTextContent('selectedRoomName', roomName);
        setTextContent('currentRoomName', roomName);
        setDisplay('roomSelectedCard', 'block');
        setDisplay('card:first-child', 'none');

        // Update nearby users
        updateNearbyUsers(roomName);

        console.log('Fallback room selected:', roomName);
        return;
    }

    // Join room
    fetchJSON(`/api/users/${currentUserId}/room`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({room_id: roomId})
    })
    .then(data => {
        if (data.success) {
            currentRoomId = roomId;
            roomConfig.socket.emit('join_room', {room_id: roomId});

            // Update UI
            setTextContent('selectedRoomName', roomName);
            setTextContent('currentRoomName', roomName);
            setDisplay('roomSelectedCard', 'block');
            document.querySelector('.card:first-child').style.display = 'none';

            // Update nearby users
            updateNearbyUsers(roomName);

            console.log('Room selected successfully:', roomName);
        } else {
            throw new Error(data.error || 'Failed to select room');
        }
    })
    .catch(error => {
        console.error('Error selecting room:', error);
        showError('Failed to select room. Please try again.');
        selectBtn.disabled = false;
        selectBtn.textContent = originalText;
    });
}

/**
 * Request chat (legacy function - kept for compatibility)
 */
function requestChat() {
    fetchJSON(`/api/users/${currentUserId}/available`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({available: true})
    })
    .then(data => {
        if (data.success) {
            setDisplay('waitingCard', 'block');
            setDisplay('roomSelectedCard', 'none');
        }
    })
    .catch(error => {
        console.error('Error requesting chat:', error);
        showError('Failed to request chat. Please try again.');
    });
}

/**
 * Cancel waiting (legacy function - kept for compatibility)
 */
function cancelWaiting() {
    fetchJSON(`/api/users/${currentUserId}/available`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({available: false})
    })
    .then(data => {
        setDisplay('waitingCard', 'none');
        setDisplay('roomSelectedCard', 'block');
    });
}

/**
 * Change room - go back to selection
 */
function changeRoom() {
    setDisplay('roomSelectedCard', 'none');
    document.querySelector('.card:first-child').style.display = 'block';
    const roomSelect = getElementById('roomSelect');
    roomSelect.value = '';
    const selectRoomBtn = getElementById('selectRoomBtn');
    selectRoomBtn.disabled = true;
    currentRoomId = null;
    console.log('Changed room - back to selection');
}

/**
 * Handle match found event
 * @param {object} data - Match data from server
 */
function handleMatchFound(data) {
    matchId = data.match_id;
    setTextContent('matchUsername', data.user2_username);
    setTextContent('matchRoomName', data.room_id);

    setDisplay('waitingCard', 'none');
    setDisplay('matchFoundCard', 'block');

    // Start countdown
    startCountdown();
}

/**
 * Start countdown timer
 */
function startCountdown() {
    let timeLeft = 60;
    const countdownElement = getElementById('countdownNumber');

    countdownInterval = setInterval(() => {
        timeLeft--;
        countdownElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            goToChat();
        }
    }, 1000);
}

/**
 * Navigate to chat page
 */
function goToChat() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    window.location.href = `/chat/${matchId}`;
}

/**
 * Add sample users for demo purposes
 */
function addSampleUsers() {
    // Sample users for each room (for demo purposes)
    // Each user has: name, availability status, and status text
    const sampleUsers = {
        'Main Hall': [
            {name: 'Alex_Coder', available: false, status: 'Busy coding'},
            {name: 'Sarah_Dev', available: true, status: 'Looking to chat'},
            {name: 'Mike_Hacker', available: false, status: 'In deep focus'},
            {name: 'Emma_Tech', available: true, status: 'Open to talk'}
        ],
        'Table 1': [
            {name: 'Jake_Python', available: true, status: 'Ready to chat'},
            {name: 'Lisa_JS', available: false, status: 'Taking notes'}
        ],
        'Table 2': [
            {name: 'Tom_React', available: false, status: 'Debugging'},
            {name: 'Anna_Vue', available: true, status: 'Available'},
            {name: 'Chris_Node', available: false, status: 'On a call'}
        ],
        'Table 3': [
            {name: 'Sam_AI', available: true, status: 'Looking for conversation'},
            {name: 'Ruby_Data', available: false, status: 'Analyzing data'}
        ],
        'Table 4': [
            {name: 'Ben_Mobile', available: false, status: 'Testing app'},
            {name: 'Zoe_Flutter', available: true, status: 'Open to chat'}
        ],
        'Table 5': [
            {name: 'Max_Cloud', available: true, status: 'Ready to talk'},
            {name: 'Luna_AWS', available: false, status: 'Configuring servers'}
        ],
        'Quiet Corner': [
            {name: 'Eve_Designer', available: true, status: 'Quiet but open'}
        ],
        'Coffee Area': [
            {name: 'Dan_DevOps', available: true, status: 'Coffee break - chat me!'},
            {name: 'Maya_FullStack', available: false, status: 'Focused on laptop'},
            {name: 'Leo_Backend', available: false, status: 'Reading documentation'}
        ]
    };

    // Store sample users globally for use in room selection
    window.sampleUsers = sampleUsers;
}

/**
 * Select a person to chat with
 * @param {string} personName - Name of person to select
 * @param {HTMLElement} personCard - Person card element
 */
function selectPerson(personName, personCard) {
    // Remove previous selection
    document.querySelectorAll('.person-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Select this person
    personCard.classList.add('selected');
    selectedPerson = personName;

    // Enable request button
    const requestBtn = getElementById('requestChatBtn');
    if (requestBtn) {
        requestBtn.disabled = false;
        requestBtn.textContent = `💬 Request 2-min chat with ${personName}`;
    }

    console.log('Selected person:', personName);
}

/**
 * Update nearby users display
 * @param {string} roomName - Name of the room
 */
function updateNearbyUsers(roomName) {
    console.log('=== updateNearbyUsers called ===');
    console.log('Room name:', roomName);

    const selectPersonSection = getElementById('selectPersonSection');
    const availablePeople = getElementById('availablePeople');
    const userDots = getElementById('userDots');

    // Clear everything
    availablePeople.innerHTML = '';
    userDots.innerHTML = '';

    // Show person selection section
    selectPersonSection.style.display = 'block';

    // Create sample users for Coffee Area (or any room)
    const sampleUsers = [
        {name: 'Dan_DevOps', available: true, status: 'Coffee break - chat me!'},
        {name: 'Maya_FullStack', available: false, status: 'Focused on laptop'},
        {name: 'Leo_Backend', available: false, status: 'Reading documentation'}
    ];

    let availableCount = 0;

    // Create person cards for ALL users
    sampleUsers.forEach((user, index) => {
        const personCard = document.createElement('div');
        personCard.className = 'person-card';
        personCard.dataset.personName = user.name;
        personCard.dataset.available = user.available;

        // Style based on availability
        const cardStyle = user.available ?
            'background: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 15px; margin: 10px 0; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: all 0.3s ease;' :
            'background: #f7fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 15px; margin: 10px 0; cursor: not-allowed; display: flex; align-items: center; gap: 12px; transition: all 0.3s ease; opacity: 0.6;';

        personCard.style.cssText = cardStyle;

        const avatarColor = user.available ? '#48bb78' : '#a0aec0';
        const statusColor = user.available ? '#718096' : '#a0aec0';

        personCard.innerHTML = `
            <div style="width: 40px; height: 40px; background: ${avatarColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${user.name.charAt(0)}</div>
            <div style="flex: 1;">
                <div style="font-weight: 600; color: #2d3748;">${user.name}</div>
                <div style="font-size: 0.9rem; color: ${statusColor};">${user.status}</div>
            </div>
            <div style="font-size: 0.8rem; color: ${user.available ? '#667eea' : '#a0aec0'}; font-weight: 500;">
                ${user.available ? 'Click to select' : 'Not available'}
            </div>
        `;

        // Add click handler only for available users
        if (user.available) {
            availableCount++;

            personCard.addEventListener('click', function() {
                console.log('Person clicked:', user.name);

                // Remove previous selection
                document.querySelectorAll('.person-card').forEach(card => {
                    card.style.borderColor = card.dataset.available === 'true' ? '#e2e8f0' : '#e2e8f0';
                    card.style.backgroundColor = card.dataset.available === 'true' ? 'white' : '#f7fafc';
                });

                // Select this person
                this.style.borderColor = '#48bb78';
                this.style.backgroundColor = '#f0fff4';

                // Update global selected person
                window.selectedPerson = user.name;

                // Enable request button
                const requestBtn = getElementById('requestChatBtn');
                requestBtn.disabled = false;
                requestBtn.textContent = `💬 Request 2-min chat with ${user.name}`;

                console.log('Person selected:', user.name);
            });
        }

        availablePeople.appendChild(personCard);
    });

    // Update user count
    const userCountElement = document.querySelector('.user-count');
    if (userCountElement) {
        userCountElement.innerHTML = `
            <strong>${availableCount} available</strong> out of ${sampleUsers.length} people in ${roomName}
            <br><small>💬 = Ready to chat | 🚫 = Busy</small>
        `;
    }

    console.log('Person selection section created with', sampleUsers.length, 'users,', availableCount, 'available');
}

/**
 * Request chat with selected person
 */
function requestChatWithPerson() {
    if (!window.selectedPerson) {
        showError('Please select someone to chat with first');
        return;
    }

    // Show waiting for response
    setDisplay('selectPersonSection', 'none');
    setDisplay('waitingForResponse', 'block');
    setTextContent('requestedPerson', window.selectedPerson);

    // Simulate the person's response after 3 seconds
    setTimeout(() => {
        simulatePersonResponse(window.selectedPerson);
    }, 3000);

    console.log('Requesting chat with:', window.selectedPerson);
}

/**
 * Simulate person's response to chat request
 * @param {string} personName - Name of person
 */
function simulatePersonResponse(personName) {
    // Simulate different responses based on the person
    const responses = {
        'Dan_DevOps': { accepted: true, message: "Hey! I'd love to chat about DevOps! Let's meet at the coffee table." },
        'Sarah_Dev': { accepted: true, message: "Sure! I'm excited to talk about development. See you in a minute!" },
        'Emma_Tech': { accepted: true, message: "Absolutely! I'm always up for a good tech conversation." },
        'Jake_Python': { accepted: true, message: "Python talk? Count me in! Let's do this!" },
        'Anna_Vue': { accepted: true, message: "Vue.js discussion? I'm totally in! Meet you there." },
        'Sam_AI': { accepted: true, message: "AI conversation? This is going to be fascinating!" },
        'Zoe_Flutter': { accepted: true, message: "Flutter chat? I'm so ready for this!" },
        'Max_Cloud': { accepted: true, message: "Cloud architecture talk? Perfect timing!" },
        'Eve_Designer': { accepted: true, message: "Design discussion? I'm quietly excited!" }
    };

    const response = responses[personName] || { accepted: true, message: "Sure! Let's chat!" };

    if (response.accepted) {
        // Show acceptance and create match
        const waitingForResponse = getElementById('waitingForResponse');
        waitingForResponse.innerHTML = `
            <h2>🎉 ${personName} accepted!</h2>
            <div class="response-message">
                <p><strong>${personName} says:</strong> "${response.message}"</p>
                <p>You've been matched! Take your time to get ready.</p>
            </div>
            <div class="ready-status">
                <div class="status-item">
                    <div class="status-indicator" id="yourStatus">⏳</div>
                    <span>You: Getting ready...</span>
                </div>
                <div class="status-item">
                    <div class="status-indicator" id="theirStatus">⏳</div>
                    <span>${personName}: Getting ready...</span>
                </div>
            </div>
            <div class="ready-actions">
                <button id="imReadyBtn" class="btn btn-primary">I'm Ready to Chat!</button>
                <button id="goToChatBtn" class="btn btn-chat" disabled>Start Chat</button>
            </div>
        `;

        // Add event listeners
        getElementById('imReadyBtn').addEventListener('click', () => {
            setTextContent('yourStatus', '✅');
            getElementById('yourStatus').style.color = '#48bb78';
            const imReadyBtn = getElementById('imReadyBtn');
            imReadyBtn.disabled = true;
            imReadyBtn.textContent = 'Ready!';

            // Check if both are ready
            checkIfBothReady();
        });

        getElementById('goToChatBtn').addEventListener('click', () => {
            const fakeMatchId = 'demo_' + generateRandomString(8);
            window.location.href = `/chat/${fakeMatchId}`;
        });

        // Simulate Dan getting ready after 5 seconds
        setTimeout(() => {
            setTextContent('theirStatus', '✅');
            getElementById('theirStatus').style.color = '#48bb78';
            document.querySelector('.status-item:nth-child(2) span').textContent = `${personName}: Ready!`;

            // Check if both are ready
            checkIfBothReady();
        }, 5000);

        function checkIfBothReady() {
            const yourReady = getElementById('yourStatus').textContent === '✅';
            const theirReady = getElementById('theirStatus').textContent === '✅';

            if (yourReady && theirReady) {
                const goToChatBtn = getElementById('goToChatBtn');
                goToChatBtn.disabled = false;
                goToChatBtn.textContent = 'Start Chat - Both Ready!';
            }
        }
    } else {
        // Show rejection
        const waitingForResponse = getElementById('waitingForResponse');
        waitingForResponse.innerHTML = `
            <h2>😔 ${personName} declined</h2>
            <p>They're not available right now, but that's okay!</p>
            <button id="selectSomeoneElseBtn" class="btn btn-primary">Select Someone Else</button>
        `;

        getElementById('selectSomeoneElseBtn').addEventListener('click', () => {
            setDisplay('waitingForResponse', 'none');
            setDisplay('selectPersonSection', 'block');
            selectedPerson = null;
            const requestChatBtn = getElementById('requestChatBtn');
            requestChatBtn.disabled = true;
        });
    }
}

/**
 * Cancel chat request
 */
function cancelRequest() {
    setDisplay('waitingForResponse', 'none');
    setDisplay('selectPersonSection', 'block');
    selectedPerson = null;
    const requestChatBtn = getElementById('requestChatBtn');
    requestChatBtn.disabled = true;
}

/**
 * Test function for debugging
 */
function testFunction() {
    console.log('Test button clicked!');
    alert('JavaScript is working! Check console for debug info.');

    // Test if sample users are loaded
    if (window.sampleUsers) {
        console.log('Sample users loaded:', window.sampleUsers);
        alert('Sample users are loaded: ' + Object.keys(window.sampleUsers).length + ' rooms');
    } else {
        console.log('Sample users NOT loaded');
        alert('Sample users NOT loaded!');
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded - initializing...');

    // Get event ID from data attribute or URL
    const eventContainer = document.getElementById('roomPageContainer');
    if (eventContainer && eventContainer.dataset.eventId) {
        initRoomPage(eventContainer.dataset.eventId);
    } else {
        // Fallback: look for inline script config
        if (typeof window.roomEventId !== 'undefined') {
            initRoomPage(window.roomEventId);
        }
    }
});

console.log('IntroChat room.js loaded');