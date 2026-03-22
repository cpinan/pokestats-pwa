// ─────────────────────────────────────────────────────
//  locales/de.js — German / Deutsch
//  Missing keys fall back to English automatically.
// ─────────────────────────────────────────────────────
if (typeof registerLocale !== 'function') { throw new Error('i18n.js must load before locales/de.js'); }
registerLocale('de', {
  // ── Sections ──────────────────────────────────────
  'section.basestats':   'BASIS-STATUSWERTE',
  'section.nature':      'WESEN',
  'section.breakdown':   'STATS-AUFSCHLÜSSELUNG',
  'section.formulas':    'STATS-FORMELN',
  'section.naturechart': 'WESENTABELLE',
  'section.compare':     'BUILDS VERGLEICHEN',
  'section.results':     'BERECHNETE STATS',
  'section.saved':       'GESPEICHERTE BUILDS',
  'summary.finalstats':  'ENDGÜLTIGE STATS',
  'summary.evdist':      'EV-Verteilung',
  'compare.modebuild':   'EV / WESEN',
  'compare.modepokemon': 'MULTI POKÉMON',
  'compare.maxslots':    'Max. 4 Pokémon',
  'compare.empty':       'Kein Pokémon hinzugefügt. "+ HINZUFÜGEN" nach dem Berechnen klicken.',

  // ── Labels ────────────────────────────────────────
  'label.search':      'POKÉMON SUCHEN',
  'label.generation':  'GENERATION',
  'label.naturea':     'WESEN A',
  'label.natureb':     'WESEN B',
  'label.hpgen3':      'KP-FORMEL (Gen III+)',
  'label.statgen3':    'ANDERE STATS (Gen III+)',
  'label.hpgen1':      'KP-FORMEL (Gen I & II)',
  'label.statgen1':    'ANDERE STATS (Gen I & II)',
  'label.naturemult':  'WESEN-MULTIPLIKATOREN',
  'label.maxstat':     'MAX. STATUSWERT (Lv 100, Gen III+)',
  'label.totalsum':    'STATUSWERT-SUMME',
  'label.neutral':     'Neutral',
  'label.pctmax':      '% Max',
  'label.total':       'GESAMT',

  // ── Buttons ───────────────────────────────────────
  'btn.calculate': '▶ STATS BERECHNEN',
  'btn.compare':   '▶ VERGLEICHEN',
  'btn.save':        '⭐ BUILD SPEICHERN',
  'btn.addcompare':  '+ ZUM VERGLEICH HINZUFÜGEN',
  'btn.addpokemon':  '+ AKT. POKÉMON HINZUFÜGEN',
  'btn.summary':     'ZUSAMMENFASSUNG',
  'btn.share':       '📤 TEILEN',
  'btn.copytext':    '📋 TEXT KOPIEREN',

  // ── Navigation ────────────────────────────────────
  'nav.formula': 'FORMEL',
  'nav.compare': 'VERGLEICH',
  'nav.saved':   'GESPEICHERT',

  // ── Info boxes ────────────────────────────────────
  'info.formulas':  'Gen III–IX verwendet zwei Formeln je nach Statuswert-Typ.',
  'info.gen12':     'In Gen I/II heißen IVs DVs (max. 15). EVs sind Stat-Erfahrung (max. 65535). Die Formel verwendet √(StatExp).',
  'info.compare':   'Vergleiche schnell zwei EV-Verteilungen oder Wesen beim gleichen Pokémon.',
  'info.addcompare':'Berechne ein Pokémon und klicke "+ ZUM VERGLEICH HINZUFÜGEN". Bis zu 4 Slots.',

  // ── Quick-fill chips ──────────────────────────────
  'chip.perfect':    'Perfekt (31)',
  'chip.zero':       'Null (0)',
  'chip.hpower':     'Versteckte Kraft',
  'chip.clearall':   'Alles löschen',
  'chip.speedsweep': 'Speed-Sweep',
  'chip.phystank':   'Phys. Tank',
  'chip.sptank':     'Sp. Tank',

  // ── Placeholder ───────────────────────────────────
  'placeholder.search': 'Name oder # eingeben…',

  // ── Generation selector ───────────────────────────
  'gen.6': 'Gen VI+ (Aktuell)',

  // ── Saved builds ──────────────────────────────────
  'saved.empty':   'Keine gespeicherten Builds. Nach dem Berechnen ⭐ drücken.',
  'saved.load':    'LADEN',
  'saved.compare': 'VERGLEICHEN',
  'saved.delete':  'LÖSCHEN',
  'saved.noevs':   'Keine EVs',

  // ── Status messages ───────────────────────────────
  'nature.nomods':    'kein Statuswert-Bonus',
  'status.loaded':    'geladen',
  'status.searching': 'LADEN…',
  'status.notfound':  'Nicht gefunden',
  'status.offline':   'Offline — Preset-Daten geladen',
  'status.fileerror': 'Ladefehler — über HTTP bereitstellen (nicht file://)',
  'status.allloaded': 'Pokémon geladen',

  // ── Stat abbreviations ────────────────────────────
  'stat.hp':         'KP',
  'stat.atk':        'ANG',
  'stat.def':        'VTD',
  'stat.spatk':      'SP.ANG',
  'stat.spdef':      'SP.VTD',
  'stat.spd':        'INIT',
  'stat.hp.full':    'KP',
  'stat.atk.full':   'Angriff',
  'stat.def.full':   'Verteidigung',
  'stat.spatk.full': 'Sp. Ang.',
  'stat.spdef.full': 'Sp. Vtd.',
  'stat.spd.full':   'Initiative',

  // ── Nature names ──────────────────────────────────
  'nature.Hardy':   'Robust',  'nature.Lonely':  'Solo',
  'nature.Brave':   'Kühn',    'nature.Adamant': 'Hart',
  'nature.Naughty': 'Frech',   'nature.Bold':    'Dreist',
  'nature.Docile':  'Sanft',   'nature.Relaxed': 'Locker',
  'nature.Impish':  'Pfiffig', 'nature.Lax':     'Lasch',
  'nature.Timid':   'Hastig',  'nature.Hasty':   'Hitzig',
  'nature.Serious': 'Ernst',   'nature.Jolly':   'Froh',
  'nature.Naive':   'Naiv',    'nature.Modest':  'Mäßig',
  'nature.Mild':    'Mild',    'nature.Quiet':   'Ruhig',
  'nature.Bashful': 'Scheu',   'nature.Rash':    'Wirsch',
  'nature.Calm':    'Still',   'nature.Gentle':  'Zart',
  'nature.Sassy':   'Keck',    'nature.Careful': 'Sacht',
  'nature.Quirky':  'Kauzig',
});
