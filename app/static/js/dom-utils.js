// static/dom-utils.js
// DOM utility functions for IntroChat

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

console.log('IntroChat dom-utils.js loaded');
