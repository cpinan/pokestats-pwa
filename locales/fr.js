// ─────────────────────────────────────────────────────
//  locales/fr.js — French / Français
//  Missing keys fall back to English automatically.
// ─────────────────────────────────────────────────────
if (typeof registerLocale !== 'function') { throw new Error('i18n.js must load before locales/fr.js'); }
registerLocale('fr', {
  // ── Sections ──────────────────────────────────────
  'section.basestats':   'STATISTIQUES DE BASE',
  'section.nature':      'NATURE',
  'section.breakdown':   'DÉTAIL DES STATS',
  'section.formulas':    'FORMULES DE STATS',
  'section.naturechart': 'TABLE DES NATURES',
  'section.compare':     'COMPARER LES BUILDS',
  'section.results':     'STATISTIQUES CALCULÉES',
  'section.saved':       'BUILDS SAUVEGARDÉS',
  'summary.finalstats':  'STATS FINALES',
  'summary.evdist':      'Répartition des EVs',
  'compare.maxslots':    'Max 4 Pokémon',
  'compare.empty':       'Aucun Pokémon ajouté. Cliquez "+ AJOUTER" après avoir calculé.',

  // ── Labels ────────────────────────────────────────
  'label.search':      'CHERCHER UN POKÉMON',
  'label.generation':  'GÉNÉRATION',
  'label.level':       'NIVEAU',
  'label.naturea':     'NATURE A',
  'label.natureb':     'NATURE B',
  'label.hpgen3':      'FORMULE PV (Gen III+)',
  'label.statgen3':    'AUTRES STATS (Gen III+)',
  'label.hpgen1':      'FORMULE PV (Gen I & II)',
  'label.statgen1':    'AUTRES STATS (Gen I & II)',
  'label.naturemult':  'MULTIPLICATEURS DE NATURE',
  'label.maxstat':     'STAT MAX POSSIBLE (Nv 100, Gen III+)',
  'label.totalsum':    'TOTAL DES STATS',
  'label.neutral':     'Neutre',
  'label.pctmax':      '% max',
  'label.total':       'TOTAL',

  // ── Buttons ───────────────────────────────────────
  'btn.calculate': '▶ CALCULER LES STATS',
  'btn.compare':   '▶ COMPARER',
  'btn.save':        '⭐ SAUVEGARDER',
  'btn.addcompare':  '+ AJOUTER À LA COMPARAISON',
  'btn.addpokemon':  '+ AJOUTER LE POKÉMON ACTUEL',
  'btn.summary':     'RÉSUMÉ',
  'btn.share':       '📤 PARTAGER',
  'btn.copytext':    '📋 COPIER LE TEXTE',

  // ── Navigation ────────────────────────────────────
  'nav.formula': 'FORMULE',
  'nav.compare': 'COMPARER',
  'nav.saved':   'SAUVÉS',

  // ── Info boxes ────────────────────────────────────
  'info.formulas':  'Gen III–IX utilise deux formules selon le type de statistique.',
  'info.gen12':     'En Gen I/II, les IVs sont appelés DVs et ont un max de 15. Les EVs sont des Exp. de Stat avec un max de 65535. La formule utilise √(ExpStat).',
  'info.compare':   'Comparez rapidement deux distributions d\'EVs ou natures sur le même Pokémon.',
  'info.addcompare':'Calculez un Pokémon puis cliquez "+ AJOUTER À LA COMPARAISON". Jusqu\'à 4 slots.',

  // ── Quick-fill chips ──────────────────────────────
  'chip.perfect':    'Parfaits (31)',
  'chip.zero':       'Zéro (0)',
  'chip.hpower':     'Puissance Cachée',
  'chip.clearall':   'Tout Effacer',
  'chip.speedsweep': 'Vitesse 252/252',
  'chip.phystank':   'Tank Phys.',
  'chip.sptank':     'Tank Spé.',

  // ── Placeholder ───────────────────────────────────
  'placeholder.search': 'Tapez nom ou # pour filtrer…',

  // ── Generation selector ───────────────────────────
  'gen.6': 'Gen VI+ (Actuel)',

  // ── Saved builds ──────────────────────────────────
  'saved.empty':   'Aucun build sauvegardé. Appuyez ⭐ après avoir calculé.',
  'saved.load':    'CHARGER',
  'saved.compare': 'COMPARER',
  'saved.delete':  'SUPPRIMER',
  'saved.noevs':   'Pas d\'EVs',

  // ── Status messages ───────────────────────────────
  'nature.nomods':    'aucune modification de stat',
  'status.loaded':    'chargé',
  'status.searching': 'CHARGEMENT…',
  'status.notfound':  'Introuvable',
  'status.offline':   'Hors ligne — données du preset chargées',
  'status.fileerror': 'Échec — servez via HTTP (pas file://)',
  'status.allloaded': 'Pokémon chargés',

  // ── Stat abbreviations ────────────────────────────
  'stat.hp':         'PV',
  'stat.atk':        'ATQ',
  'stat.def':        'DÉF',
  'stat.spatk':      'ATQ.SPÉ',
  'stat.spdef':      'DÉF.SPÉ',
  'stat.spd':        'VIT',
  'stat.hp.full':    'PV',
  'stat.atk.full':   'Attaque',
  'stat.def.full':   'Défense',
  'stat.spatk.full': 'Atq. Spé.',
  'stat.spdef.full': 'Déf. Spé.',
  'stat.spd.full':   'Vitesse',

  // ── Nature names ──────────────────────────────────
  'nature.Hardy':   'Hardi',      'nature.Lonely':  'Solitaire',
  'nature.Brave':   'Brave',      'nature.Adamant': 'Rigide',
  'nature.Naughty': 'Mauvais',    'nature.Bold':    'Audacieux',
  'nature.Docile':  'Docile',     'nature.Relaxed': 'Relax',
  'nature.Impish':  'Malin',      'nature.Lax':     'Lâche',
  'nature.Timid':   'Timide',     'nature.Hasty':   'Pressé',
  'nature.Serious': 'Sérieux',    'nature.Jolly':   'Jovial',
  'nature.Naive':   'Naïf',       'nature.Modest':  'Modeste',
  'nature.Mild':    'Doux',       'nature.Quiet':   'Calme',
  'nature.Bashful': 'Pudique',    'nature.Rash':    'Foufou',
  'nature.Calm':    'Tranquille', 'nature.Gentle':  'Gentil',
  'nature.Sassy':   'Effronté',   'nature.Careful': 'Prudent',
  'nature.Quirky':  'Bizarre',
});
