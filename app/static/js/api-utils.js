// static/api-utils.js
// Fetch/API utility functions for IntroChat

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

console.log('IntroChat api-utils.js loaded');
