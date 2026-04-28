//+++ static/utils.js (修改后)
// Shared utility functions for IntroChat

/**
 * Display an error message to the user
 * @param {string} message - Error message to display
 */
function showError(message) {
    alert(message); // Simple error display for MVP
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
 * Safely get element by ID with error handling
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} Element or null if not found
 */
function getElementById(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with ID '${id}' not found`);
    }
    return element;
}

/**
 * Set text content safely
 * @param {string} elementId - Element ID
 * @param {string} text - Text to set
 */
function setTextContent(elementId, text) {
    const element = getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

/**
 * Set display style for an element
 * @param {string} elementId - Element ID
 * @param {string} display - Display value (e.g., 'block', 'none')
 */
function setDisplay(elementId, display) {
    const element = getElementById(elementId);
    if (element) {
        element.style.display = display;
    }
}

/**
 * Add event listener with error handling
 * @param {string} elementId - Element ID
 * @param {string} event - Event name
 * @param {Function} handler - Event handler function
 */
function addEventListenerSafe(elementId, event, handler) {
    const element = getElementById(elementId);
    if (element) {
        element.addEventListener(event, handler);
    } else {
        console.warn(`Cannot add ${event} listener to #${elementId} - element not found`);
    }
}

/**
 * Fetch with timeout and error handling
 * @param {string} url - URL to fetch
 * @param {object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise} Fetch response
 */
async function fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

/**
 * Parse JSON response with error handling
 * @param {Response} response - Fetch response
 * @returns {Promise} Parsed JSON
 */
async function parseJSON(response) {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

/**
 * Combined fetch helper
 * @param {string} url - URL to fetch
 * @param {object} options - Fetch options
 * @returns {Promise} Parsed JSON response
 */
async function fetchJSON(url, options = {}) {
    const response = await fetchWithTimeout(url, options);
    return parseJSON(response);
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

console.log('IntroChat utils.js loaded');