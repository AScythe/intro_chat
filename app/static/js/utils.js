// static/utils.js
// Shared utility functions for IntroChat

/**
 * Display an error message to the user
 * @param {string} message - Error message to display
 */
function showError(message) {
    alert(message);
}

/**
 * Get URL parameter by name
 * @param {string} name - Parameter name
 * @returns {string|null} Parameter value or null
 */
function getUrlParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

/**
 * Format time in MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Initialize Socket.IO connection
 * @returns {Socket} Socket.IO socket instance
 */
function initSocket() {
    if (typeof io === 'undefined') {
        console.error('Socket.IO library not loaded');
        return null;
    }
    return io();
}

/**
 * Generate random string for IDs
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
function generateRandomString(length = 8) {
    return Math.random().toString(36).substr(2, length);
}

/**
 * Generate random username
 * @returns {string} Random username
 */
function generateUsername() {
    return 'User_' + generateRandomString(5);
}

/**
 * Store user ID in localStorage
 * @param {string} userId - User ID to store
 */
function storeUserId(userId) {
    localStorage.setItem('introchat_user_id', userId);
}

/**
 * Get user ID from localStorage
 * @returns {string|null} Stored user ID or null
 */
function getUserId() {
    return localStorage.getItem('introchat_user_id');
}

/**
 * Clear user ID from localStorage
 */
function clearUserId() {
    localStorage.removeItem('introchat_user_id');
}

/**
 * Generic localStorage wrapper
 * @param {string} key - Storage key
 * @param {string} value - Value to store
 */
function storeData(key, value) {
    localStorage.setItem(key, value);
}

/**
 * Generic localStorage reader
 * @param {string} key - Storage key
 * @returns {string|null} Stored value or null
 */
function getData(key) {
    return localStorage.getItem(key);
}

/**
 * Generic localStorage remover
 * @param {string} key - Storage key
 */
function clearData(key) {
    localStorage.removeItem(key);
}

console.log('IntroChat utils.js loaded');
