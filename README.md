# ⚔️ PokéStats Calculator

> A fast, offline-ready Progressive Web App for calculating Pokémon stats across all generations — with full i18n support.

### 🌐 [Live Demo → cpinan.github.io/pokestats-pwa](https://cpinan.github.io/pokestats-pwa/)
### 🧪 [Run Tests → cpinan.github.io/pokestats-pwa/tests/index.html](https://cpinan.github.io/pokestats-pwa/tests/index.html)

[![Live](https://img.shields.io/badge/Live-Demo-brightgreen?logo=github)](https://cpinan.github.io/pokestats-pwa/)
[![PWA](https://img.shields.io/badge/PWA-ready-blueviolet?logo=googlechrome)](#pwa-installation)
[![Generations](https://img.shields.io/badge/Generations-I--IX-red)](#generation-differences)
[![i18n](https://img.shields.io/badge/Languages-EN%20%7C%20ES-orange)](#internationalisation-i18n)
[![Tests](https://img.shields.io/badge/Tests-~70%20cases-brightgreen)](#running-tests)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)

---

## ✨ Features

- 🔍 **Instant Pokémon search** — all 1,025 Pokémon (Gen I–IX) in a live-filter dropdown, no network needed for the list
- 📊 **Accurate stat formulas** — Gen I/II DV/StatExp and Gen III–IX IV/EV formulas, all verified against Bulbapedia
- 🌿 **All 25 natures** — visual grid with +/− indicators, fully translated
- 🎚️ **IV & EV sliders** — per-stat sliders with quick-fill presets (Perfect, SpeedSweep, PhysTank…)
- ⚖️ **Build comparator** — compare two EV spreads or natures side by side
- 📐 **Formula reference** — full Gen I/II and Gen III+ formula sheet with a nature chart
- 🌐 **i18n** — English and Spanish, auto-detected from browser language, persisted in `localStorage`
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

## 📁 Project Structure

```
pokestats/
├── index.html              # App shell — loads CSS + JS modules
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker (offline caching)
├── icon-192.png            # PWA icon
├── icon-512.png            # PWA icon
├── .env.example            # API config template
├── .gitignore
│
├── css/
│   └── styles.css          # Full theme — Pokédex dark aesthetic, layout, animations
│
├── js/                     # Load order matters — see index.html
│   ├── data.js             # NATURES, STATS, PRESETS, TYPE_COLORS, allPokemon (1,025)
│   ├── formulas.js         # calcHP / calcStat / getNatureMult / getMaxStat
│   ├── i18n.js             # TRANSLATIONS, t() / tStat() / tNature() / setLang()
│   ├── ui.js               # DOM builders: nature grid, IV/EV sliders, base stats
│   ├── pokemon.js          # Search dropdown, PokéAPI fetch, presets, sprite loading
│   └── app.js              # State, calculate(), compare(), event wiring, init()
│
└── tests/
    ├── index.html          # Test runner — open in browser to run all ~70 tests
    └── tests.js            # Unit · Integration · DOM · i18n · Formula tests
```

### Module dependency order

```
data.js ──► formulas.js ──► i18n.js ──► ui.js ──► pokemon.js ──► app.js
```

All modules use plain globals — no bundler, no build step required.

---

## 🎮 How to Use

### 1. Find a Pokémon

- Tap the **search box** → dropdown shows the first 60 Pokémon instantly
- Type a **name** (`garchomp`, `Pikachu`) or **number** (`445`, `25`) to filter
- Tap a result — real base stats, types, and sprite load from [PokéAPI](https://pokeapi.co)
- Press `Enter` to pick the first result · `Escape` to close · `↓` to navigate the list
- Six **quick presets** (Garchomp, Blissey, Tyranitar, Mewtwo, Shedinja, Magikarp) work offline

### 2. Configure your build

| Setting | Details |
|---|---|
| **Generation** | Gen I (RBY) · Gen II (GSC) · Gen III–V · Gen VI+ |
| **Level** | 1–100 slider (default: 100) |
| **Nature** | 25-button grid with translated names and +/− stat badges |
| **IVs** | Per-stat sliders · Presets: Perfect (31) · Zero · Gen I/II (15) · Hidden Power |
| **EVs** | Per-stat sliders (step 4) · Presets: Clear · 252/252 · SpeedSweep · PhysTank · SpTank |

### 3. Calculate

Hit **▶ CALCULATE STATS**. The results panel shows:

- Final value for each stat (green = nature boost, red = nature reduction)
- Percentage of the theoretical maximum
- Colour-coded bar chart
- Total stat sum

### 4. Compare builds

The **COMPARE** tab lets you run two EV spreads or natures against each other and highlights the winner per stat.

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

The app uses [PokéAPI](https://pokeapi.co) — free, public, read-only, no authentication needed.

### Fetch strategy

```
1. Direct   →  https://pokeapi.co/api/v2/pokemon/{name}   (works on HTTP/HTTPS)
2. Proxy    →  https://corsproxy.io/?{url}                (fallback if direct fails)
3. Preset   →  built-in offline data for the 6 presets    (last resort)
```

### Security practices

| Practice | Detail |
|---|---|
| No API keys in client JS | PokéAPI requires none; add a backend proxy if you need rate-limit control |
| Input sanitisation | All queries go through `encodeURIComponent()` before use in fetch URLs |
| Configurable constants | `API_BASE_URL` and `CORS_PROXY` at the top of `pokemon.js` — easy to swap |
| Read-only | No write requests; no user data sent to any server |
| `localStorage` only | Only `pokestats-lang` (language preference) is stored client-side |

See `.env.example` for backend proxy configuration without touching client code.

---

## 🌐 Internationalisation (i18n)

Language auto-detected from `navigator.language` on first load, saved to `localStorage`.

```js
t('btn.calculate')   // EN: "▶ CALCULATE STATS"  →  ES: "▶ CALCULAR STATS"
tStat('ATK')         // EN: "ATK"                →  ES: "ATQ"
tNature('Adamant')   // EN: "Adamant"            →  ES: "Firme"
```

### Adding a new language

Each language is a standalone file in `locales/` — no changes to existing files needed.

1. Create **`locales/fr.js`** (copy `locales/en.js` as a template):
   ```js
   registerLocale('fr', {
     'btn.calculate': '▶ CALCULER LES STATS',
     'nature.Adamant': 'Rigide',
     // missing keys fall back to English automatically
   });
   ```
2. Add a `<script>` tag in **`index.html`** after the other locale scripts:
   ```html
   <script src="locales/fr.js"></script>
   ```
3. Add an `<option>` to **`#lang-select`** in `index.html`:
   ```html
   <option value="fr">🇫🇷 FR</option>
   ```

That's it — three steps, one new file, two one-line edits.

---

## 🧪 Running Tests

**Live:** [cpinan.github.io/pokestats-pwa/tests/index.html](https://cpinan.github.io/pokestats-pwa/tests/index.html)

**Locally:**
```bash
python3 -m http.server 8080
# → open http://localhost:8080/tests/index.html
```

~80 test cases across:

| Suite | What's covered |
|---|---|
| **Formulas** | `calcHP` / `calcStat` for Gen I/II and III+ with known values (Blissey, Garchomp, Shedinja…) |
| **Nature multipliers** | All 25 natures · boosted, reduced, neutral · all 5 stats |
| **Data integrity** | 1,025 Pokémon (unique IDs, lowercase names) · 25 natures · all presets |
| **i18n** | `registerLocale` · `t()` fallback · `tStat()` / `tNature()` · ES completeness |
| **EV 510 cap** | Single stat cap (252) · total cap (510) · presets · Gen I/II bypass |
| **DOM** | ~30 required element IDs · IV/EV slider+number input pairs · initial state |
| **Integration** | `calculate()` output · Blissey HP formula end-to-end · language switch · dropdown filter |

---

## 🚢 Deployment

| Platform | URL | Steps |
|---|---|---|
| **GitHub Pages** | [cpinan.github.io/pokestats-pwa](https://cpinan.github.io/pokestats-pwa/) | Push to repo → Settings → Pages → Source: main → Save |
| **Netlify Drop** | auto-generated | Drag folder to [app.netlify.com/drop](https://app.netlify.com/drop) |
| **Vercel** | auto-generated | `npx vercel` in project folder |

HTTPS is required for PWA install prompt and service worker.

---

## 📱 PWA Installation

| Platform | Steps |
|---|---|
| **Android (Chrome)** | Menu ⋮ → Add to Home Screen |
| **iOS (Safari)** | Share → Add to Home Screen |
| **Desktop (Chrome/Edge)** | Install icon in address bar |

The Pokémon list (1,025 entries) is embedded — dropdown works offline. Sprites and base stats need a network connection.

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

| Version | Changes |
|---|---|
| **2.0** | Refactored into JS modules · i18n (EN/ES) · ~70 automated tests · README · `.env.example` |
| **1.1** | Live PokéAPI search · language selector · CORS proxy fallback |
| **1.0** | Initial release — Gen I–IX formulas, nature/IV/EV calculator, compare tab, PWA |
