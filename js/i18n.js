// ─────────────────────────────────────────────────────
//  i18n.js — internationalisation: translations + helpers
//  No dependencies.
//  To add a language: add a new key block to TRANSLATIONS and
//  an <option> in the #lang-select element in index.html.
// ─────────────────────────────────────────────────────

const TRANSLATIONS = {
  en: {
    'section.pokemon':    'POKÉMON',
    'section.basestats':  'BASE STATS',
    'section.nature':     'NATURE',
    'section.ivs':        'IVS',
    'section.evs':        'EVS',
    'section.breakdown':  'STAT BREAKDOWN',
    'section.formulas':   'STAT FORMULAS',
    'section.naturechart':'NATURE CHART',
    'section.compare':    'COMPARE BUILDS',
    'section.results':    'CALCULATED STATS',
    'label.search':       'SEARCH POKÉMON',
    'label.generation':   'GENERATION',
    'label.level':        'LEVEL',
    'label.naturea':      'NATURE A',
    'label.natureb':      'NATURE B',
    'label.hpgen3':       'HP FORMULA (Gen III+)',
    'label.statgen3':     'OTHER STATS FORMULA (Gen III+)',
    'label.hpgen1':       'HP FORMULA (Gen I & II)',
    'label.statgen1':     'OTHER STATS FORMULA (Gen I & II)',
    'label.naturemult':   'NATURE MULTIPLIERS',
    'label.maxstat':      'MAX POSSIBLE STAT (Lv 100, Gen III+)',
    'label.totalsum':     'TOTAL STAT SUM',
    'btn.calculate':      '▶ CALCULATE STATS',
    'btn.compare':        '▶ COMPARE',
    'nav.calc':           'CALC',
    'nav.formula':        'FORMULA',
    'nav.compare':        'COMPARE',
    'info.formulas':      'Gen III–IX uses two formulas depending on the stat type.',
    'info.gen12':         'In Gen I/II, IVs are called DVs and max at 15. EVs are Stat Exp and max at 65535. The formula uses √(StatExp).',
    'info.compare':       'Quickly compare two different EV spreads or natures on the same Pokémon.',
    'chip.perfect':       'Perfect (31)',
    'chip.zero':          'Zero (0)',
    'chip.gen12iv':       'Gen I/II (15)',
    'chip.hpower':        'Hidden Power',
    'chip.clearall':      'Clear All',
    'chip.speedsweep':    'SpeedSweep',
    'chip.phystank':      'PhysTank',
    'chip.sptank':        'SpTank',
    'placeholder.search': 'Type name or # to filter…',
    'gen.1':              'Gen I (RBY)',
    'gen.2':              'Gen II (GSC)',
    'gen.3':              'Gen III–V',
    'gen.6':              'Gen VI+ (Current)',
    'nature.nomods':      'no stat change',
    'status.loaded':      'loaded',
    'status.searching':   'LOADING…',
    'status.notfound':    'Not found',
    'status.offline':     'Offline — loaded preset data',
    'status.fileerror':   'Fetch failed — try serving over HTTP (not file://)',
    'status.allloaded':   'Pokémon loaded',
    // Stat names
    'stat.hp':    'HP',   'stat.atk':  'ATK', 'stat.def':  'DEF',
    'stat.spatk': 'SP.ATK', 'stat.spdef':'SP.DEF', 'stat.spd':  'SPD',
    'stat.hp.full':'HP',  'stat.atk.full':'Attack', 'stat.def.full':'Defense',
    'stat.spatk.full':'Sp. Atk', 'stat.spdef.full':'Sp. Def', 'stat.spd.full':'Speed',
    // Nature names
    'nature.Hardy':'Hardy','nature.Lonely':'Lonely','nature.Brave':'Brave',
    'nature.Adamant':'Adamant','nature.Naughty':'Naughty','nature.Bold':'Bold',
    'nature.Docile':'Docile','nature.Relaxed':'Relaxed','nature.Impish':'Impish',
    'nature.Lax':'Lax','nature.Timid':'Timid','nature.Hasty':'Hasty',
    'nature.Serious':'Serious','nature.Jolly':'Jolly','nature.Naive':'Naive',
    'nature.Modest':'Modest','nature.Mild':'Mild','nature.Quiet':'Quiet',
    'nature.Bashful':'Bashful','nature.Rash':'Rash','nature.Calm':'Calm',
    'nature.Gentle':'Gentle','nature.Sassy':'Sassy','nature.Careful':'Careful',
    'nature.Quirky':'Quirky',
    // Misc
    'label.neutral': 'Neutral', 'label.pctmax': '% max',
    'label.total': 'TOTAL', 'label.builda': 'BUILD A', 'label.buildb': 'BUILD B',
  },
  es: {
    'section.pokemon':    'POKÉMON',
    'section.basestats':  'ESTADÍSTICAS BASE',
    'section.nature':     'NATURALEZA',
    'section.ivs':        'IVS',
    'section.evs':        'EVS',
    'section.breakdown':  'DESGLOSE DE STATS',
    'section.formulas':   'FÓRMULAS DE STATS',
    'section.naturechart':'TABLA DE NATURALEZAS',
    'section.compare':    'COMPARAR BUILDS',
    'section.results':    'ESTADÍSTICAS CALCULADAS',
    'label.search':       'BUSCAR POKÉMON',
    'label.generation':   'GENERACIÓN',
    'label.level':        'NIVEL',
    'label.naturea':      'NATURALEZA A',
    'label.natureb':      'NATURALEZA B',
    'label.hpgen3':       'FÓRMULA PS (Gen III+)',
    'label.statgen3':     'FÓRMULA OTRAS STATS (Gen III+)',
    'label.hpgen1':       'FÓRMULA PS (Gen I y II)',
    'label.statgen1':     'FÓRMULA OTRAS STATS (Gen I y II)',
    'label.naturemult':   'MULTIPLICADORES DE NATURALEZA',
    'label.maxstat':      'STAT MÁXIMA POSIBLE (Nv 100, Gen III+)',
    'label.totalsum':     'SUMA TOTAL DE STATS',
    'btn.calculate':      '▶ CALCULAR STATS',
    'btn.compare':        '▶ COMPARAR',
    'nav.calc':           'CALC',
    'nav.formula':        'FÓRMULA',
    'nav.compare':        'COMPARAR',
    'info.formulas':      'Gen III–IX usa dos fórmulas según el tipo de estadística.',
    'info.gen12':         'En Gen I/II, los IVs se llaman DVs y tienen máximo 15. Los EVs son Exp. de Stat y tienen máximo 65535. La fórmula usa √(ExpStat).',
    'info.compare':       'Compara rápidamente dos distribuciones de EVs o naturalezas en el mismo Pokémon.',
    'chip.perfect':       'Perfectos (31)',
    'chip.zero':          'Cero (0)',
    'chip.gen12iv':       'Gen I/II (15)',
    'chip.hpower':        'Poder Oculto',
    'chip.clearall':      'Limpiar Todo',
    'chip.speedsweep':    '252/252 Vel.',
    'chip.phystank':      'Tanque Fís.',
    'chip.sptank':        'Tanque Esp.',
    'placeholder.search': 'Escribe nombre o # para filtrar…',
    'gen.1':              'Gen I (RBY)',
    'gen.2':              'Gen II (GSC)',
    'gen.3':              'Gen III–V',
    'gen.6':              'Gen VI+ (Actual)',
    'nature.nomods':      'sin cambio de stat',
    'status.loaded':      'cargado',
    'status.searching':   'CARGANDO…',
    'status.notfound':    'No encontrado',
    'status.offline':     'Sin conexión — datos del preset cargados',
    'status.fileerror':   'Error de carga — intenta servir por HTTP (no file://)',
    'status.allloaded':   'Pokémon cargados',
    // Nombres de estadísticas
    'stat.hp':    'PS',   'stat.atk':  'ATQ', 'stat.def':  'DEF',
    'stat.spatk': 'ATQ.ESP', 'stat.spdef':'DEF.ESP', 'stat.spd':  'VEL',
    'stat.hp.full':'PS',  'stat.atk.full':'Ataque', 'stat.def.full':'Defensa',
    'stat.spatk.full':'Atq. Esp.', 'stat.spdef.full':'Def. Esp.', 'stat.spd.full':'Velocidad',
    // Nombres de naturalezas
    'nature.Hardy':'Fuerte','nature.Lonely':'Solitaria','nature.Brave':'Audaz',
    'nature.Adamant':'Firme','nature.Naughty':'Pícara','nature.Bold':'Osada',
    'nature.Docile':'Dócil','nature.Relaxed':'Miedosa','nature.Impish':'Agresiva',
    'nature.Lax':'Floja','nature.Timid':'Tímida','nature.Hasty':'Activa',
    'nature.Serious':'Seria','nature.Jolly':'Alegre','nature.Naive':'Ingenua',
    'nature.Modest':'Modesta','nature.Mild':'Afable','nature.Quiet':'Tranquila',
    'nature.Bashful':'Tímida2','nature.Rash':'Alocada','nature.Calm':'Serena',
    'nature.Gentle':'Amable','nature.Sassy':'Atrevida','nature.Careful':'Cauta',
    'nature.Quirky':'Rara',
    // Miscelánea
    'label.neutral': 'Neutral', 'label.pctmax': '% máx',
    'label.total': 'TOTAL', 'label.builda': 'BUILD A', 'label.buildb': 'BUILD B',
  },
};

