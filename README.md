# ⚔️ PokéStats Calculator

> A fast, offline-ready Progressive Web App for calculating Pokémon stats across all generations — with full i18n support.

### 🌐 [Live Demo → cpinan.github.io/pokestats-pwa](https://cpinan.github.io/pokestats-pwa/)
### 🧪 [Run Tests → cpinan.github.io/pokestats-pwa/tests/index.html](https://cpinan.github.io/pokestats-pwa/tests/index.html)

[![Live](https://img.shields.io/badge/Live-Demo-brightgreen?logo=github)](https://cpinan.github.io/pokestats-pwa/)
[![PWA](https://img.shields.io/badge/PWA-ready-blueviolet?logo=googlechrome)](#-pwa-core-files)
[![Generations](https://img.shields.io/badge/Generations-I--IX-red)](#generation-differences)
[![i18n](https://img.shields.io/badge/Languages-EN%20%7C%20ES-orange)](#internationalisation-i18n)
[![Tests](https://img.shields.io/badge/Tests-~80%20cases-brightgreen)](#running-tests)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)

---

## ✨ Features

- 🔍 **Instant Pokémon search** — all 1,025 Pokémon (Gen I–IX) embedded, dropdown works offline
- 📊 **Accurate stat formulas** — Gen I/II DV/StatExp and Gen III–IX IV/EV, verified against Bulbapedia
- 🌿 **All 25 natures** — visual grid with +/− indicators, fully translated
- 🎚️ **IV & EV inputs** — sliders + number inputs per stat, 510 EV total cap enforced
- ⚖️ **Build comparator** — compare two EV spreads or natures side by side
- 📐 **Formula reference** — full Gen I/II and Gen III+ formula sheet with nature chart
- 🌐 **i18n** — English and Spanish, auto-detected from browser, extensible via `locales/`
- 📱 **PWA** — installable on Android, iOS, and desktop; works offline after first load

---

## 🚀 Quick Start

**Try it live:** [cpinan.github.io/pokestats-pwa](https://cpinan.github.io/pokestats-pwa/)

Or run locally:

```bash
git clone https://github.com/cpinan/pokestats-pwa.git
cd pokestats-pwa
python3 -m http.server 8080
# → open http://localhost:8080
```

> **Never open `index.html` directly as a `file://` URL** — browsers block `fetch()` from file origins. Always use a local server.

---

## 📱 PWA Core Files

These are the three files that make the app a Progressive Web App. Without them it's just a website.

### `manifest.json`

Tells the browser and Android/iOS how to install the app — name, icons, colours, launch URL.

```json
{
  "name": "PokéStats Calculator",
  "short_name": "PokéStats",
  "start_url": "/pokestats-pwa/",
  "scope": "/pokestats-pwa/",
  "display": "standalone",
  "theme_color": "#cc0000",
  "icons": [ ... ]
}
```

| Field | Purpose |
|---|---|
| `start_url` | URL opened when the installed app launches. **Must match the GitHub Pages subpath.** |
| `scope` | Defines the app boundary — navigating outside opens the browser instead |
| `display: standalone` | Hides browser chrome (URL bar, tabs) so it looks like a native app |
| `theme_color` | Colours the Android status bar and task switcher |
| `icons` | App icon shown on home screen — needs `192×192` and `512×512`, each with `"purpose": "any"` and `"purpose": "maskable"` as **separate entries** |

> ⚠️ `any` and `maskable` must be separate icon entries — combining them as `"any maskable"` causes Android install failures on some devices.

---

### `sw.js` — Service Worker

Intercepts all network requests and serves cached files when offline.

```
Browser request
    │
    ▼
Service Worker (sw.js)
    ├── Cache hit?  → serve from cache instantly
    └── Cache miss? → fetch from network, then cache
                      └── Network down? → fallback to index.html
```

**Three lifecycle events:**

| Event | What it does |
|---|---|
| `install` | Downloads all app files into the cache (`pokestats-v5`) |
| `activate` | Deletes old caches from previous versions |
| `fetch` | Intercepts requests — serves cache first, falls back to network |

**Important:** Every time you change any file, bump the cache version (`pokestats-v5` → `v6`). Otherwise users keep getting the old cached version until they manually clear their browser data.

```js
const CACHE = 'pokestats-v5'; // ← bump this on every deploy
```

---

### `index.html` — PWA Meta Tags

The HTML head contains the tags that wire everything together:

```html
<!-- Registers the manifest -->
<link rel="manifest" href="manifest.json">

<!-- iOS home screen icon (Safari doesn't use manifest icons) -->
<link rel="apple-touch-icon" sizes="180x180" href="icon-180.png">

<!-- Android/Chrome status bar colour -->
<meta name="theme-color" content="#cc0000">

<!-- Enables Add to Home Screen on iOS -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
```

And in `app.js`, the service worker is registered:

```js
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js');
}
```

The `location.protocol` guard prevents errors when opening as a `file://` URL locally.

---

### PWA Install Requirements Checklist

Chrome and Android require **all** of these to show the install prompt:

| Requirement | Status |
|---|---|
| Served over HTTPS (or localhost) | ✅ GitHub Pages provides HTTPS |
| Valid `manifest.json` with `name`, `short_name`, `start_url`, `display` | ✅ |
| Icon 192×192 with purpose `any` | ✅ |
| Icon 512×512 with purpose `any` | ✅ |
| Service worker with `fetch` handler registered | ✅ |
| `start_url` and `scope` match the deployment path | ✅ `/pokestats-pwa/` |

---

## 📁 Project Structure

```
pokestats-pwa/
│
├── 📱 PWA CORE
│   ├── manifest.json       # App identity, icons, install behaviour
│   ├── sw.js               # Service worker — offline caching
│   ├── icon-180.png        # Apple touch icon (iOS)
│   ├── icon-192.png        # Android home screen icon
│   └── icon-512.png        # Splash screen / high-res icon
│
├── 🏠 APP SHELL
│   └── index.html          # HTML shell — loads all CSS + JS modules
│
├── 🎨 STYLES
│   └── css/styles.css      # Pokédex dark theme, layout, animations
│
├── ⚙️ JS MODULES           # Load order matters (see index.html)
│   ├── js/data.js          # NATURES, STATS, PRESETS, allPokemon (1,025 entries)
│   ├── js/formulas.js      # calcHP / calcStat / getNatureMult / getMaxStat
│   ├── js/i18n.js          # Translation engine — registerLocale / t / tStat / tNature
│   ├── js/ui.js            # DOM builders — nature grid, IV/EV sliders, base stats
│   ├── js/pokemon.js       # Search dropdown, PokéAPI fetch, presets, sprites
│   └── js/app.js           # State, calculate(), compare(), event wiring, init()
│
├── 🌐 LOCALES
│   ├── locales/en.js       # English translations
│   └── locales/es.js       # Spanish translations
│
├── 🧪 TESTS
│   ├── tests/index.html    # Browser test runner
│   └── tests/tests.js      # ~80 unit + integration tests
│
└── 📄 CONFIG
    ├── .env.example        # API config template
    ├── .gitignore
    ├── LICENSE
    └── README.md
```

### Module load order

```
data.js ──► formulas.js ──► i18n.js ──► locales/en.js
                                    ──► locales/es.js
                                              │
                                              ▼
                                           ui.js ──► pokemon.js ──► app.js
```

---

## 🎮 How to Use

### 1. Find a Pokémon

- Tap the **search box** → dropdown shows the first 60 Pokémon instantly (offline)
- Type a **name** (`garchomp`, `Pikachu`) or **number** (`445`, `25`) to filter
- Tap a result — real base stats, types, and sprite load from [PokéAPI](https://pokeapi.co)
- Press `Enter` to pick the first result · `Escape` to close · `↓` to navigate
- Six **quick presets** (Garchomp, Blissey, Tyranitar, Mewtwo, Shedinja, Magikarp) work offline

### 2. Configure your build

| Setting | Details |
|---|---|
| **Generation** | Gen I (RBY) · Gen II (GSC) · Gen III–V · Gen VI+ |
| **Level** | 1–100 slider (default: 100) |
| **Nature** | 25-button grid with translated names and +/− stat badges |
| **IVs** | Slider + number input per stat · Presets: Perfect (31) · Zero · Gen I/II (15) |
| **EVs** | Slider + number input per stat · 510 total cap enforced · Presets: Clear · 252/252 · SpeedSweep · PhysTank · SpTank |

### 3. Calculate

Hit **▶ CALCULATE STATS**. The results panel shows:
- Final value per stat (green = nature boost, red = nature reduction)
- Percentage of the theoretical maximum
- Colour-coded bar chart · Total stat sum

### 4. Compare builds

The **COMPARE** tab runs two EV spreads or natures side by side and highlights the winner per stat.

---

## 🧬 Generation Differences

| | Gen I & II | Gen III–IX |
|---|---|---|
| Individual Values | DVs (0–15) | IVs (0–31) |
| Effort Values | Stat Exp (0–65,535) | EVs (0–252, max 510 total) |
| **HP formula** | `⌊((Base+DV)×2 + ⌊√StatExp⌋) × Lv/100⌋ + Lv + 10` | `⌊(2×Base + IV + ⌊EV/4⌋) × Lv/100⌋ + Lv + 10` |
| **Stat formula** | `⌊((Base+DV)×2 + ⌊√StatExp⌋) × Lv/100⌋ + 5` | `⌊(⌊(2B + IV + ⌊EV/4⌋) × Lv/100⌋ + 5) × Nature⌋` |
| Natures | Not applicable | ×1.1 boosted / ×0.9 reduced |

---

## 🔒 API & Security

The app uses [PokéAPI](https://pokeapi.co) — free, public, read-only, no key needed.

### Fetch strategy

```
1. Direct   →  https://pokeapi.co/api/v2/pokemon/{name}   (HTTP/HTTPS)
2. Proxy    →  https://corsproxy.io/?{url}                (fallback)
3. Preset   →  built-in offline data for 6 presets        (last resort)
```

| Practice | Detail |
|---|---|
| No API keys in client JS | PokéAPI requires none |
| Input sanitisation | All queries through `encodeURIComponent()` |
| Read-only | No write requests; no user data sent to any server |
| `localStorage` only | Only `pokestats-lang` stored client-side |

---

## 🌐 Internationalisation (i18n)

Language auto-detected from `navigator.language`, saved to `localStorage`.

```js
t('btn.calculate')   // EN: "▶ CALCULATE STATS"  →  ES: "▶ CALCULAR STATS"
tStat('ATK')         // EN: "ATK"                →  ES: "ATQ"
tNature('Adamant')   // EN: "Adamant"            →  ES: "Firme"
```

### Adding a new language

1. Create **`locales/fr.js`**:
   ```js
   registerLocale('fr', {
     'btn.calculate': '▶ CALCULER LES STATS',
     // missing keys fall back to English automatically
   });
   ```
2. Add `<script src="locales/fr.js"></script>` in `index.html`
3. Add `<option value="fr">🇫🇷 FR</option>` to `#lang-select`

---

## 🧪 Running Tests

**Live:** [cpinan.github.io/pokestats-pwa/tests/index.html](https://cpinan.github.io/pokestats-pwa/tests/index.html)

**Locally:**
```bash
python3 -m http.server 8080
# → open http://localhost:8080/tests/index.html
```

| Suite | What's covered |
|---|---|
| **Formulas** | `calcHP` / `calcStat` Gen I/II and III+ with known values |
| **Nature multipliers** | All 25 natures, all 5 stats, boosted/reduced/neutral |
| **Data integrity** | 1,025 Pokémon, 25 natures, all presets |
| **i18n** | `registerLocale`, `t()` fallback, `tStat()`, `tNature()`, ES completeness |
| **EV 510 cap** | Single stat cap (252), total cap (510), presets, Gen I/II bypass |
| **DOM** | ~30 required element IDs, IV/EV slider+number inputs, initial state |
| **Integration** | `calculate()` output, language switch, dropdown filter |

---

## 🚢 Deployment

| Platform | URL | Steps |
|---|---|---|
| **GitHub Pages** | [cpinan.github.io/pokestats-pwa](https://cpinan.github.io/pokestats-pwa/) | Push → Settings → Pages → Source: main |
| **Netlify Drop** | auto-generated | Drag folder to [app.netlify.com/drop](https://app.netlify.com/drop) |
| **Vercel** | auto-generated | `npx vercel` in project folder |

HTTPS is required for PWA install prompt and service worker.

---

## 📱 PWA Installation

| Platform | Steps |
|---|---|
| **Android (Chrome)** | Menu ⋮ → Add to Home Screen |
| **iOS (Safari)** | Share button → Add to Home Screen |
| **Desktop (Chrome/Edge)** | Install icon (⊕) in address bar |

After installing, the app opens in standalone mode (no browser chrome) and works offline. Sprites and live Pokémon data require a network connection.

**If the install prompt doesn't appear on Android:**
1. Uninstall the old PWA (long press icon → Uninstall)
2. Clear Chrome site data for the URL
3. Visit the site fresh and wait a few seconds

---

## ⚠️ Known Limitations

- Alternate forms must use hyphenated API names: `rotom-heat`, `aegislash-blade`
- Hidden Power type calculation not included
- Held item / ability stat modifiers not modelled

---

## 🙏 Credits

- Formulas: [Bulbapedia — Stat](https://bulbapedia.bulbagarden.net/wiki/Stat)
- Data: [PokéAPI](https://pokeapi.co) · Sprites: [PokeAPI/sprites](https://github.com/PokeAPI/sprites)
- Fonts: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) · [Rajdhani](https://fonts.google.com/specimen/Rajdhani)
- Pokémon © Nintendo / Game Freak / Creatures Inc.

---

## 📄 License

MIT — free to use, modify, and distribute.

---

## 📝 Changelog

### v2.2 — PWA Android install fix
- `manifest.json`: `start_url` and `scope` corrected to `/pokestats-pwa/` (was `/`, causing 404 on Android launch)
- `manifest.json`: icon paths changed to absolute URLs (`/pokestats-pwa/icon-192.png`)
- `manifest.json`: `any` and `maskable` split into separate icon entries (combined entry caused install failures on some Android devices)
- Icons regenerated as proper RGBA PNGs: `icon-180.png` (180×180 for iOS), `icon-192.png`, `icon-512.png`
- `sw.js`: cache bumped to `v5`, `icon-180.png` added to cache list
- `index.html`: `apple-touch-icon` updated to use `icon-180.png`
- README: PWA Core Files section added explaining `manifest.json`, `sw.js`, and PWA meta tags

### v2.1 — UX improvements and bug fixes
- **IV/EV number inputs**: each stat row now has slider + number input, both synced two-way
- **510 EV cap**: `syncEV()` enforces per-stat max (252) and total max (510); sliders dynamically cap to remaining budget
- **Startup scroll fix**: page no longer auto-scrolls to results on load (`_initSilent` flag added)
- **Locale files**: translations split from `i18n.js` into `locales/en.js` and `locales/es.js`; adding a new language requires only one new file
- **Favicon**: inline SVG Poké Ball favicon eliminates 404 error in console
- **Test suite rewrite**: 15 previously failing tests fixed; formula expected values corrected (Blissey HP 651, Garchomp ATK 359); 8 new EV cap tests; locale registry tests; `tests/index.html` now loads locale files
- **Nature/stat translations**: all 25 nature names and stat abbreviations translate when switching language

### v2.0 — Architecture refactor
- Monolithic `index.html` split into JS modules: `data.js`, `formulas.js`, `i18n.js`, `ui.js`, `pokemon.js`, `app.js`
- i18n system: `registerLocale()`, `t()`, `tStat()`, `tNature()`, `setLang()`, `detectLang()`
- Spanish translation added for all UI strings, nature names, stat abbreviations
- Language auto-detected from `navigator.language`, persisted in `localStorage`
- ~80 automated tests added covering formulas, data integrity, i18n, DOM, integration
- `README.md`, `LICENSE`, `.env.example`, `.gitignore` added
- `manifest.json` and `sw.js` separated as standalone files

### v1.1 — Live Pokémon search
- PokéAPI integration: search by name or Pokédex number loads real base stats, types, sprite
- All 1,025 Pokémon names embedded in `data.js` — dropdown works offline
- Language selector (EN/ES) added to header
- CORS proxy fallback (`corsproxy.io`) for environments where direct fetch fails
- `file://` URL guard on service worker registration
- Manifest `start_url` and `scope` errors resolved

### v1.0 — Initial release
- Stat calculator for Gen I–IX with HP and other-stat formulas
- All 25 natures with +/− indicators
- IV sliders (0–31), EV sliders (0–252)
- Generation selector (Gen I/II DV/StatExp vs Gen III+ IV/EV)
- Level slider (1–100, default 50)
- Build comparator tab
- Formula reference tab with nature chart
- 6 quick preset Pokémon (Garchomp, Blissey, Tyranitar, Mewtwo, Shedinja, Magikarp)
- PWA: `manifest.json`, service worker, installable on Android/iOS/desktop
- Pokédex dark theme with Press Start 2P pixel font
