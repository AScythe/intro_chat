// static/config.js
// Central configuration for IntroChat timers and durations
// 
// HOW TO USE FOR TESTING:
// - To change chat duration: modify CHAT_DURATION below (in seconds)
// - All other JS files (chat.js, room.js) now read from this CONFIG object
// ================================================================

const CONFIG = {
    // Chat timer duration in seconds (default: 120 = 2 minutes)
    CHAT_DURATION: 30,
    // Match found countdown in seconds (user has this long to go to chat page)
    MATCH_FOUND_COUNTDOWN: 60,
    // Timer warning threshold (when to show yellow/amber warning)
    TIMER_WARNING_THRESHOLD: 5,
    // Timer danger threshold (when to show red danger + pulse)
    TIMER_DANGER_THRESHOLD: 3,

    // Demo mode delays (milliseconds)
    DEMO_LOADING_DELAY_MS: 2000,      // Loading animation delay
    DEMO_CONNECTION_DELAY_MS: 2000,   // Connection exchange delay
    SIMULATE_RESPONSE_DELAY_MS: 3000, // Person response simulation
    SIMULATE_READY_DELAY_MS: 5000,     // Ready status simulation
};

console.log('IntroChat config.js loaded - Chat duration:', CONFIG.CHAT_DURATION, 'seconds');
