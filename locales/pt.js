// ─────────────────────────────────────────────────────
//  locales/pt.js — Portuguese / Português (Brasil)
//  Missing keys fall back to English automatically.
// ─────────────────────────────────────────────────────
if (typeof registerLocale !== 'function') { throw new Error('i18n.js must load before locales/pt.js'); }
registerLocale('pt', {
  // ── Sections ──────────────────────────────────────
  'section.basestats':   'ESTATÍSTICAS BASE',
  'section.nature':      'NATUREZA',
  'section.breakdown':   'DETALHAMENTO DE STATS',
  'section.formulas':    'FÓRMULAS DE STATS',
  'section.naturechart': 'TABELA DE NATUREZAS',
  'section.compare':     'COMPARAR BUILDS',
  'section.results':     'ESTATÍSTICAS CALCULADAS',
  'section.saved':       'BUILDS SALVAS',
  'summary.finalstats':  'STATS FINAIS',
  'summary.evdist':      'Distribuição de EVs',
  'compare.maxslots':    'Máximo 4 Pokémon',
  'compare.empty':       'Sem Pokémon adicionados. Clique "+ ADICIONAR" após calcular.',

  // ── Labels ────────────────────────────────────────
  'label.search':      'BUSCAR POKÉMON',
  'label.generation':  'GERAÇÃO',
  'label.level':       'NÍVEL',
  'label.naturea':     'NATUREZA A',
  'label.natureb':     'NATUREZA B',
  'label.hpgen3':      'FÓRMULA PS (Gen III+)',
  'label.statgen3':    'OUTRAS STATS (Gen III+)',
  'label.hpgen1':      'FÓRMULA PS (Gen I e II)',
  'label.statgen1':    'OUTRAS STATS (Gen I e II)',
  'label.naturemult':  'MULTIPLICADORES DE NATUREZA',
  'label.maxstat':     'STAT MÁXIMA POSSÍVEL (Nv 100, Gen III+)',
  'label.totalsum':    'SOMA TOTAL DE STATS',
  'label.neutral':     'Neutro',
  'label.pctmax':      '% máx',
  'label.total':       'TOTAL',

  // ── Buttons ───────────────────────────────────────
  'btn.calculate': '▶ CALCULAR STATS',
  'btn.compare':   '▶ COMPARAR',
  'btn.save':        '⭐ SALVAR BUILD',
  'btn.addcompare':  '+ ADICIONAR À COMPARAÇÃO',
  'btn.addpokemon':  '+ ADICIONAR POKÉMON ATUAL',
  'btn.summary':     'RESUMO',
  'btn.share':       '📤 COMPARTILHAR',
  'btn.copytext':    '📋 COPIAR TEXTO',

  // ── Navigation ────────────────────────────────────
  'nav.formula': 'FÓRMULA',
  'nav.compare': 'COMPARAR',
  'nav.saved':   'SALVOS',

  // ── Info boxes ────────────────────────────────────
  'info.formulas':  'Gen III–IX usa duas fórmulas dependendo do tipo de estatística.',
  'info.gen12':     'Em Gen I/II, os IVs são chamados DVs e têm máximo 15. EVs são Exp. de Stat com máximo 65535. A fórmula usa √(ExpStat).',
  'info.compare':   'Compare rapidamente duas distribuições de EVs ou naturezas no mesmo Pokémon.',
  'info.addcompare':'Calcule um Pokémon e clique "+ ADICIONAR À COMPARAÇÃO". Até 4 slots.',

  // ── Quick-fill chips ──────────────────────────────
  'chip.perfect':    'Perfeitos (31)',
  'chip.zero':       'Zero (0)',
  'chip.hpower':     'Poder Oculto',
  'chip.clearall':   'Limpar Tudo',
  'chip.speedsweep': 'Velocidade 252/252',
  'chip.phystank':   'Tank Fís.',
  'chip.sptank':     'Tank Esp.',

  // ── Placeholder ───────────────────────────────────
  'placeholder.search': 'Digite nome ou # para filtrar…',

  // ── Generation selector ───────────────────────────
  'gen.6': 'Gen VI+ (Atual)',

  // ── Saved builds ──────────────────────────────────
  'saved.empty':   'Nenhuma build salva. Pressione ⭐ após calcular.',
  'saved.load':    'CARREGAR',
  'saved.compare': 'COMPARAR',
  'saved.delete':  'EXCLUIR',
  'saved.noevs':   'Sem EVs',

  // ── Status messages ───────────────────────────────
  'nature.nomods':    'sem mudança de stat',
  'status.loaded':    'carregado',
  'status.searching': 'CARREGANDO…',
  'status.notfound':  'Não encontrado',
  'status.offline':   'Sem conexão — dados do preset carregados',
  'status.fileerror': 'Falha ao carregar — use HTTP (não file://)',
  'status.allloaded': 'Pokémon carregados',

  // ── Stat abbreviations ────────────────────────────
  'stat.hp':         'PS',
  'stat.atk':        'ATQ',
  'stat.def':        'DEF',
  'stat.spatk':      'ATQ.ESP',
  'stat.spdef':      'DEF.ESP',
  'stat.spd':        'VEL',
  'stat.hp.full':    'PS',
  'stat.atk.full':   'Ataque',
  'stat.def.full':   'Defesa',
  'stat.spatk.full': 'Atq. Esp.',
  'stat.spdef.full': 'Def. Esp.',
  'stat.spd.full':   'Velocidade',

  // ── Nature names ──────────────────────────────────
  'nature.Hardy':   'Rigorosa',  'nature.Lonely':  'Solitária',
  'nature.Brave':   'Audaz',     'nature.Adamant': 'Adamante',
  'nature.Naughty': 'Velhaca',   'nature.Bold':    'Ousada',
  'nature.Docile':  'Dócil',     'nature.Relaxed': 'Relaxada',
  'nature.Impish':  'Travessa',  'nature.Lax':     'Negligente',
  'nature.Timid':   'Tímida',    'nature.Hasty':   'Apressada',
  'nature.Serious': 'Séria',     'nature.Jolly':   'Alegre',
  'nature.Naive':   'Ingênua',   'nature.Modest':  'Modesta',
  'nature.Mild':    'Amena',     'nature.Quiet':   'Quieta',
  'nature.Bashful': 'Acanhada',  'nature.Rash':    'Impulsiva',
  'nature.Calm':    'Calma',     'nature.Gentle':  'Gentil',
  'nature.Sassy':   'Atrevida',  'nature.Careful': 'Cautelosa',
  'nature.Quirky':  'Estranha',
});
