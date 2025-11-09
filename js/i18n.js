// Store translations globally
let translations = {};

// Available languages with their regions
const languageRegions = {
  asia: ["en", "id", "zh", "ja", "ko"],
  america: ["es", "pt", "fr-ca"],
  europe: ["fr", "de", "it", "ru", "nl"],
  "middle-east": ["ar", "tr", "he", "fa"]
};

// All available languages
const availableLanguages = [
  ...languageRegions.asia,
  ...languageRegions.america,
  ...languageRegions.europe,
  ...languageRegions["middle-east"]
];

// Get region for a language
function getRegionForLanguage(lang) {
  for (const [region, languages] of Object.entries(languageRegions)) {
    if (languages.includes(lang)) {
      return region;
    }
  }
  return "asia"; // Default fallback
}

// Load translation for a specific language
async function loadLanguage(lang) {
  try {
    const region = getRegionForLanguage(lang);
    const response = await fetch(`assets/locales/${region}/${lang}.json`);
    const data = await response.json();
    translations[lang] = data;
    return data;
  } catch (error) {
    console.error(`Error loading ${lang} translations:`, error);
    // Fallback to English if loading fails
    if (lang !== "en") {
      console.log(`Falling back to English...`);
      return loadLanguage("en");
    }
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

  // Language code to short name mapping
  const languageShortNames = {
    "en": "EN",
    "id": "ID",
    "zh": "ZH",
    "ja": "JA",
    "ko": "KO",
    "es": "ES",
    "pt": "PT",
    "fr-ca": "FR",
    "fr": "FR",
    "de": "DE",
    "it": "IT",
    "ru": "RU",
    "nl": "NL",
    "ar": "AR",
    "tr": "TR",
    "he": "HE",
    "fa": "FA"
  };

  // Get saved language from localStorage or default to English
  let currentLang = localStorage.getItem("language") || "en";

  // Apply the saved language and update display
  applyLanguage(currentLang);
  updateCurrentLanguageDisplay(currentLang);
  
  // Update active option based on saved language
  languageOptions.forEach((opt) => opt.classList.remove("active"));
  const savedLanguageOption = document.querySelector(`.language-switcher__option[data-lang="${currentLang}"]`);
  if (savedLanguageOption) {
    savedLanguageOption.classList.add("active");
  }

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

  // Close dropdown when scrolling the page
  let scrollTimeout;
  window.addEventListener("scroll", function () {
    // Clear previous timeout
    clearTimeout(scrollTimeout);
    
    // Close dropdown immediately when scrolling starts
    if (languageSwitcher.classList.contains("active")) {
      languageSwitcher.classList.remove("active");
    }
    
    // Optional: Add a small delay before allowing dropdown to open again
    scrollTimeout = setTimeout(function () {
      // Dropdown can be opened again after scroll stops
    }, 150);
  }, { passive: true });

  // Function to update current language display
  function updateCurrentLanguageDisplay(lang) {
    const selectedOption = document.querySelector(`.language-switcher__option[data-lang="${lang}"]`);
    if (selectedOption) {
      const selectedFlag = selectedOption.querySelector(".language-switcher__flag").textContent;
      const shortName = languageShortNames[lang] || lang.toUpperCase();
      
      if (currentLanguageText) {
        currentLanguageText.textContent = shortName;
      }
      
      if (currentLanguageFlag) {
        currentLanguageFlag.textContent = selectedFlag;
      }
    }
  }

  // Change language when an option is clicked
  languageOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang");
      applyLanguage(lang);
      languageSwitcher.classList.remove("active");

      // Update active option
      languageOptions.forEach((opt) => opt.classList.remove("active"));
      this.classList.add("active");

      // Update current language display with short code
      updateCurrentLanguageDisplay(lang);

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
    const rtlLanguages = ["ar", "he", "fa"];
    if (rtlLanguages.includes(lang)) {
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
