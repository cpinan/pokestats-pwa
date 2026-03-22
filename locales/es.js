// ─────────────────────────────────────────────────────
//  locales/es.js — Spanish (Español) translations
//  Registered automatically by i18n.js on load.
//  Missing keys fall back to English automatically.
// ─────────────────────────────────────────────────────
if (typeof registerLocale !== 'function') { throw new Error('i18n.js must load before locales/es.js'); }
registerLocale('es', {
  // ── Sections ──────────────────────────────────────
  'section.pokemon':     'POKÉMON',
  'section.basestats':   'ESTADÍSTICAS BASE',
  'section.nature':      'NATURALEZA',
  'section.ivs':         'IVS',
  'section.evs':         'EVS',
  'section.breakdown':   'DESGLOSE DE STATS',
  'section.formulas':    'FÓRMULAS DE STATS',
  'section.naturechart': 'TABLA DE NATURALEZAS',
  'section.compare':     'COMPARAR BUILDS',
  'section.results':     'ESTADÍSTICAS CALCULADAS',
  'section.saved':       'BUILDS GUARDADOS',
  'compare.modebuild':   'BUILD A vs B',
  'compare.modepokemon': 'POKÉMON vs POKÉMON',
  'compare.maxslots':    'Máximo 4 Pokémon',
  'compare.empty':       'Sin Pokémon agregados. Pulsa "+ AGREGAR A COMPARAR" tras calcular.',

  // ── Labels ────────────────────────────────────────
  'label.search':      'BUSCAR POKÉMON',
  'label.generation':  'GENERACIÓN',
  'label.level':       'NIVEL',
  'label.naturea':     'NATURALEZA A',
  'label.natureb':     'NATURALEZA B',
  'label.hpgen3':      'FÓRMULA PS (Gen III+)',
  'label.statgen3':    'FÓRMULA OTRAS STATS (Gen III+)',
  'label.hpgen1':      'FÓRMULA PS (Gen I y II)',
  'label.statgen1':    'FÓRMULA OTRAS STATS (Gen I y II)',
  'label.naturemult':  'MULTIPLICADORES DE NATURALEZA',
  'label.maxstat':     'STAT MÁXIMA POSIBLE (Nv 100, Gen III+)',
  'label.totalsum':    'SUMA TOTAL DE STATS',
  'label.neutral':     'Neutral',
  'label.pctmax':      '% máx',
  'label.total':       'TOTAL',
  'label.builda':      'BUILD A',
  'label.buildb':      'BUILD B',

  // ── Buttons ───────────────────────────────────────
  'btn.calculate': '▶ CALCULAR STATS',
  'btn.compare':   '▶ COMPARAR',
  'btn.save':        '⭐ GUARDAR BUILD',
  'btn.addcompare':  '+ AGREGAR A COMPARAR',
  'btn.addpokemon':  '+ AGREGAR POKÉMON ACTUAL',

  // ── Navigation ────────────────────────────────────
  'nav.calc':    'CALC',
  'nav.formula': 'FÓRMULA',
  'nav.compare': 'COMPARAR',
  'nav.saved':   'GUARDADOS',

  // ── Info boxes ────────────────────────────────────
  'info.formulas': 'Gen III–IX usa dos fórmulas según el tipo de estadística.',
  'info.gen12':    'En Gen I/II, los IVs se llaman DVs y tienen máximo 15. Los EVs son Exp. de Stat y tienen máximo 65535. La fórmula usa √(ExpStat).',
  'info.compare':   'Compara rápidamente dos distribuciones de EVs o naturalezas en el mismo Pokémon.',
  'info.addcompare':'Calcula un Pokémon y pulsa "+ AGREGAR A COMPARAR" para añadirlo. Hasta 4 slots.',

  // ── Quick-fill chips ──────────────────────────────
  'chip.perfect':    'Perfectos (31)',
  'chip.zero':       'Cero (0)',
  'chip.gen12iv':    'Gen I/II (15)',
  'chip.hpower':     'Poder Oculto',
  'chip.clearall':   'Limpiar Todo',
  'chip.speedsweep': '252/252 Vel.',
  'chip.phystank':   'Tanque Fís.',
  'chip.sptank':     'Tanque Esp.',

  // ── Placeholder ───────────────────────────────────
  'placeholder.search': 'Escribe nombre o # para filtrar…',

  // ── Generation selector ───────────────────────────
  'gen.1': 'Gen I (RBY)',
  'gen.2': 'Gen II (GSC)',
  'gen.3': 'Gen III–V',
  'gen.6': 'Gen VI+ (Actual)',

  // ── Saved builds ──────────────────────────────────
  'saved.empty':  'Ninguna build guardada. Pulsa ⭐ tras calcular.',
  'saved.load':    'CARGAR',
  'saved.compare': 'COMPARAR',
  'saved.delete':  'ELIMINAR',
  'saved.noevs':  'Sin EVs',

  // ── Status messages ───────────────────────────────
  'nature.nomods':    'sin cambio de stat',
  'status.loaded':    'cargado',
  'status.searching': 'CARGANDO…',
  'status.notfound':  'No encontrado',
  'status.offline':   'Sin conexión — datos del preset cargados',
  'status.fileerror': 'Error de carga — intenta servir por HTTP (no file://)',
  'status.allloaded': 'Pokémon cargados',

  // ── Stat abbreviations ────────────────────────────
  'stat.hp':         'PS',
  'stat.atk':        'ATQ',
  'stat.def':        'DEF',
  'stat.spatk':      'ATQ.ESP',
  'stat.spdef':      'DEF.ESP',
  'stat.spd':        'VEL',
  'stat.hp.full':    'PS',
  'stat.atk.full':   'Ataque',
  'stat.def.full':   'Defensa',
  'stat.spatk.full': 'Atq. Esp.',
  'stat.spdef.full': 'Def. Esp.',
  'stat.spd.full':   'Velocidad',

  // ── Nature names ──────────────────────────────────
  'nature.Hardy':   'Fuerte',    'nature.Lonely':  'Solitaria',
  'nature.Brave':   'Audaz',     'nature.Adamant': 'Firme',
  'nature.Naughty': 'Pícara',    'nature.Bold':    'Osada',
  'nature.Docile':  'Dócil',     'nature.Relaxed': 'Miedosa',
  'nature.Impish':  'Agresiva',  'nature.Lax':     'Floja',
  'nature.Timid':   'Tímida',    'nature.Hasty':   'Activa',
  'nature.Serious': 'Seria',     'nature.Jolly':   'Alegre',
  'nature.Naive':   'Ingenua',   'nature.Modest':  'Modesta',
  'nature.Mild':    'Afable',    'nature.Quiet':   'Tranquila',
  'nature.Bashful': 'Tímida2',   'nature.Rash':    'Alocada',
  'nature.Calm':    'Serena',    'nature.Gentle':  'Amable',
  'nature.Sassy':   'Atrevida',  'nature.Careful': 'Cauta',
  'nature.Quirky':  'Rara',
});
