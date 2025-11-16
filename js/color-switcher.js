(function () {
  const COLOR_KEY = 'firstColor';
  const THEME_KEY = 'selectedTheme';
  const DEFAULT_HEX = '#ff5c1a';
  const DEFAULT_THEME = 'auto';

  // Sidebar elements
  const floatingButton = document.getElementById('floating-theme-button');
  const sidebar = document.getElementById('theme-sidebar');
  const sidebarOverlay = document.getElementById('theme-sidebar-overlay');
  const sidebarClose = document.getElementById('theme-sidebar-close');
  
  if (!sidebar) return;

  const canvas = document.getElementById('color-canvas');
  const cursor = document.getElementById('canvas-cursor');
  const hueSlider = document.getElementById('hue-slider');
  const hexInput = document.getElementById('color-hex');
  const preview = document.getElementById('color-preview');
  const resetBtn = document.getElementById('color-reset');
  const swatches = Array.from(document.querySelectorAll('.color-swatch'));
  const themeOptions = Array.from(document.querySelectorAll('.theme-option'));

  let currentHue = 14;
  let currentSaturation = 100;
  let currentLightness = 50;
  let isDragging = false;
  let currentTheme = DEFAULT_THEME;
  let systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // Color conversion utilities
  function hexToHSL(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { h: 0, s: 0, l: 0 };

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }

    const toHex = (n) => {
      const hex = Math.round((n + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function isValidHex(hex) {
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex);
  }

  function expandHex(hex) {
    if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
      return '#' + hex.substring(1).split('').map(c => c + c).join('').toLowerCase();
    }
    return hex.toLowerCase();
  }

  // Theme functions
  function applyTheme(theme) {
    currentTheme = theme;
    
    if (theme === 'auto') {
      // Apply based on system preference
      const isDark = systemThemeMediaQuery.matches;
      document.body.classList.toggle('dark-theme', isDark);
    } else {
      document.body.classList.toggle('dark-theme', theme === 'dark');
    }
    
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
    updateThemeUI();
  }

  function updateThemeUI() {
    themeOptions.forEach(option => {
      const theme = option.dataset.theme;
      option.classList.toggle('active', theme === currentTheme);
    });
  }

  function handleSystemThemeChange(e) {
    if (currentTheme === 'auto') {
      document.body.classList.toggle('dark-theme', e.matches);
    }
  }

  // Apply color
  function applyColor(hex) {
    const color = expandHex(hex);
    document.body.style.setProperty('--first-color', color);
    try { localStorage.setItem(COLOR_KEY, color); } catch (_) {}
    
    // Update HSL values from hex
    const hsl = hexToHSL(color);
    currentHue = hsl.h;
    currentSaturation = hsl.s;
    currentLightness = hsl.l;
    
    updateUI(color);
  }

  // Update UI
  function updateUI(hex) {
    const color = expandHex(hex);
    
    // Update preview
    if (preview) {
      preview.style.background = color;
    }
    
    // Update hex input
    if (hexInput) {
      hexInput.value = color;
    }
    
    // Update canvas background
    if (canvas) {
      canvas.style.background = `
        linear-gradient(to bottom, transparent, #000),
        linear-gradient(to right, #fff, hsl(${currentHue}, 100%, 50%))
      `;
    }
    
    // Update hue slider
    if (hueSlider) {
      hueSlider.value = currentHue;
    }
    
    // Update cursor position
    updateCursorPosition();
    
    // Highlight active swatch
    swatches.forEach(el => {
      const c = expandHex(el.dataset.color || '');
      el.classList.toggle('active', c === color);
    });
  }

  // Update cursor position on canvas
  function updateCursorPosition() {
    if (!cursor || !canvas) return;
    
    // Calculate position based on saturation and lightness
    // x = saturation (0-100), y = lightness (100-0, inverted)
    const x = currentSaturation;
    const y = 100 - currentLightness;
    
    cursor.style.left = `${x}%`;
    cursor.style.top = `${y}%`;
  }

  // Handle canvas interaction
  function updateColorFromCanvas(event) {
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));
    
    currentSaturation = Math.round((x / rect.width) * 100);
    currentLightness = Math.round(100 - (y / rect.height) * 100);
    
    const hex = hslToHex(currentHue, currentSaturation, currentLightness);
    applyColor(hex);
  }

  // Toggle sidebar
  function toggleSidebar(force) {
    const willOpen = typeof force === 'boolean' ? force : !sidebar.classList.contains('open');
    sidebar.classList.toggle('open', willOpen);
    
    // Prevent body scroll when sidebar is open
    if (willOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  // Update aria labels for i18n
  function updateAriaLabels() {
    swatches.forEach(btn => {
      const i18nKey = btn.getAttribute('data-i18n-aria');
      if (i18nKey && window.translations) {
        const currentLang = document.documentElement.lang || 'en';
        const translations = window.translations[currentLang];
        if (translations && translations[i18nKey]) {
          btn.setAttribute('aria-label', translations[i18nKey]);
        }
      }
    });
    
    themeOptions.forEach(btn => {
      const theme = btn.dataset.theme;
      const labelElement = btn.querySelector('.theme-option__label');
      if (labelElement && window.translations) {
        const currentLang = document.documentElement.lang || 'en';
        const translations = window.translations[currentLang];
        const i18nKey = `colorSwitcher.${theme}`;
        if (translations && translations[i18nKey]) {
          btn.setAttribute('aria-label', `${translations[i18nKey]} theme`);
        }
      }
    });
  }

  // Load saved preferences
  function loadSaved() {
    // Load theme
    let savedTheme = null;
    try { savedTheme = localStorage.getItem(THEME_KEY); } catch (_) {}
    
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      applyTheme(savedTheme);
    } else {
      applyTheme(DEFAULT_THEME);
    }
    
    // Load color
    let savedColor = null;
    try { savedColor = localStorage.getItem(COLOR_KEY); } catch (_) {}
    
    if (savedColor && isValidHex(savedColor)) {
      applyColor(savedColor);
    } else {
      const hsl = hexToHSL(DEFAULT_HEX);
      currentHue = hsl.h;
      currentSaturation = hsl.s;
      currentLightness = hsl.l;
      updateUI(DEFAULT_HEX);
    }
  }

  // Event Listeners
  floatingButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    
    // Close other dropdowns first
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
      navMenu.classList.remove('show-menu');
    }
    const languageSwitcher = document.getElementById('language-switcher');
    if (languageSwitcher) {
      languageSwitcher.classList.remove('active');
    }
    
    // Then open sidebar
    toggleSidebar(true);
  });

  sidebarClose?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSidebar(false);
  });

  sidebarOverlay?.addEventListener('click', () => {
    toggleSidebar(false);
  });

  // Close sidebar with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      toggleSidebar(false);
    }
  });

  // Theme option clicks
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.dataset.theme;
      if (theme) {
        applyTheme(theme);
      }
    });
  });

  // Listen for system theme changes
  systemThemeMediaQuery.addEventListener('change', handleSystemThemeChange);

  // Canvas events
  canvas?.addEventListener('mousedown', (e) => {
    isDragging = true;
    updateColorFromCanvas(e);
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      updateColorFromCanvas(e);
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch events for mobile
  canvas?.addEventListener('touchstart', (e) => {
    isDragging = true;
    const touch = e.touches[0];
    updateColorFromCanvas(touch);
    e.preventDefault();
  });

  document.addEventListener('touchmove', (e) => {
    if (isDragging) {
      const touch = e.touches[0];
      updateColorFromCanvas(touch);
      e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Hue slider
  hueSlider?.addEventListener('input', (e) => {
    currentHue = parseInt(e.target.value);
    const hex = hslToHex(currentHue, currentSaturation, currentLightness);
    applyColor(hex);
  });

  // Hex input
  hexInput?.addEventListener('input', () => {
    const raw = hexInput.value.trim();
    if (isValidHex(raw)) {
      applyColor(raw);
    }
  });

  hexInput?.addEventListener('blur', () => {
    // Revert to current color if invalid
    if (!isValidHex(hexInput.value.trim())) {
      hexInput.value = hslToHex(currentHue, currentSaturation, currentLightness);
    }
  });

  // Preset swatches
  swatches.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      if (color && isValidHex(color)) {
        applyColor(color);
      }
    });
  });

  // Reset button
  resetBtn?.addEventListener('click', () => {
    try { 
      localStorage.removeItem(COLOR_KEY);
      localStorage.removeItem(THEME_KEY);
    } catch (_) {}
    document.body.style.removeProperty('--first-color');
    
    // Reset theme to auto
    applyTheme(DEFAULT_THEME);
    
    // Reset color to default
    const hsl = hexToHSL(DEFAULT_HEX);
    currentHue = hsl.h;
    currentSaturation = hsl.s;
    currentLightness = hsl.l;
    updateUI(DEFAULT_HEX);
    
    // Reset accessibility settings
    if (typeof window.resetAccessibilitySettings === 'function') {
      window.resetAccessibilitySettings();
    }
  });

  // Language change observer
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
        updateAriaLabels();
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang']
  });

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadSaved();
      setTimeout(updateAriaLabels, 100);
    });
  } else {
    loadSaved();
    setTimeout(updateAriaLabels, 100);
  }
})();
