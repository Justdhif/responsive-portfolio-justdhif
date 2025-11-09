# 🌍 Localization Files Structure

File-file terjemahan untuk website portfolio diorganisir berdasarkan region geografis untuk memudahkan maintenance dan scalability.

## 📁 Struktur Folder

```
locales/
├── asia/           # Bahasa-bahasa Asia
│   ├── en.json     # English (🇬🇧)
│   ├── id.json     # Indonesia (🇮🇩)
│   ├── zh.json     # 中文/Chinese (🇨🇳)
│   ├── ja.json     # 日本語/Japanese (🇯🇵)
│   └── ko.json     # 한국어/Korean (🇰🇷)
│
├── america/        # Bahasa-bahasa Amerika
│   ├── es.json     # Español/Spanish (🇪🇸)
│   ├── pt.json     # Português/Portuguese (🇧🇷)
│   └── fr-ca.json  # Français Canadien/French Canadian (🇨🇦)
│
├── europe/         # Bahasa-bahasa Eropa
│   ├── fr.json     # Français/French (🇫🇷)
│   ├── de.json     # Deutsch/German (🇩🇪)
│   ├── it.json     # Italiano/Italian (🇮🇹)
│   ├── ru.json     # Русский/Russian (🇷🇺)
│   └── nl.json     # Nederlands/Dutch (🇳🇱)
│
└── middle-east/    # Bahasa-bahasa Timur Tengah
    ├── ar.json     # العربية/Arabic (🇸🇦)
    ├── tr.json     # Türkçe/Turkish (🇹🇷)
    ├── he.json     # עברית/Hebrew (🇮🇱)
    └── fa.json     # فارسی/Farsi/Persian (🇮🇷)
```

## 🎯 Total Bahasa: 17

### Asia (5 bahasa)
- English (EN) - Bahasa Inggris
- Indonesia (ID) - Bahasa Indonesia
- Chinese (ZH) - Bahasa Mandarin
- Japanese (JA) - Bahasa Jepang
- Korean (KO) - Bahasa Korea

### Amerika (3 bahasa)
- Spanish (ES) - Bahasa Spanyol
- Portuguese (PT) - Bahasa Portugis
- French Canadian (FR-CA) - Bahasa Prancis Kanada

### Eropa (5 bahasa)
- French (FR) - Bahasa Prancis
- German (DE) - Bahasa Jerman
- Italian (IT) - Bahasa Italia
- Russian (RU) - Bahasa Rusia
- Dutch (NL) - Bahasa Belanda

### Timur Tengah (4 bahasa)
- Arabic (AR) - Bahasa Arab
- Turkish (TR) - Bahasa Turki
- Hebrew (HE) - Bahasa Ibrani
- Farsi (FA) - Bahasa Persia

## 📝 Format File JSON

Setiap file JSON memiliki struktur yang sama dengan key-value pairs:

```json
{
  "menu": "Menu",
  "home": "Home",
  "about": "About Me",
  "projects": "Projects",
  "contact": "Contact Me",
  ...
}
```

## 🔄 Menambahkan Bahasa Baru

Untuk menambahkan bahasa baru:

1. Tentukan region yang sesuai (asia/america/europe/middle-east)
2. Buat file JSON baru di folder region tersebut dengan nama kode bahasa (misal: `de.json`)
3. Copy struktur dari `asia/en.json`
4. Terjemahkan semua value ke bahasa yang diinginkan
5. Update `js/i18n.js`:
   - Tambahkan kode bahasa ke array `languageRegions`
6. Update `index.html`:
   - Tambahkan option baru di dropdown language switcher

## 🌐 RTL Language Support

Bahasa-bahasa dengan arah kanan-ke-kiri (RTL) didukung secara otomatis:
- Arabic (AR) - العربية
- Hebrew (HE) - עברית
- Farsi (FA) - فارسی

## 🛠️ Maintenance

- Semua perubahan harus dilakukan di semua file bahasa untuk konsistensi
- Gunakan placeholder HTML tags (`<b>`, dll.) dengan hati-hati
- Test setiap bahasa setelah menambahkan key baru
- Backup files sebelum melakukan perubahan besar

## 📦 File Backward Compatibility

File-file lama di folder root (`en.json`, `id.json`, `es.json`, `ar.json`) masih ada untuk backward compatibility dan dapat dihapus setelah memastikan struktur baru berfungsi dengan baik.

---

**Last Updated:** November 9, 2025
**Maintained by:** Justdhif Dev.
