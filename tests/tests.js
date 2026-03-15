// ─────────────────────────────────────────────────────────────────────────────
//  tests.js — PokéStats Calculator test suite
//  Run by opening tests/index.html in a browser (served over HTTP).
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
      if (JSON.stringify(actual) !== JSON.stringify(expected))
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
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
        throw new Error(`Expected to contain ${JSON.stringify(item)}`);
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
      },
      toContain(item) {
        if (actual.includes(item))
          throw new Error(`Expected NOT to contain ${JSON.stringify(item)}`);
      },
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
//  FORMULA TESTS
// ─────────────────────────────────────────────────────────────────────────────
describe('calcHP — Gen III+', () => {
  it('Blissey HP at Lv100, 31 IV, 0 EV', () => {
    // floor((2*255 + 31 + 0) * 100/100) + 100 + 10 = 541 + 110 = 651
    expect(calcHP(255, 31, 0, 100, 3)).toBe(651);
  });

  it('perfect Blissey HP at Lv100 with 252 EVs', () => {
    // floor((2*255 + 31 + 63) * 1) + 110 = 604 + 110 = 714
    expect(calcHP(255, 31, 252, 100, 3)).toBe(714);
  });

  it('Garchomp HP at Lv100, 31 IV, 252 EV', () => {
    // floor((2*108 + 31 + 63) * 1) + 110 = 310 + 110 = 420
    expect(calcHP(108, 31, 252, 100, 3)).toBe(420);
  });

  it('Shedinja (base 1) always returns 1', () => {
    expect(calcHP(1, 31, 252, 100, 3)).toBe(1);
    expect(calcHP(1, 0, 0, 50, 3)).toBe(1);
  });

  it('252 EVs gives higher HP than 0 EVs', () => {
    expect(calcHP(100, 31, 252, 100, 3)).toBeGreaterThan(calcHP(100, 31, 0, 100, 3));
  });

  it('Lv100 gives higher HP than Lv50', () => {
    expect(calcHP(100, 31, 0, 100, 3)).toBeGreaterThan(calcHP(100, 31, 0, 50, 3));
  });

  it('0 IVs gives lower HP than 31 IVs', () => {
    expect(calcHP(100, 0, 0, 100, 3)).toBeLessThan(calcHP(100, 31, 0, 100, 3));
  });
});

describe('calcHP — Gen I & II', () => {
  it('Pikachu-range HP with base 45, 15 DV, 0 StatExp', () => {
    const result = calcHP(45, 15, 0, 100, 1);
    // floor(((45+15)*2 + 0) * 1) + 110 = 120 + 110 = 230
    expect(result).toBe(230);
  });

  it('higher StatExp gives higher HP', () => {
    expect(calcHP(100, 15, 65535, 100, 1)).toBeGreaterThan(calcHP(100, 15, 0, 100, 1));
  });

  it('max DV (15) gives higher HP than 0 DV', () => {
    expect(calcHP(100, 15, 0, 100, 1)).toBeGreaterThan(calcHP(100, 0, 0, 100, 1));
  });
});

describe('calcStat — Gen III+', () => {
  it('Garchomp Attack at Lv100, 31 IV, 252 EV, neutral nature', () => {
    // floor((floor((260+31+63)*1)+5)*1.0) = floor(354+5) = 359
    expect(calcStat(130, 31, 252, 100, 1.0, 3)).toBe(359);
  });

  it('Garchomp Attack with Adamant (+10%) nature', () => {
    // floor(359 * 1.1) = floor(394.9) = 394... wait
    // floor((floor((260+31+63)*1)+5)*1.1) = floor(354+5)*1.1 = floor(359*1.1) = floor(394.9) = 394
    expect(calcStat(130, 31, 252, 100, 1.1, 3)).toBe(394);
  });

  it('boosted nature (×1.1) gives higher stat than neutral', () => {
    const neutral = calcStat(100, 31, 0, 100, 1.0, 3);
    const boosted = calcStat(100, 31, 0, 100, 1.1, 3);
    expect(boosted).toBeGreaterThan(neutral);
  });

  it('reduced nature (×0.9) gives lower stat than neutral', () => {
    const neutral = calcStat(100, 31, 0, 100, 1.0, 3);
    const reduced = calcStat(100, 31, 0, 100, 0.9, 3);
    expect(reduced).toBeLessThan(neutral);
  });

  it('252 EVs increase stat by exactly 63 at Lv100', () => {
    const noEV   = calcStat(100, 31, 0,   100, 1.0, 3);
    const withEV = calcStat(100, 31, 252, 100, 1.0, 3);
    expect(withEV - noEV).toBe(63);
  });

  it('Lv50 stat is lower than Lv100 stat', () => {
    expect(calcStat(100, 31, 0, 50, 1.0, 3)).toBeLessThan(
      calcStat(100, 31, 0, 100, 1.0, 3)
    );
  });
});

