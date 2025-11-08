// Store translations globally
let translations = {};

// Available languages
const availableLanguages = ["en", "id", "es", "ar"];

// Load translation for a specific language
async function loadLanguage(lang) {
  try {
    const response = await fetch(`assets/locales/${lang}.json`);
    const data = await response.json();
    translations[lang] = data;
    return data;
  } catch (error) {
    console.error(`Error loading ${lang} translations:`, error);
    return null;
  }
}

// Preload all translations (optional - for faster language switching)
async function preloadAllLanguages() {
  try {
    const promises = availableLanguages.map((lang) => loadLanguage(lang));
    await Promise.all(promises);
    return translations;
  } catch (error) {
    console.error("Error preloading translations:", error);
    return null;
  }
}

// Language management
document.addEventListener("DOMContentLoaded", async function () {
  // Load all translations first (preload for better UX)
  await preloadAllLanguages();

  const languageSwitcher = document.getElementById("language-switcher");
  const languageOptions = document.querySelectorAll(
    ".language-switcher__option"
  );
  const currentLanguageText = document.querySelector(
    ".language-switcher__current span:not(.language-switcher__flag)"
  );
  const currentLanguageFlag = document.querySelector(
    ".language-switcher__current .language-switcher__flag"
  );
  const languageOverlay = document.querySelector(".language-switcher__overlay");

  // Get saved language from localStorage or default to English
  let currentLang = localStorage.getItem("language") || "en";

  // Apply the saved language
  applyLanguage(currentLang);

  // Toggle language dropdown
  languageSwitcher.addEventListener("click", function (e) {
    if (e.target.closest(".language-switcher__current")) {
      languageSwitcher.classList.toggle("active");
    }
  });

  // Close dropdown when clicking overlay
  if (languageOverlay) {
    languageOverlay.addEventListener("click", function () {
      languageSwitcher.classList.remove("active");
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!languageSwitcher.contains(e.target)) {
      languageSwitcher.classList.remove("active");
    }
  });

  // Change language when an option is clicked
  languageOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang");
      applyLanguage(lang);
      languageSwitcher.classList.remove("active");

      // Update active option
      languageOptions.forEach((opt) => opt.classList.remove("active"));
      this.classList.add("active");

      // Update current language display (text and flag)
      const selectedText = this.querySelector("span:not(.language-switcher__flag)").textContent;
      const selectedFlag = this.querySelector(".language-switcher__flag").textContent;
      
      if (currentLanguageText) {
        currentLanguageText.textContent = selectedText;
      }
      
      if (currentLanguageFlag) {
        currentLanguageFlag.textContent = selectedFlag;
      }

      // Save language preference
      localStorage.setItem("language", lang);
    });
  });

  // Function to apply language
  function applyLanguage(lang) {
    // Check if language is loaded
    if (!translations[lang]) {
      console.error(`Language ${lang} not loaded`);
      return;
    }

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update direction for RTL languages
    if (lang === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }

    // Update all elements with data-i18n attribute
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key]) {
        if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
          element.placeholder = translations[lang][key];
        } else {
          element.innerHTML = translations[lang][key];
        }
      }
    });

    // Update placeholders separately
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder");
      if (translations[lang] && translations[lang][key]) {
        element.placeholder = translations[lang][key];
      }
    });
  }
});
