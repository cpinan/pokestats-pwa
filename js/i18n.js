// ─────────────────────────────────────────────────────
//  i18n.js — locale registry + translation engine
//  No hardcoded strings. Each language lives in locales/{code}.js.
//
//  To add a language:
//    1. Create locales/{code}.js calling registerLocale('{code}', { ... })
//    2. Add <script src="locales/{code}.js"> in index.html (after i18n.js)
//    3. Add <option value="{code}"> in #lang-select
//    Done — everything else is automatic.
// ─────────────────────────────────────────────────────

const TRANSLATIONS = {};   // populated by registerLocale() calls
let currentLang = 'en';

/**
 * Called by each locales/*.js file to register its translations.
 * @param {string} code  BCP-47 language code, e.g. 'en', 'es', 'fr'
 * @param {Object} dict  flat key → string map
 */
function registerLocale(code, dict) {
  TRANSLATIONS[code] = Object.assign(TRANSLATIONS[code] || {}, dict);
}

// ── Core translation helpers ──────────────────────────────────────────────────

/** Translate a key, falling back to English, then the key itself. */
function t(key) {
  return (TRANSLATIONS[currentLang]?.[key])
      || (TRANSLATIONS['en']?.[key])
      || key;
}

/** Translate a stat abbreviation: 'ATK' → 'ATQ' (ES) */
function tStat(statKey) {
  const map = {
    'HP':     'stat.hp',
    'ATK':    'stat.atk',
    'DEF':    'stat.def',
    'SP.ATK': 'stat.spatk',
    'SP.DEF': 'stat.spdef',
    'SPD':    'stat.spd',
  };
  return t(map[statKey] || statKey);
}

/** Translate a stat full name: 'Attack' → 'Ataque' (ES) */
function tStatFull(statKey) {
  const map = {
    'HP':      'stat.hp.full',
    'Attack':  'stat.atk.full',
    'Defense': 'stat.def.full',
    'Sp. Atk': 'stat.spatk.full',
    'Sp. Def': 'stat.spdef.full',
    'Speed':   'stat.spd.full',
  };
  return t(map[statKey] || statKey);
}

/** Translate a nature name: 'Adamant' → 'Firme' (ES) */
function tNature(name) {
  return t('nature.' + name);
}

// ── Language switching ────────────────────────────────────────────────────────

function setLang(lang) {
  if (!TRANSLATIONS[lang]) {
    console.warn('i18n: locale "' + lang + '" not registered');
    return;
  }
  currentLang = lang;
  localStorage.setItem('pokestats-lang', lang);
  applyTranslations();
}

function detectLang() {
  const saved = localStorage.getItem('pokestats-lang');
  if (saved && TRANSLATIONS[saved]) return saved;
  const browser = (navigator.language || 'en').toLowerCase().split('-')[0];
  return TRANSLATIONS[browser] ? browser : 'en';
}

// ── DOM translation pass ──────────────────────────────────────────────────────

function applyTranslations() {
  // Rebuild JS-generated components that embed translated strings
  if (typeof buildNatureGrid    === 'function') buildNatureGrid();
  if (typeof buildBaseStatsGrid === 'function') buildBaseStatsGrid();
  if (typeof buildIVInputs      === 'function') buildIVInputs();
  if (typeof buildEVInputs      === 'function') buildEVInputs();

  // Rebuild nature chart if already rendered
  const chart = document.getElementById('full-nature-chart');
  if (chart?.innerHTML) { chart.innerHTML = ''; buildNatureChart(); }

  // Rebuild compare nature dropdowns if already open
  const selA = document.getElementById('cmp-nature-a');
  if (selA?.innerHTML) {
    const selB = document.getElementById('cmp-nature-b');
    selA.innerHTML = '';
    selB.innerHTML = '';
    NATURES.forEach((n, i) => {
      const opt = `<option value="${i}">${tNature(n.name)}</option>`;
      selA.innerHTML += opt;
      selB.innerHTML += opt;
    });
  }

  // Static data-i18n text nodes (skip <option> — handled below)
  document.querySelectorAll('[data-i18n]:not(option)').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });

  // data-i18n on <option> elements
  document.querySelectorAll('option[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });

  // Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  // Nature description box
  const natureBox = document.getElementById('selected-nature');
  if (natureBox && typeof state !== 'undefined') {
    const n = NATURES[state.nature];
    natureBox.innerHTML = n.up
      ? `${t('section.nature')}: <strong>${tNature(n.name)}</strong> — <span style="color:#44ff44">+${tStat(n.up)}</span> / <span style="color:#ff4444">-${tStat(n.down)}</span>`
      : `${t('section.nature')}: <strong>${tNature(n.name)}</strong> — ${t('nature.nomods')}`;
  }

  // Keep lang selector in sync
  const sel = document.getElementById('lang-select');
  if (sel) sel.value = currentLang;
}

/** Returns all registered language codes, e.g. ['en', 'es'] */
function getAvailableLocales() {
  return Object.keys(TRANSLATIONS);
}