describe('calcStat — Gen I & II', () => {
  it('returns a positive number', () => {
    expect(calcStat(100, 15, 0, 100, 1.0, 1)).toBeGreaterThan(0);
  });

  it('higher DV gives higher stat', () => {
    expect(calcStat(100, 15, 0, 100, 1.0, 1)).toBeGreaterThan(
      calcStat(100, 0, 0, 100, 1.0, 1)
    );
  });

  it('high StatExp gives higher stat than 0', () => {
    expect(calcStat(100, 15, 65535, 100, 1.0, 1)).toBeGreaterThan(
      calcStat(100, 15, 0, 100, 1.0, 1)
    );
  });
});

describe('getNatureMult', () => {
  it('Hardy (neutral) returns 1.0 for all stats', () => {
    ['ATK','DEF','SP.ATK','SP.DEF','SPD'].forEach(s => {
      expect(getNatureMult(0, s)).toBe(1.0);
    });
  });

  it('Adamant returns 1.1 for ATK', () => {
    const idx = NATURES.findIndex(n => n.name === 'Adamant');
    expect(getNatureMult(idx, 'ATK')).toBe(1.1);
  });

  it('Adamant returns 0.9 for SP.ATK', () => {
    const idx = NATURES.findIndex(n => n.name === 'Adamant');
    expect(getNatureMult(idx, 'SP.ATK')).toBe(0.9);
  });

  it('Adamant returns 1.0 for unaffected stats', () => {
    const idx = NATURES.findIndex(n => n.name === 'Adamant');
    ['DEF','SP.DEF','SPD'].forEach(s => {
      expect(getNatureMult(idx, s)).toBe(1.0);
    });
  });

  it('all 5 neutral natures return 1.0 for every stat', () => {
    ['Hardy','Docile','Serious','Bashful','Quirky'].forEach(name => {
      const idx = NATURES.findIndex(n => n.name === name);
      ['ATK','DEF','SP.ATK','SP.DEF','SPD'].forEach(s => {
        expect(getNatureMult(idx, s)).toBe(1.0);
      });
    });
  });

  it('every non-neutral nature boosts and reduces different stats', () => {
    NATURES.filter(n => n.up).forEach(n => {
      expect(n.up).not.toBe(n.down);
    });
  });
});

describe('getMaxStat', () => {
  it('returns a positive number for all 6 stats', () => {
    ['HP','ATK','DEF','SP.ATK','SP.DEF','SPD'].forEach(s => {
      expect(getMaxStat(s, 100, 3)).toBeGreaterThan(0);
    });
  });

  it('HP max exceeds 500 at Lv100', () => {
    expect(getMaxStat('HP', 100, 3)).toBeGreaterThan(500);
  });

  it('Lv100 max is greater than Lv50 max', () => {
    expect(getMaxStat('HP', 100, 3)).toBeGreaterThan(getMaxStat('HP', 50, 3));
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
    expect(NATURES.filter(n => !n.up)).toHaveLength(5);
  });

  it('has exactly 20 non-neutral natures', () => {
    expect(NATURES.filter(n => n.up)).toHaveLength(20);
  });

  it('all non-neutral natures have both up and down', () => {
    NATURES.filter(n => n.up).forEach(n => {
      expect(n.up).toBeTruthy();
      expect(n.down).toBeTruthy();
    });
  });

  it('all nature names are unique', () => {
    const names = NATURES.map(n => n.name);
    expect(new Set(names).size).toBe(25);
  });

  it('all stat modifiers reference valid stat keys', () => {
    const valid = new Set(['ATK','DEF','SP.ATK','SP.DEF','SPD']);
    NATURES.filter(n => n.up).forEach(n => {
      expect(valid.has(n.up)).toBeTruthy();
      expect(valid.has(n.down)).toBeTruthy();
    });
  });
});