let currentLang = 'en';

function t(key) {
  return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key])
    || TRANSLATIONS['en'][key]
    || key;
}

// Translate a stat abbreviation key like 'ATK' → 'ATQ' in ES
function tStat(statKey) {
  const map = {'HP':'stat.hp','ATK':'stat.atk','DEF':'stat.def',
               'SP.ATK':'stat.spatk','SP.DEF':'stat.spdef','SPD':'stat.spd'};
  return t(map[statKey] || statKey);
}

// Translate a stat full name like 'Attack' → 'Ataque' in ES
function tStatFull(statKey) {
  const map = {'HP':'stat.hp.full','Attack':'stat.atk.full','Defense':'stat.def.full',
               'Sp. Atk':'stat.spatk.full','Sp. Def':'stat.spdef.full','Speed':'stat.spd.full'};
  return t(map[statKey] || statKey);
}

// Translate a nature name
function tNature(name) { return t('nature.' + name); }

function applyTranslations() {
  // Rebuild dynamic JS-generated content that contains translated strings
  if (typeof buildNatureGrid === 'function') buildNatureGrid();
  if (document.getElementById('full-nature-chart')?.innerHTML) buildNatureChart();
  // Rebuild compare nature dropdowns if already built
  const selA = document.getElementById('cmp-nature-a');
  if (selA?.innerHTML) {
    selA.innerHTML = '';
    const selB = document.getElementById('cmp-nature-b');
    selB.innerHTML = '';
    NATURES.forEach((n, i) => {
      selA.innerHTML += `<option value="${i}">${tNature(n.name)}</option>`;
      selB.innerHTML += `<option value="${i}">${tNature(n.name)}</option>`;
    });
  }
  // Rebuild IV/EV/base stat labels
  buildBaseStatsGrid();
  buildIVInputs();
  buildEVInputs();

  // Text content nodes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  // Placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  // Select option text
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (el.tagName === 'OPTION') el.textContent = t(el.dataset.i18n);
  });
  // Update nature display if already shown
  const natureBox = document.getElementById('selected-nature');
  if (natureBox && state !== undefined) {
    const n = NATURES[state.nature];
    const desc = n.up
      ? `${t('section.nature')}: <strong>${n.name}</strong> — <span style="color:#44ff44">+${n.up}</span> / <span style="color:#ff4444">-${n.down}</span>`
      : `${t('section.nature')}: <strong>${n.name}</strong> — ${t('nature.nomods')}`;
    natureBox.innerHTML = desc;
  }
  // Sync lang select value
  document.getElementById('lang-select').value = currentLang;
}

function setLang(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  localStorage.setItem('pokestats-lang', lang);
  applyTranslations();
}

function detectLang() {
  // 1. Check saved preference
  const saved = localStorage.getItem('pokestats-lang');
  if (saved && TRANSLATIONS[saved]) return saved;
  // 2. Detect from browser
  const browser = (navigator.language || navigator.userLanguage || 'en').toLowerCase().split('-')[0];
  return TRANSLATIONS[browser] ? browser : 'en';
}
