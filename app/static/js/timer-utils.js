// static/timer-utils.js
// Timer utility functions for IntroChat

/**
 * Chat timer with extend support (for chat.js)
 * Returns an object with start, clear, extend, getTimeLeft
 * @param {number} duration - Initial duration in seconds
 * @param {Function} onTick - Called each second with remaining time
 * @param {Function} onComplete - Called when timer reaches 0
 * @returns {object} Timer control object
 */
function createChatTimer(duration, onTick, onComplete) {
    let timeLeft = duration;
    let intervalId = null;

    function tick() {
        timeLeft--;
        if (onTick) onTick(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(intervalId);
            intervalId = null;
            if (onComplete) onComplete();
        }
    }

    return {
        start: function() {
            if (intervalId) return;
            intervalId = setInterval(tick, 1000);
        },
        clear: function() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        },
        extend: function(seconds) {
            if (seconds === -1) {
                this.clear();
            } else {
                timeLeft = seconds;
                if (onTick) onTick(timeLeft);
            }
        },
        getTimeLeft: function() {
            return timeLeft;
        }
    };
}

/**
 * Simple countdown timer (for room.js match-found countdown)
 * Returns an object with start, clear, getTimeLeft
 * @param {number} duration - Duration in seconds
 * @param {Function} onTick - Called each second with remaining time
 * @param {Function} onComplete - Called when timer reaches 0
 * @returns {object} Timer control object
 */
function createCountdown(duration, onTick, onComplete) {
    let timeLeft = duration;
    let intervalId = null;

    function tick() {
        timeLeft--;
        if (onTick) onTick(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(intervalId);
            intervalId = null;
            if (onComplete) onComplete();
        }
    }

    return {
        start: function() {
            if (intervalId) return;
            intervalId = setInterval(tick, 1000);
        },
        clear: function() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        },
        getTimeLeft: function() {
            return timeLeft;
        }
    };
}

console.log('IntroChat timer-utils.js loaded');
