// ─────────────────────────────────────────────────────
//  locales/en.js — English translations
//  Registered automatically by i18n.js on load.
//  This is the fallback language — all keys must be defined here.
// ─────────────────────────────────────────────────────
if (typeof registerLocale !== 'function') { throw new Error('i18n.js must load before locales/en.js'); }
registerLocale('en', {
  // ── Sections ──────────────────────────────────────
  'section.pokemon':     'POKÉMON',
  'section.basestats':   'BASE STATS',
  'section.nature':      'NATURE',
  'section.ivs':         'IVS',
  'section.evs':         'EVS',
  'section.breakdown':   'STAT BREAKDOWN',
  'section.formulas':    'STAT FORMULAS',
  'section.naturechart': 'NATURE CHART',
  'section.compare':     'COMPARE BUILDS',
  'section.results':     'CALCULATED STATS',

  // ── Labels ────────────────────────────────────────
  'label.search':      'SEARCH POKÉMON',
  'label.generation':  'GENERATION',
  'label.level':       'LEVEL',
  'label.naturea':     'NATURE A',
  'label.natureb':     'NATURE B',
  'label.hpgen3':      'HP FORMULA (Gen III+)',
  'label.statgen3':    'OTHER STATS FORMULA (Gen III+)',
  'label.hpgen1':      'HP FORMULA (Gen I & II)',
  'label.statgen1':    'OTHER STATS FORMULA (Gen I & II)',
  'label.naturemult':  'NATURE MULTIPLIERS',
  'label.maxstat':     'MAX POSSIBLE STAT (Lv 100, Gen III+)',
  'label.totalsum':    'TOTAL STAT SUM',
  'label.neutral':     'Neutral',
  'label.pctmax':      '% max',
  'label.total':       'TOTAL',
  'label.builda':      'BUILD A',
  'label.buildb':      'BUILD B',

  // ── Buttons ───────────────────────────────────────
  'btn.calculate': '▶ CALCULATE STATS',
  'btn.compare':   '▶ COMPARE',

  // ── Navigation ────────────────────────────────────
  'nav.calc':    'CALC',
  'nav.formula': 'FORMULA',
  'nav.compare': 'COMPARE',

  // ── Info boxes ────────────────────────────────────
  'info.formulas': 'Gen III–IX uses two formulas depending on the stat type.',
  'info.gen12':    'In Gen I/II, IVs are called DVs and max at 15. EVs are Stat Exp and max at 65535. The formula uses √(StatExp).',
  'info.compare':  'Quickly compare two different EV spreads or natures on the same Pokémon.',

  // ── Quick-fill chips ──────────────────────────────
  'chip.perfect':    'Perfect (31)',
  'chip.zero':       'Zero (0)',
  'chip.gen12iv':    'Gen I/II (15)',
  'chip.hpower':     'Hidden Power',
  'chip.clearall':   'Clear All',
  'chip.speedsweep': 'SpeedSweep',
  'chip.phystank':   'PhysTank',
  'chip.sptank':     'SpTank',

  // ── Placeholder ───────────────────────────────────
  'placeholder.search': 'Type name or # to filter…',

  // ── Generation selector ───────────────────────────
  'gen.1': 'Gen I (RBY)',
  'gen.2': 'Gen II (GSC)',
  'gen.3': 'Gen III–V',
  'gen.6': 'Gen VI+ (Current)',

  // ── Status messages ───────────────────────────────
  'nature.nomods':       'no stat change',
  'status.loaded':       'loaded',
  'status.searching':    'LOADING…',
  'status.notfound':     'Not found',
  'status.offline':      'Offline — loaded preset data',
  'status.fileerror':    'Fetch failed — try serving over HTTP (not file://)',
  'status.allloaded':    'Pokémon loaded',

  // ── Stat abbreviations ────────────────────────────
  'stat.hp':         'HP',
  'stat.atk':        'ATK',
  'stat.def':        'DEF',
  'stat.spatk':      'SP.ATK',
  'stat.spdef':      'SP.DEF',
  'stat.spd':        'SPD',
  'stat.hp.full':    'HP',
  'stat.atk.full':   'Attack',
  'stat.def.full':   'Defense',
  'stat.spatk.full': 'Sp. Atk',
  'stat.spdef.full': 'Sp. Def',
  'stat.spd.full':   'Speed',

  // ── Nature names ──────────────────────────────────
  'nature.Hardy':   'Hardy',   'nature.Lonely':  'Lonely',
  'nature.Brave':   'Brave',   'nature.Adamant': 'Adamant',
  'nature.Naughty': 'Naughty', 'nature.Bold':    'Bold',
  'nature.Docile':  'Docile',  'nature.Relaxed': 'Relaxed',
  'nature.Impish':  'Impish',  'nature.Lax':     'Lax',
  'nature.Timid':   'Timid',   'nature.Hasty':   'Hasty',
  'nature.Serious': 'Serious', 'nature.Jolly':   'Jolly',
  'nature.Naive':   'Naive',   'nature.Modest':  'Modest',
  'nature.Mild':    'Mild',    'nature.Quiet':   'Quiet',
  'nature.Bashful': 'Bashful', 'nature.Rash':    'Rash',
  'nature.Calm':    'Calm',    'nature.Gentle':  'Gentle',
  'nature.Sassy':   'Sassy',   'nature.Careful': 'Careful',
  'nature.Quirky':  'Quirky',
});
