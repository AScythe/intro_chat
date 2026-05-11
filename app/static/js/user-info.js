// user-info.js
// Description: User profile form controller handling LinkedIn URL and Slack handle input, profile data persistence via API, and navigation to room selection on success
// ====
document.addEventListener('DOMContentLoaded', function() {
    const eventId = window.userInfoEventId;
    const linkedinInput = document.getElementById('linkedinInput');
    const slackInput = document.getElementById('slackInput');
    const saveBtn = document.getElementById('saveProfileBtn');
    const selectRoomBtn = document.getElementById('selectRoomBtn');
    const saveSuccessCard = document.getElementById('saveSuccessCard');
    const backToHomeBtn = document.getElementById('backToHomeBtn');

    let isSaved = false;

    backToHomeBtn.addEventListener('click', function() {
        window.location.href = '/';
    });

    saveBtn.addEventListener('click', function() {
        const linkedinUrl = linkedinInput.value.trim();
        const slackHandle = slackInput.value.trim();

        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        const username = generateUsername();

        fetchJSON(`/api/events/${eventId}/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                linkedin_url: linkedinUrl,
                slack_handle: slackHandle
            })
        })
        .then(data => {
            if (data.user_id) {
                storeUserId(data.user_id);
                isSaved = true;
                selectRoomBtn.disabled = false;
                saveSuccessCard.classList.remove('hidden');
                saveBtn.textContent = 'Saved!';
            } else {
                throw new Error('Failed to save profile');
            }
        })
        .catch(error => {
            console.error('Error saving profile:', error);
            showError('Failed to save profile. Please try again.');
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Profile';
        });
    });

    selectRoomBtn.addEventListener('click', function() {
        if (isSaved) {
            window.location.href = `/room/${eventId}`;
        }
    });
});
