(function() {
  'use strict';

  // Keys for localStorage
  const FONT_SIZE_KEY = 'a11y-font-size';

  // Font size range (80% to 150%)
  const MIN_FONT_SIZE = 0.8;
  const MAX_FONT_SIZE = 1.5;
  const FONT_SIZE_STEP = 0.1;

  // Elements
  const decreaseFontBtn = document.getElementById('decrease-font');
  const increaseFontBtn = document.getElementById('increase-font');
  const fontSizeDisplay = document.getElementById('font-size-display');

  // Current state
  let currentFontSize = 1.0;

  /**
   * Initialize accessibility features
   */
  function init() {
    loadSavedSettings();
    attachEventListeners();
  }

  /**
   * Load saved settings from localStorage
   */
  function loadSavedSettings() {
    // Load font size
    try {
      const savedFontSize = localStorage.getItem(FONT_SIZE_KEY);
      if (savedFontSize) {
        currentFontSize = parseFloat(savedFontSize);
        applyFontSize(currentFontSize);
      }
    } catch (e) {
      console.warn('Could not load font size setting:', e);
    }
  }

  /**
   * Attach event listeners
   */
  function attachEventListeners() {
    // Font size controls
    decreaseFontBtn?.addEventListener('click', decreaseFontSize);
    increaseFontBtn?.addEventListener('click', increaseFontSize);

    // Listen to reset button
    const resetBtn = document.getElementById('color-reset');
    if (resetBtn) {
      const originalReset = resetBtn.onclick;
      resetBtn.addEventListener('click', function() {
        resetAccessibilitySettings();
      });
    }
  }

  /**
   * Decrease font size
   */
  function decreaseFontSize() {
    if (currentFontSize > MIN_FONT_SIZE) {
      currentFontSize = Math.max(MIN_FONT_SIZE, currentFontSize - FONT_SIZE_STEP);
      currentFontSize = Math.round(currentFontSize * 10) / 10; // Round to 1 decimal
      applyFontSize(currentFontSize);
      saveFontSizeSetting(currentFontSize);
    }
  }

  /**
   * Increase font size
   */
  function increaseFontSize() {
    if (currentFontSize < MAX_FONT_SIZE) {
      currentFontSize = Math.min(MAX_FONT_SIZE, currentFontSize + FONT_SIZE_STEP);
      currentFontSize = Math.round(currentFontSize * 10) / 10; // Round to 1 decimal
      applyFontSize(currentFontSize);
      saveFontSizeSetting(currentFontSize);
    }
  }

  /**
   * Apply font size to document
   */
  function applyFontSize(multiplier) {
    document.documentElement.style.setProperty('--font-size-multiplier', multiplier);
    updateFontSizeDisplay(multiplier);
    updateButtonStates();
  }

  /**
   * Update font size display
   */
  function updateFontSizeDisplay(multiplier) {
    if (fontSizeDisplay) {
      const percentage = Math.round(multiplier * 100);
      fontSizeDisplay.textContent = `${percentage}%`;
    }
  }

  /**
   * Update button states (disabled if at limits)
   */
  function updateButtonStates() {
    if (decreaseFontBtn) {
      decreaseFontBtn.disabled = currentFontSize <= MIN_FONT_SIZE;
      decreaseFontBtn.style.opacity = currentFontSize <= MIN_FONT_SIZE ? '0.5' : '1';
      decreaseFontBtn.style.cursor = currentFontSize <= MIN_FONT_SIZE ? 'not-allowed' : 'pointer';
    }
    
    if (increaseFontBtn) {
      increaseFontBtn.disabled = currentFontSize >= MAX_FONT_SIZE;
      increaseFontBtn.style.opacity = currentFontSize >= MAX_FONT_SIZE ? '0.5' : '1';
      increaseFontBtn.style.cursor = currentFontSize >= MAX_FONT_SIZE ? 'not-allowed' : 'pointer';
    }
  }

  /**
   * Save font size setting
   */
  function saveFontSizeSetting(size) {
    try {
      localStorage.setItem(FONT_SIZE_KEY, size.toString());
    } catch (e) {
      console.warn('Could not save font size setting:', e);
    }
  }

  /**
   * Reset all accessibility settings
   */
  function resetAccessibilitySettings() {
    // Reset font size
    currentFontSize = 1.0;
    applyFontSize(currentFontSize);

    // Clear localStorage
    try {
      localStorage.removeItem(FONT_SIZE_KEY);
    } catch (e) {
      console.warn('Could not clear accessibility settings:', e);
    }
  }

  /**
   * Expose reset function globally for color-switcher reset button
   */
  window.resetAccessibilitySettings = resetAccessibilitySettings;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