describe('allPokemon data', () => {
  it('has exactly 1025 entries', () => {
    expect(allPokemon).toHaveLength(1025);
  });

  it('first entry is Bulbasaur (#1)', () => {
    expect(allPokemon[0].id).toBe(1);
    expect(allPokemon[0].name).toBe('bulbasaur');
  });

  it('last entry is Pecharunt (#1025)', () => {
    expect(allPokemon[allPokemon.length - 1].id).toBe(1025);
    expect(allPokemon[allPokemon.length - 1].name).toBe('pecharunt');
  });

  it('all entries have id and name', () => {
    expect(allPokemon.filter(p => !p.id || !p.name)).toHaveLength(0);
  });

  it('all IDs are unique', () => {
    expect(new Set(allPokemon.map(p => p.id)).size).toBe(1025);
  });

  it('all names are lowercase', () => {
    expect(allPokemon.some(p => p.name !== p.name.toLowerCase())).toBeFalsy();
  });

  it('contains key Pokémon', () => {
    const names = allPokemon.map(p => p.name);
    ['pikachu','mewtwo','garchomp','blissey','shedinja','magikarp',
     'terrakion','meloetta','koraidon','miraidon'].forEach(n => {
      expect(names).toContain(n);
    });
  });
});

describe('PRESETS data', () => {
  it('all presets have required fields', () => {
    Object.values(PRESETS).forEach(p => {
      expect(p.num).toBeGreaterThan(0);
      expect(p.name).toBeTruthy();
      expect(Array.isArray(p.types)).toBeTruthy();
      expect(p.bases).toHaveLength(6);
    });
  });

  it('all preset base stats are in valid range 1–255', () => {
    Object.values(PRESETS).forEach(p => {
      p.bases.forEach(b => {
        expect(b).toBeGreaterThanOrEqual(1);
        expect(b).toBeLessThanOrEqual(255);
      });
    });
  });

  it('Garchomp has correct base stats', () => {
    const g = PRESETS.garchomp;
    expect(g.bases[0]).toBe(108); // HP
    expect(g.bases[1]).toBe(130); // ATK
  });

  it('Shedinja has base HP of 1', () => {
    expect(PRESETS.shedinja.bases[0]).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  I18N TESTS
// ─────────────────────────────────────────────────────────────────────────────
describe('i18n — locale registry', () => {
  it('EN and ES locales are registered', () => {
    const locales = getAvailableLocales();
    expect(locales).toContain('en');
    expect(locales).toContain('es');
  });

  it('TRANSLATIONS.en has keys after locale load', () => {
    expect(Object.keys(TRANSLATIONS.en).length).toBeGreaterThan(50);
  });

  it('TRANSLATIONS.es has keys after locale load', () => {
    expect(Object.keys(TRANSLATIONS.es).length).toBeGreaterThan(50);
  });

  it('registerLocale merges into existing locale', () => {
    registerLocale('en', { '__merge_test__': 'merged' });
    expect(TRANSLATIONS.en['__merge_test__']).toBe('merged');
    delete TRANSLATIONS.en['__merge_test__'];
  });
});

describe('i18n — t()', () => {
  it('returns English string by default', () => {
    expect(t('nav.calc')).toBe('CALC');
  });

  it('returns key itself when key not found in any locale', () => {
    expect(t('nonexistent.key.xyz')).toBe('nonexistent.key.xyz');
  });

  it('returns Spanish string when lang is es', () => {
    const prev = currentLang;
    currentLang = 'es';
    expect(t('btn.calculate')).toBe('▶ CALCULAR STATS');
    currentLang = prev;
  });

  it('falls back to English when key missing in current lang', () => {
    const prev = currentLang;
    currentLang = 'es';
    TRANSLATIONS.en['__test_fallback__'] = 'fallback_value';
    expect(t('__test_fallback__')).toBe('fallback_value');
    delete TRANSLATIONS.en['__test_fallback__'];
    currentLang = prev;
  });
});

describe('i18n — tStat()', () => {
  it('returns HP in English', () => { expect(tStat('HP')).toBe('HP'); });
  it('returns ATK in English', () => { expect(tStat('ATK')).toBe('ATK'); });

  it('translates stat abbreviations to Spanish', () => {
    const prev = currentLang;
    currentLang = 'es';
    expect(tStat('ATK')).toBe('ATQ');
    expect(tStat('SP.ATK')).toBe('ATQ.ESP');
    expect(tStat('SP.DEF')).toBe('DEF.ESP');
    expect(tStat('SPD')).toBe('VEL');
    expect(tStat('HP')).toBe('PS');
    currentLang = prev;
  });

  it('returns key itself for unknown stat', () => {
    expect(tStat('UNKNOWN')).toBe('UNKNOWN');
  });
});

describe('i18n — tNature()', () => {
  it('returns Adamant in English', () => {
    expect(tNature('Adamant')).toBe('Adamant');
  });

  it('translates natures to Spanish', () => {
    const prev = currentLang;
    currentLang = 'es';
    expect(tNature('Adamant')).toBe('Firme');
    expect(tNature('Timid')).toBe('Tímida');
    expect(tNature('Jolly')).toBe('Alegre');
    expect(tNature('Modest')).toBe('Modesta');
    currentLang = prev;
  });

  it('all 25 natures have Spanish translations (no raw key returned)', () => {
    const prev = currentLang;
    currentLang = 'es';
    NATURES.forEach(n => {
      expect(tNature(n.name)).not.toBe('nature.' + n.name);
    });
    currentLang = prev;
  });
});

describe('i18n — completeness', () => {
  it('ES has all keys that EN has', () => {
    const missing = Object.keys(TRANSLATIONS.en)
      .filter(k => !TRANSLATIONS.es?.[k]);
    if (missing.length > 0)
      throw new Error(`ES missing: ${missing.join(', ')}`);
  });

  it('detectLang returns a registered language code', () => {
    expect(getAvailableLocales()).toContain(detectLang());
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  EV CAP TESTS
// ─────────────────────────────────────────────────────────────────────────────
describe('EV 510 cap — syncEV()', () => {
  // Reset state before each EV test
  function resetEVs() {
    state.evs = [0, 0, 0, 0, 0, 0];
    state.gen = 3;
  }

  it('allows 252 EVs in a single stat', () => {
    resetEVs();
    syncEV(0, 252, 'ev');
    expect(state.evs[0]).toBe(252);
  });

  it('does not allow more than 252 in a single stat', () => {
    resetEVs();
    syncEV(0, 300, 'ev');
    expect(state.evs[0]).toBe(252);
  });

  it('allows 252 + 252 = 504 total (valid)', () => {
    resetEVs();
    syncEV(0, 252, 'ev');
    syncEV(1, 252, 'ev');
    expect(state.evs[0] + state.evs[1]).toBeLessThanOrEqual(510);
  });

  it('caps third stat so total never exceeds 510', () => {
    resetEVs();
    syncEV(0, 252, 'ev');
    syncEV(1, 252, 'ev');
    syncEV(2, 252, 'ev'); // only 6 remaining
    const total = state.evs.reduce((a, b) => a + b, 0);
    expect(total).toBeLessThanOrEqual(510);
  });

  it('total stays at or below 510 after filling all six stats', () => {
    resetEVs();
    for (let i = 0; i < 6; i++) syncEV(i, 252, 'ev');
    const total = state.evs.reduce((a, b) => a + b, 0);
    expect(total).toBeLessThanOrEqual(510);
  });

  it('setAllEVs(0) clears all EVs', () => {
    resetEVs();
    syncEV(0, 252, 'ev');
    syncEV(1, 252, 'ev');
    setAllEVs(0);
    expect(state.evs.every(v => v === 0)).toBeTruthy();
  });

  it('spreadEVs preset stays within 510', () => {
    resetEVs();
    spreadEVs(252, 252, 0, 0, 0, 4); // 508 — valid
    const total = state.evs.reduce((a, b) => a + b, 0);
    expect(total).toBeLessThanOrEqual(510);
  });

  it('EV cap is not enforced in Gen I/II', () => {
    resetEVs();
    state.gen = 1;
    syncEV(0, 65535, 'ev');
    expect(state.evs[0]).toBe(65535);
    state.gen = 3; // restore
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  STATE TESTS
// ─────────────────────────────────────────────────────────────────────────────
describe('state object', () => {
  it('has all required fields', () => {
    ['hp','bases','ivs','evs','nature','level','gen'].forEach(f => {
      expect(state[f] !== undefined).toBeTruthy();
    });
  });

  it('bases has 5 elements', () => { expect(state.bases).toHaveLength(5); });
  it('ivs has 6 elements',   () => { expect(state.ivs).toHaveLength(6); });
  it('evs has 6 elements',   () => { expect(state.evs).toHaveLength(6); });
  it('default level is 100', () => { expect(state.level).toBe(100); });
  it('default gen is 3',     () => { expect(state.gen).toBe(3); });
});

// ─────────────────────────────────────────────────────────────────────────────
//  DOM TESTS
// ─────────────────────────────────────────────────────────────────────────────
describe('DOM — required elements exist', () => {
  const ids = [
    'pokemon-input', 'pokemon-dropdown', 'search-status', 'search-clear',
    'sprite-box', 'pokemon-sprite', 'sprite-placeholder',
    'pokedex-num', 'pokemon-name-display', 'type-badges',
    'gen-select', 'level-range', 'level-num',
    'base-hp', 'base-stats-grid',
    'nature-grid', 'selected-nature',
    'iv-inputs', 'ev-inputs', 'ev-total',
    'result-section', 'result-grid', 'result-gen', 'bst-value',
    'breakdown-body', 'lang-select',
    'page-calc', 'page-formula', 'page-compare',
  ];

  ids.forEach(id => {
    it(`#${id} exists`, () => {
      if (!document.getElementById(id))
        throw new Error(`#${id} not found`);
    });
  });

  it('nature grid has 25 buttons', () => {
    expect(document.querySelectorAll('.nature-btn').length).toBe(25);
  });

  it('lang-select has EN and ES options', () => {
    const values = Array.from(document.getElementById('lang-select').options)
                        .map(o => o.value);
    expect(values).toContain('en');
    expect(values).toContain('es');
  });

  it('bottom nav has 3 items', () => {
    expect(document.querySelectorAll('.nav-item').length).toBe(3);
  });
});

describe('DOM — IV/EV inputs use new element IDs', () => {
  it('iv-range-0 exists after buildIVInputs', () => {
    buildIVInputs();
    expect(document.getElementById('iv-range-0')).toBeTruthy();
  });

  it('iv-num-0 exists after buildIVInputs', () => {
    expect(document.getElementById('iv-num-0')).toBeTruthy();
  });

  it('ev-range-0 exists after buildEVInputs', () => {
    buildEVInputs();
    expect(document.getElementById('ev-range-0')).toBeTruthy();
  });

  it('ev-num-0 exists after buildEVInputs', () => {
    expect(document.getElementById('ev-num-0')).toBeTruthy();
  });

  it('all 6 IV range + number inputs exist', () => {
    for (let i = 0; i < 6; i++) {
      expect(document.getElementById('iv-range-' + i)).toBeTruthy();
      expect(document.getElementById('iv-num-'   + i)).toBeTruthy();
    }
  });

  it('all 6 EV range + number inputs exist', () => {
    for (let i = 0; i < 6; i++) {
      expect(document.getElementById('ev-range-' + i)).toBeTruthy();
      expect(document.getElementById('ev-num-'   + i)).toBeTruthy();
    }
  });
});

describe('DOM — initial state', () => {
  it('calculator page is active on load', () => {
    expect(document.getElementById('page-calc').classList.contains('active')).toBeTruthy();
  });

  it('result section is toggled by calculate()', () => {
    const rs = document.getElementById('result-section');
    rs.style.display = 'none';
    expect(rs.style.display).toBe('none');
    calculate();
    expect(rs.style.display).not.toBe('none');
  });

  it('level input defaults to 100', () => {
    expect(parseInt(document.getElementById('level-num').value)).toBe(100);
  });

  it('base-hp has a positive value', () => {
    expect(parseInt(document.getElementById('base-hp').value)).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  INTEGRATION TESTS
// ─────────────────────────────────────────────────────────────────────────────
describe('Integration — calculate()', () => {
  it('runs without throwing', () => {
    calculate();
    expect(document.getElementById('result-section').style.display).not.toBe('none');
  });

  it('renders 6 stat result cards', () => {
    calculate();
    expect(document.getElementById('result-grid').children.length).toBe(6);
  });

  it('BST is a positive number', () => {
    calculate();
    expect(parseInt(document.getElementById('bst-value').textContent)).toBeGreaterThan(0);
  });

  it('Blissey HP at Lv100 perfect IVs/EVs matches formula', () => {
    state.hp     = 255;
    state.ivs[0] = 31;
    state.evs[0] = 252;
    state.level  = 100;
    state.gen    = 3;
    document.getElementById('base-hp').value = 255;
    calculate();
    // The HP stat card should show 714
    const cards = document.getElementById('result-grid').children;
    expect(cards[0].querySelector('.stat-result-value').textContent).toBe('714');
  });
});

describe('Integration — language switch', () => {
  it('switches to Spanish without errors', () => {
    if (!TRANSLATIONS.es) throw new Error('ES locale not loaded — check script tags in tests/index.html');
    setLang('es');
    expect(t('btn.calculate')).toBe('▶ CALCULAR STATS');
    setLang('en');
  });

  it('switches back to English correctly', () => {
    setLang('es');
    setLang('en');
    expect(t('btn.calculate')).toBe('▶ CALCULATE STATS');
  });

  it('nature grid shows translated names in Spanish', () => {
    setLang('es');
    const firstNature = document.querySelector('.nature-btn');
    expect(firstNature.textContent).toContain('Fuerte');
    setLang('en');
  });

  it('nature grid shows English names after switching back', () => {
    setLang('es');
    setLang('en');
    expect(document.querySelector('.nature-btn').textContent).toContain('Hardy');
  });

  it('data-i18n span updates on language switch', () => {
    const span = document.querySelector('[data-i18n="btn.calculate"]');
    setLang('es');
    expect(span.textContent).toBe('▶ CALCULAR STATS');
    setLang('en');
    expect(span.textContent).toBe('▶ CALCULATE STATS');
  });
});

describe('Integration — dropdown filter', () => {
  it('empty string shows 60 results', () => {
    renderDropdown('');
    expect(document.querySelectorAll('.dd-item').length).toBe(60);
  });

  it('"pika" shows pikachu first', () => {
    renderDropdown('pika');
    expect(document.querySelector('.dd-item').dataset.name).toBe('pikachu');
  });

  it('"445" shows garchomp', () => {
    renderDropdown('445');
    const names = Array.from(document.querySelectorAll('.dd-item')).map(i => i.dataset.name);
    expect(names).toContain('garchomp');
  });

  it('nonsense query shows 0 results', () => {
    renderDropdown('zzzznotapokemon');
    expect(document.querySelectorAll('.dd-item').length).toBe(0);
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
      ${failed === 0 ? '✓ ALL TESTS PASSED' : `✗ ${failed} FAILED`}
      <span style="color:#9898c8;margin-left:12px">${passed}/${total}</span>
    </div>
    ${results.map(r => `
      <div style="display:flex;gap:8px;padding:6px 0;border-bottom:1px solid #2a2a5a;
                  font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:600">
        <span style="color:${r.pass ? '#44cc44' : '#ff4444'};min-width:16px">${r.pass ? '✓' : '✗'}</span>
        <span style="color:${r.pass ? '#e8e8f8' : '#ff8888'};flex:1">${r.name}</span>
        ${!r.pass ? `<span style="color:#ff6666;font-size:12px;text-align:right;max-width:300px">${r.error}</span>` : ''}
      </div>
    `).join('')}
  `;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(renderSummary, 150));
} else {
  setTimeout(renderSummary, 150);
}
