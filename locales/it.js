// ─────────────────────────────────────────────────────
//  locales/it.js — Italian / Italiano
//  Missing keys fall back to English automatically.
// ─────────────────────────────────────────────────────
if (typeof registerLocale !== 'function') { throw new Error('i18n.js must load before locales/it.js'); }
registerLocale('it', {
  // ── Sections ──────────────────────────────────────
  'section.basestats':   'STATISTICHE BASE',
  'section.nature':      'NATURA',
  'section.breakdown':   'DETTAGLIO STATS',
  'section.formulas':    'FORMULE DELLE STATS',
  'section.naturechart': 'TABELLA NATURE',
  'section.compare':     'CONFRONTA BUILD',
  'section.results':     'STATISTICHE CALCOLATE',
  'section.saved':       'BUILD SALVATE',
  'summary.finalstats':  'STATS FINALI',
  'summary.evdist':      'Distribuzione EV',
  'compare.modebuild':   'EV / NATURA',
  'compare.modepokemon': 'MULTI POKÉMON',
  'compare.maxslots':    'Max 4 Pokémon',
  'compare.empty':       'Nessun Pokémon aggiunto. Clicca "+ AGGIUNGI" dopo aver calcolato.',

  // ── Labels ────────────────────────────────────────
  'label.search':      'CERCA POKÉMON',
  'label.generation':  'GENERAZIONE',
  'label.level':       'LIVELLO',
  'label.naturea':     'NATURA A',
  'label.natureb':     'NATURA B',
  'label.hpgen3':      'FORMULA PS (Gen III+)',
  'label.statgen3':    'ALTRE STATS (Gen III+)',
  'label.hpgen1':      'FORMULA PS (Gen I & II)',
  'label.statgen1':    'ALTRE STATS (Gen I & II)',
  'label.naturemult':  'MOLTIPLICATORI DI NATURA',
  'label.maxstat':     'STAT MASSIMA POSSIBILE (Lv 100, Gen III+)',
  'label.totalsum':    'SOMMA TOTALE STATS',
  'label.neutral':     'Neutro',
  'label.pctmax':      '% max',
  'label.total':       'TOTALE',

  // ── Buttons ───────────────────────────────────────
  'btn.calculate': '▶ CALCOLA STATS',
  'btn.compare':   '▶ CONFRONTA',
  'btn.save':        '⭐ SALVA BUILD',
  'btn.addcompare':  '+ AGGIUNGI AL CONFRONTO',
  'btn.addpokemon':  '+ AGGIUNGI POKÉMON ATTUALE',
  'btn.summary':     'RIEPILOGO',
  'btn.share':       '📤 CONDIVIDI',
  'btn.copytext':    '📋 COPIA TESTO',

  // ── Navigation ────────────────────────────────────
  'nav.formula': 'FORMULA',
  'nav.compare': 'CONFRONTA',
  'nav.saved':   'SALVATI',

  // ── Info boxes ────────────────────────────────────
  'info.formulas':  'Gen III–IX usa due formule a seconda del tipo di statistica.',
  'info.gen12':     'In Gen I/II, gli IVs si chiamano DVs (max 15). Gli EVs sono Esp. di Stat (max 65535). La formula usa √(EspStat).',
  'info.compare':   'Confronta rapidamente due distribuzioni di EVs o nature sullo stesso Pokémon.',
  'info.addcompare':'Calcola un Pokémon poi clicca "+ AGGIUNGI AL CONFRONTO". Fino a 4 slot.',

  // ── Quick-fill chips ──────────────────────────────
  'chip.perfect':    'Perfetti (31)',
  'chip.zero':       'Zero (0)',
  'chip.hpower':     'Mossa Segreta',
  'chip.clearall':   'Cancella Tutto',
  'chip.speedsweep': 'Velocità 252/252',
  'chip.phystank':   'Tank Fis.',
  'chip.sptank':     'Tank Sp.',

  // ── Placeholder ───────────────────────────────────
  'placeholder.search': 'Digita nome o # per filtrare…',

  // ── Generation selector ───────────────────────────
  'gen.6': 'Gen VI+ (Attuale)',

  // ── Saved builds ──────────────────────────────────
  'saved.empty':   'Nessuna build salvata. Premi ⭐ dopo aver calcolato.',
  'saved.load':    'CARICA',
  'saved.compare': 'CONFRONTA',
  'saved.delete':  'ELIMINA',
  'saved.noevs':   'Nessun EV',

  // ── Status messages ───────────────────────────────
  'nature.nomods':    'nessuna variazione di stat',
  'status.loaded':    'caricato',
  'status.searching': 'CARICAMENTO…',
  'status.notfound':  'Non trovato',
  'status.offline':   'Offline — dati preset caricati',
  'status.fileerror': 'Caricamento fallito — usa HTTP (non file://)',
  'status.allloaded': 'Pokémon caricati',

  // ── Stat abbreviations ────────────────────────────
  'stat.hp':         'PS',
  'stat.atk':        'ATT',
  'stat.def':        'DIF',
  'stat.spatk':      'ATT.SP',
  'stat.spdef':      'DIF.SP',
  'stat.spd':        'VEL',
  'stat.hp.full':    'PS',
  'stat.atk.full':   'Attacco',
  'stat.def.full':   'Difesa',
  'stat.spatk.full': 'Att. Sp.',
  'stat.spdef.full': 'Dif. Sp.',
  'stat.spd.full':   'Velocità',

  // ── Nature names ──────────────────────────────────
  'nature.Hardy':   'Ardita',    'nature.Lonely':  'Solitaria',
  'nature.Brave':   'Audace',    'nature.Adamant': 'Dura',
  'nature.Naughty': 'Birichina', 'nature.Bold':    'Sicura',
  'nature.Docile':  'Docile',    'nature.Relaxed': 'Rilassata',
  'nature.Impish':  'Maliziosa', 'nature.Lax':     'Pigra',
  'nature.Timid':   'Timida',    'nature.Hasty':   'Lesta',
  'nature.Serious': 'Seria',     'nature.Jolly':   'Gioiosa',
  'nature.Naive':   'Ingenua',   'nature.Modest':  'Modesta',
  'nature.Mild':    'Mite',      'nature.Quiet':   'Quieta',
  'nature.Bashful': 'Schiva',    'nature.Rash':    'Temeraria',
  'nature.Calm':    'Calma',     'nature.Gentle':  'Gentile',
  'nature.Sassy':   'Sfacciata', 'nature.Careful': 'Cauta',
  'nature.Quirky':  'Strana',
});
