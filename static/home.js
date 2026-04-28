// Home page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const eventCodeInput = document.getElementById('eventCode');
    const joinEventBtn = document.getElementById('joinEventBtn');
    const scanQRBtn = document.getElementById('scanQRBtn');
    const qrFileInput = document.getElementById('qrFileInput');
    const createEventCard = document.getElementById('createEventCard');
    const eventCreatedCard = document.getElementById('eventCreatedCard');
    const createEventBtn = document.getElementById('createEventBtn');
    const eventNameInput = document.getElementById('eventName');
    const joinCreatedEventBtn = document.getElementById('joinCreatedEventBtn');

    // Show create event option if no event code is provided
    setTimeout(() => {
        createEventCard.style.display = 'block';
    }, 2000);

    // Event listeners
    joinEventBtn.addEventListener('click', joinEvent);
    scanQRBtn.addEventListener('click', () => qrFileInput.click());
    qrFileInput.addEventListener('change', handleQRUpload);
    createEventBtn.addEventListener('click', createEvent);
    joinCreatedEventBtn.addEventListener('click', joinCreatedEvent);

    // Enable join button when event code is entered
    eventCodeInput.addEventListener('input', function() {
        joinEventBtn.disabled = !this.value.trim();
    });

    // Enable create button when event name is entered
    eventNameInput.addEventListener('input', function() {
        createEventBtn.disabled = !this.value.trim();
    });

    function joinEvent() {
        const eventCode = eventCodeInput.value.trim().toUpperCase();
        
        if (!eventCode) {
            showError('Please enter an event code');
            return;
        }

        // Validate event code format (8 characters)
        if (eventCode.length !== 8) {
            showError('Event code must be 8 characters long');
            return;
        }

        // Redirect to room selection
        window.location.href = `/room/${eventCode}`;
    }

    function createEvent() {
        const eventName = eventNameInput.value.trim();
        
        if (!eventName) {
            showError('Please enter an event name');
            return;
        }

        createEventBtn.disabled = true;
        createEventBtn.textContent = 'Creating...';

        fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: eventName
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.event_id) {
                // Store event info
                localStorage.setItem('created_event_id', data.event_id);
                localStorage.setItem('created_event_name', eventName);
                
                // Generate QR code
                generateQRCode(data.event_id);
                
                // Show success card
                createEventCard.style.display = 'none';
                eventCreatedCard.style.display = 'block';
                document.getElementById('createdEventCode').textContent = data.event_id;
                document.getElementById('createdEventName').textContent = eventName;
            } else {
                throw new Error('Failed to create event');
            }
        })
        .catch(error => {
            console.error('Error creating event:', error);
            showError('Failed to create event. Please try again.');
            createEventBtn.disabled = false;
            createEventBtn.textContent = 'Create Event';
        });
    }

    function generateQRCode(eventId) {
        fetch(`/api/qr/${eventId}`)
        .then(response => response.json())
        .then(data => {
            const qrImage = document.getElementById('qrCodeImage');
            qrImage.src = data.qr_code;
            qrImage.style.display = 'block';
        })
        .catch(error => {
            console.error('Error generating QR code:', error);
        });
    }

    function joinCreatedEvent() {
        const eventId = localStorage.getItem('created_event_id');
        if (eventId) {
            window.location.href = `/room/${eventId}`;
        } else {
            showError('Event not found. Please create a new event.');
        }
    }

    function handleQRUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // For MVP, we'll just show a message that QR scanning is not implemented
        // In a real implementation, you would use a QR code scanning library
        showError('QR code scanning is not implemented in this MVP. Please enter the event code manually.');
        
        // Reset file input
        event.target.value = '';
    }

    function showError(message) {
        // Simple error display for MVP
        alert(message);
    }

    // Auto-focus on event code input
    eventCodeInput.focus();
});
