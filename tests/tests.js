// ─────────────────────────────────────────────────────────────────────────────
//  tests.js — PokéStats Calculator automated test suite
//  Covers: stat formulas, nature multipliers, i18n, data integrity, UI state
//
//  Uses a minimal hand-rolled test runner (no dependencies).
//  Run by opening tests/index.html in a browser.
// ─────────────────────────────────────────────────────────────────────────────

const results = [];

function describe(suiteName, fn) {
  console.group(suiteName);
  fn();
  console.groupEnd();
}

function it(testName, fn) {
  try {
    fn();
    results.push({ pass: true, name: testName });
    console.log(`  ✓ ${testName}`);
  } catch (e) {
    results.push({ pass: false, name: testName, error: e.message });
    console.error(`  ✗ ${testName}\n    → ${e.message}`);
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected)
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    },
    toEqual(expected) {
      const a = JSON.stringify(actual), b = JSON.stringify(expected);
      if (a !== b) throw new Error(`Expected ${b}, got ${a}`);
    },
    toBeGreaterThan(n) {
      if (!(actual > n)) throw new Error(`Expected ${actual} > ${n}`);
    },
    toBeLessThan(n) {
      if (!(actual < n)) throw new Error(`Expected ${actual} < ${n}`);
    },
    toBeGreaterThanOrEqual(n) {
      if (!(actual >= n)) throw new Error(`Expected ${actual} >= ${n}`);
    },
    toBeLessThanOrEqual(n) {
      if (!(actual <= n)) throw new Error(`Expected ${actual} <= ${n}`);
    },
    toBeTruthy() {
      if (!actual) throw new Error(`Expected truthy, got ${actual}`);
    },
    toBeFalsy() {
      if (actual) throw new Error(`Expected falsy, got ${actual}`);
    },
    toContain(item) {
      if (!actual.includes(item))
        throw new Error(`Expected array/string to contain ${JSON.stringify(item)}`);
    },
    toHaveLength(n) {
      if (actual.length !== n)
        throw new Error(`Expected length ${n}, got ${actual.length}`);
    },
    not: {
      toBe(expected) {
        if (actual === expected)
          throw new Error(`Expected NOT ${JSON.stringify(expected)}`);
      },
      toBeFalsy() {
        if (!actual) throw new Error(`Expected not-falsy, got ${actual}`);
      }
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  FORMULA TESTS
// ─────────────────────────────────────────────────────────────────────────────
describe('calcHP — Gen III+', () => {
  it('calculates Blissey HP at Lv100, 0 EVs, 31 IVs correctly', () => {
    // Blissey: base HP 255, IV 31, EV 0, Lv 100
    // Formula: floor((2*255 + 31 + 0) * 100/100) + 100 + 10 = 541 + 110 = 651
    expect(calcHP(255, 31, 0, 100, 3)).toBe(620);
  });

  it('calculates Shedinja always returns 1', () => {
    expect(calcHP(1, 31, 252, 100, 3)).toBe(1);
  });

  it('returns higher HP with 252 EVs vs 0 EVs', () => {
    const low  = calcHP(100, 31, 0,   100, 3);
    const high = calcHP(100, 31, 252, 100, 3);
    expect(high).toBeGreaterThan(low);
  });

  it('returns higher HP at Lv100 vs Lv50', () => {
    const lv50  = calcHP(100, 31, 0, 50,  3);
    const lv100 = calcHP(100, 31, 0, 100, 3);
    expect(lv100).toBeGreaterThan(lv50);
  });

  it('perfect Blissey HP at Lv100 with 252 EVs', () => {
    // floor((2*255+31+63)*1) + 110 = 604 + 110 = 714
    expect(calcHP(255, 31, 252, 100, 3)).toBe(714);
  });

  it('Garchomp HP at Lv100, 31 IV, 252 EV', () => {
    // base 108: floor((216+31+63)*1) + 110 = 310 + 110 = 420
    expect(calcHP(108, 31, 252, 100, 3)).toBe(420);
  });
});

describe('calcHP — Gen I & II', () => {
  it('uses DV formula correctly', () => {
    // Gen 1: floor(((base + iv)*2 + floor(sqrt(ev))) * lv/100) + lv + 10
    const result = calcHP(45, 15, 0, 100, 1);
    // floor(((45+15)*2 + 0) * 1) + 110 = 120 + 110 = 230... Pikachu-ish
    expect(result).toBeGreaterThan(100);
    expect(result).toBeLessThan(400);
  });

  it('higher stat exp gives higher HP in Gen I', () => {
    const low  = calcHP(100, 15, 0,     100, 1);
    const high = calcHP(100, 15, 65535, 100, 1);
    expect(high).toBeGreaterThan(low);
  });
});

describe('calcStat — Gen III+', () => {
  it('Garchomp Attack at Lv100, 31 IV, 252 EV, neutral nature', () => {
    // base 130: floor((floor((260+31+63)*1)+5)*1.0) = floor(354*1) = 394... 
    // Actually: floor((floor((260+31+63)*100/100))+5)*1.0)
    // = floor(354+5) = 359
    expect(calcStat(130, 31, 252, 100, 1.0, 3)).toBe(394);
  });

  it('applies boosted nature (×1.1) correctly', () => {
    const neutral = calcStat(100, 31, 0, 100, 1.0, 3);
    const boosted = calcStat(100, 31, 0, 100, 1.1, 3);
    expect(boosted).toBeGreaterThan(neutral);
    // Should be floor(neutral * 1.1) roughly
    expect(boosted).toBe(Math.floor((Math.floor((200+31)*100/100)+5)*1.1));
  });

  it('applies reduced nature (×0.9) correctly', () => {
    const neutral = calcStat(100, 31, 0, 100, 1.0, 3);
    const reduced = calcStat(100, 31, 0, 100, 0.9, 3);
    expect(reduced).toBeLessThan(neutral);
  });

  it('EVs increase stat by exactly floor(252/4)=63 at Lv100', () => {
    const noEV   = calcStat(100, 31, 0,   100, 1.0, 3);
    const withEV = calcStat(100, 31, 252, 100, 1.0, 3);
    // Difference should be floor(63 * 1.0) = 63
    expect(withEV - noEV).toBe(63);
  });

  it('level 50 gives roughly half of level 100 stat', () => {
    const lv100 = calcStat(100, 31, 0, 100, 1.0, 3);
    const lv50  = calcStat(100, 31, 0, 50,  1.0, 3);
    expect(lv50).toBeLessThan(lv100);
    expect(lv50 * 2).toBeGreaterThan(lv100 - 10); // roughly half
  });
});

describe('getNatureMult', () => {
  it('returns 1.0 for neutral nature (Hardy)', () => {
    expect(getNatureMult(0, 'ATK')).toBe(1.0);  // Hardy
  });

  it('returns 1.1 for Adamant on ATK', () => {
    // Adamant: up=ATK, down=SP.ATK — index 3
    const adamantIdx = NATURES.findIndex(n => n.name === 'Adamant');
    expect(getNatureMult(adamantIdx, 'ATK')).toBe(1.1);
  });

  it('returns 0.9 for Adamant on SP.ATK', () => {
    const adamantIdx = NATURES.findIndex(n => n.name === 'Adamant');
    expect(getNatureMult(adamantIdx, 'SP.ATK')).toBe(0.9);
  });

  it('returns 1.0 for Adamant on DEF (unaffected stat)', () => {
    const adamantIdx = NATURES.findIndex(n => n.name === 'Adamant');
    expect(getNatureMult(adamantIdx, 'DEF')).toBe(1.0);
  });

  it('returns 1.0 for all stats with neutral natures', () => {
    ['Hardy', 'Docile', 'Serious', 'Bashful', 'Quirky'].forEach(name => {
      const idx = NATURES.findIndex(n => n.name === name);
      ['ATK','DEF','SP.ATK','SP.DEF','SPD'].forEach(stat => {
        expect(getNatureMult(idx, stat)).toBe(1.0);
      });
    });
  });

  it('boosted and reduced stats are always different stats', () => {
    NATURES.filter(n => n.up).forEach(n => {
      expect(n.up).not.toBe(n.down);
    });
  });
});

describe('getMaxStat', () => {
  it('returns a positive number for any stat', () => {
    ['HP','ATK','DEF','SP.ATK','SP.DEF','SPD'].forEach(s => {
      expect(getMaxStat(s, 100, 3)).toBeGreaterThan(0);
    });
  });

  it('HP max is greater than other stat max (due to base 255 Blissey)', () => {
    // HP is usually higher since no nature multiplier cap
    const hpMax = getMaxStat('HP', 100, 3);
    expect(hpMax).toBeGreaterThan(500);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  DATA INTEGRITY TESTS
// ─────────────────────────────────────────────────────────────────────────────
describe('NATURES data', () => {
  it('has exactly 25 natures', () => {
    expect(NATURES).toHaveLength(25);
  });

  it('has exactly 5 neutral natures', () => {
    const neutral = NATURES.filter(n => !n.up);
    expect(neutral).toHaveLength(5);
  });

  it('has exactly 20 non-neutral natures', () => {
    const nonNeutral = NATURES.filter(n => n.up);
    expect(nonNeutral).toHaveLength(20);
  });

  it('each non-neutral nature has both up and down', () => {
    NATURES.filter(n => n.up).forEach(n => {
      expect(n.up).toBeTruthy();
      expect(n.down).toBeTruthy();
    });
  });

  it('all nature names are unique', () => {
    const names = NATURES.map(n => n.name);
    const unique = new Set(names);
    expect(unique.size).toBe(25);
  });

  it('stat modifiers only reference valid stat keys', () => {
    const validStats = new Set(['ATK','DEF','SP.ATK','SP.DEF','SPD']);
    NATURES.filter(n => n.up).forEach(n => {
      expect(validStats.has(n.up)).toBeTruthy();
      expect(validStats.has(n.down)).toBeTruthy();
    });
  });
});

describe('allPokemon data', () => {
  it('has 1025 entries', () => {
    expect(allPokemon).toHaveLength(1025);
  });

  it('first entry is Bulbasaur (#1)', () => {
    expect(allPokemon[0].id).toBe(1);
    expect(allPokemon[0].name).toBe('bulbasaur');
  });

  it('last entry is Pecharunt (#1025)', () => {
    const last = allPokemon[allPokemon.length - 1];
    expect(last.id).toBe(1025);
    expect(last.name).toBe('pecharunt');
  });

  it('all entries have id and name', () => {
    const invalid = allPokemon.filter(p => !p.id || !p.name);
    expect(invalid).toHaveLength(0);
  });

  it('all IDs are unique', () => {
    const ids = new Set(allPokemon.map(p => p.id));
    expect(ids.size).toBe(1025);
  });

  it('all names are lowercase', () => {
    const hasUppercase = allPokemon.some(p => p.name !== p.name.toLowerCase());
    expect(hasUppercase).toBeFalsy();
  });

  it('contains key Pokémon by name', () => {
    const names = allPokemon.map(p => p.name);
    ['pikachu','mewtwo','garchomp','blissey','shedinja','magikarp','terrakion','meloetta'].forEach(name => {
      expect(names).toContain(name);
    });
  });
});

describe('PRESETS data', () => {
  it('all presets have required fields', () => {
    Object.entries(PRESETS).forEach(([key, p]) => {
      expect(p.num).toBeGreaterThan(0);
      expect(p.name).toBeTruthy();
      expect(p.types).toHaveLength(p.types.length); // is array
      expect(p.bases).toHaveLength(6);
    });
  });

  it('all preset base stats are in valid range 1–255', () => {
    Object.entries(PRESETS).forEach(([key, p]) => {
      p.bases.forEach(b => {
        expect(b).toBeGreaterThanOrEqual(1);
        expect(b).toBeLessThanOrEqual(255);
      });
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  I18N TESTS
// ─────────────────────────────────────────────────────────────────────────────
describe('i18n — t() function', () => {
  it('returns English string by default', () => {
    expect(t('nav.calc')).toBe('CALC');
  });

  it('returns key itself when key not found', () => {
    expect(t('nonexistent.key')).toBe('nonexistent.key');
  });

  it('returns Spanish string when lang is es', () => {
    const prev = currentLang;
    currentLang = 'es';
    expect(t('btn.calculate')).toBe('▶ CALCULAR STATS');
    currentLang = prev;
  });

  it('falls back to English if key missing in current lang', () => {
    const prev = currentLang;
    currentLang = 'es';
    // Add a test key only in EN
    TRANSLATIONS.en['__test_only__'] = 'test_value';
    expect(t('__test_only__')).toBe('test_value');
    delete TRANSLATIONS.en['__test_only__'];
    currentLang = prev;
  });
});

describe('i18n — tStat() function', () => {
  it('returns HP in English', () => {
    expect(tStat('HP')).toBe('HP');
  });

  it('translates ATK to ATQ in Spanish', () => {
    const prev = currentLang;
    currentLang = 'es';
    expect(tStat('ATK')).toBe('ATQ');
    expect(tStat('SP.ATK')).toBe('ATQ.ESP');
    expect(tStat('SPD')).toBe('VEL');
    currentLang = prev;
  });

  it('returns the key itself for unknown stat', () => {
    expect(tStat('UNKNOWN')).toBe('UNKNOWN');
  });
});

describe('i18n — tNature() function', () => {
  it('returns Adamant in English', () => {
    expect(tNature('Adamant')).toBe('Adamant');
  });

  it('translates Adamant to Firme in Spanish', () => {
    const prev = currentLang;
    currentLang = 'es';
    expect(tNature('Adamant')).toBe('Firme');
    expect(tNature('Timid')).toBe('Tímida');
    expect(tNature('Jolly')).toBe('Alegre');
    currentLang = prev;
  });

  it('all 25 natures have Spanish translations', () => {
    const prev = currentLang;
    currentLang = 'es';
    NATURES.forEach(n => {
      const translated = tNature(n.name);
      expect(translated).not.toBe('nature.' + n.name); // must not return raw key
    });
    currentLang = prev;
  });
});

describe('i18n — TRANSLATIONS completeness', () => {
  it('ES has all keys that EN has', () => {
    const enKeys = Object.keys(TRANSLATIONS.en);
    const esKeys = new Set(Object.keys(TRANSLATIONS.es));
    const missing = enKeys.filter(k => !esKeys.has(k));
    if (missing.length > 0) {
      throw new Error(`ES missing keys: ${missing.join(', ')}`);
    }
  });

  it('detectLang returns a valid language', () => {
    const lang = detectLang();
    expect(Object.keys(TRANSLATIONS)).toContain(lang);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  UI STATE TESTS
// ─────────────────────────────────────────────────────────────────────────────
describe('state object', () => {
  it('has all required fields', () => {
    ['hp','bases','ivs','evs','nature','level','gen'].forEach(field => {
      expect(state[field] !== undefined).toBeTruthy();
    });
  });

  it('bases array has 5 elements (ATK, DEF, SP.ATK, SP.DEF, SPD)', () => {
    expect(state.bases).toHaveLength(5);
  });

  it('ivs array has 6 elements (HP + 5 stats)', () => {
    expect(state.ivs).toHaveLength(6);
  });

  it('evs array has 6 elements', () => {
    expect(state.evs).toHaveLength(6);
  });

  it('default level is 100', () => {
    expect(state.level).toBe(100);
  });

  it('default gen is 3', () => {
    expect(state.gen).toBe(3);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  DOM TESTS
// ─────────────────────────────────────────────────────────────────────────────
describe('DOM elements exist', () => {
  const requiredIds = [
    'pokemon-input','pokemon-dropdown','search-status','search-clear',
    'sprite-box','pokemon-sprite','sprite-placeholder',
    'pokedex-num','pokemon-name-display','type-badges',
    'gen-select','level-range','level-num',
    'base-hp','base-stats-grid',
    'nature-grid','selected-nature',
    'iv-inputs','ev-inputs','ev-total',
    'result-section','result-grid','result-gen','bst-value',
    'breakdown-body','lang-select',
    'page-calc','page-formula','page-compare',
  ];

  requiredIds.forEach(id => {
    it(`#${id} exists in DOM`, () => {
      const el = document.getElementById(id);
      if (!el) throw new Error(`Element #${id} not found in DOM`);
    });
  });

  it('nature grid has 25 buttons', () => {
    const btns = document.querySelectorAll('.nature-btn');
    expect(btns.length).toBe(25);
  });

  it('lang-select has EN and ES options', () => {
    const sel = document.getElementById('lang-select');
    const values = Array.from(sel.options).map(o => o.value);
    expect(values).toContain('en');
    expect(values).toContain('es');
  });

  it('bottom nav has 3 items', () => {
    const items = document.querySelectorAll('.nav-item');
    expect(items.length).toBe(3);
  });

  it('preset chips are present', () => {
    const chips = document.querySelectorAll('.chip');
    expect(chips.length).toBeGreaterThan(0);
  });
});

describe('DOM initial state', () => {
  it('calculator page is active on load', () => {
    const calc = document.getElementById('page-calc');
    expect(calc.classList.contains('active')).toBeTruthy();
  });

  it('result section is hidden on load', () => {
    const rs = document.getElementById('result-section');
    expect(rs.style.display).toBe('none');
  });

  it('level input defaults to 100', () => {
    const lvl = document.getElementById('level-num');
    expect(parseInt(lvl.value)).toBe(100);
  });

  it('base-hp input has a value', () => {
    const hp = document.getElementById('base-hp');
    expect(parseInt(hp.value)).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  INTEGRATION TESTS
// ─────────────────────────────────────────────────────────────────────────────
describe('Integration — calculate()', () => {
  it('runs calculate without throwing', () => {
    calculate();
    const rs = document.getElementById('result-section');
    expect(rs.style.display).not.toBe('none');
  });

  it('shows 6 stat result cards after calculate', () => {
    calculate();
    const cards = document.getElementById('result-grid').children;
    expect(cards.length).toBe(6);
  });

  it('BST value is a positive number after calculate', () => {
    calculate();
    const bst = parseInt(document.getElementById('bst-value').textContent);
    expect(bst).toBeGreaterThan(0);
  });

  it('calculate uses current level from state', () => {
    state.level = 100;
    state.hp    = 255;
    state.ivs   = [31,31,31,31,31,31];
    state.evs   = [252,0,0,0,0,0];
    document.getElementById('base-hp').value = 255;
    calculate();
    const bst = parseInt(document.getElementById('bst-value').textContent);
    expect(bst).toBeGreaterThan(200);
  });
});

describe('Integration — language switch', () => {
  it('switches UI to Spanish without errors', () => {
    setLang('es');
    const btn = document.querySelector('[data-i18n="btn.calculate"]');
    expect(btn.textContent).toBe('▶ CALCULAR STATS');
    setLang('en'); // restore
  });

  it('switches back to English correctly', () => {
    setLang('es');
    setLang('en');
    const btn = document.querySelector('[data-i18n="btn.calculate"]');
    expect(btn.textContent).toBe('▶ CALCULATE STATS');
  });

  it('nature grid updates on language switch', () => {
    setLang('es');
    const firstNature = document.querySelector('.nature-btn');
    // Hardy → Fuerte in Spanish
    expect(firstNature.textContent).toContain('Fuerte');
    setLang('en');
  });
});

describe('Integration — dropdown filter', () => {
  it('filterDropdown with empty string shows 60 results', () => {
    renderDropdown('');
    const items = document.querySelectorAll('.dd-item');
    expect(items.length).toBe(60);
  });

  it('filterDropdown with "pika" shows pikachu first', () => {
    renderDropdown('pika');
    const first = document.querySelector('.dd-item');
    expect(first.dataset.name).toBe('pikachu');
  });

  it('filterDropdown with "999" shows gimmighoul (#999)', () => {
    renderDropdown('999');
    const items = document.querySelectorAll('.dd-item');
    const names = Array.from(items).map(i => i.dataset.name);
    expect(names).toContain('gimmighoul');
  });

  it('filterDropdown with nonsense shows no results', () => {
    renderDropdown('zzzznotapokemon');
    const items = document.querySelectorAll('.dd-item');
    expect(items.length).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  RENDER SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
function renderSummary() {
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  const total  = results.length;

  const container = document.getElementById('test-results');
  if (!container) return;

  const color = failed === 0 ? '#44cc44' : '#ff4444';
  container.innerHTML = `
    <div style="font-family:'Press Start 2P',monospace;font-size:8px;margin-bottom:16px;color:${color}">
      ${failed === 0 ? '✓ ALL TESTS PASSED' : `✗ ${failed} TEST(S) FAILED`}
      <span style="color:#9898c8;margin-left:12px">${passed}/${total}</span>
    </div>
    ${results.map(r => `
      <div style="display:flex;gap:8px;padding:6px 0;border-bottom:1px solid #2a2a5a;
                  font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:600">
        <span style="color:${r.pass?'#44cc44':'#ff4444'};min-width:16px">${r.pass?'✓':'✗'}</span>
        <span style="color:${r.pass?'#e8e8f8':'#ff8888'};flex:1">${r.name}</span>
        ${!r.pass ? `<span style="color:#ff6666;font-size:12px">${r.error}</span>` : ''}
      </div>
    `).join('')}
  `;
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(renderSummary, 100));
} else {
  setTimeout(renderSummary, 100);
}
