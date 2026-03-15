// ─────────────────────────────────────────────────────
//  formulas.js — Pokémon stat calculation formulas (Gen I–IX)
//  No dependencies.
// ─────────────────────────────────────────────────────

function calcHP(base, iv, ev, level, gen) {
  if (base === 1) return 1; // Shedinja
  if (gen <= 2) {
    const statExp = Math.min(ev, 65535);
    return Math.floor(((base + iv) * 2 + Math.floor(Math.sqrt(statExp))) * level / 100) + level + 10;
  }
  return Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + level + 10;
}

function calcStat(base, iv, ev, level, natureMult, gen) {
  if (gen <= 2) {
    const statExp = Math.min(ev, 65535);
    return Math.floor(((base + iv) * 2 + Math.floor(Math.sqrt(statExp))) * level / 100) + 5;
  }
  return Math.floor((Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100) + 5) * natureMult);
}

function getNatureMult(natureIdx, statKey) {
  const n = NATURES[natureIdx];
  if (n.up === statKey) return 1.1;
  if (n.down === statKey) return 0.9;
  return 1.0;
}

function getMaxStat(statKey, level, gen) {
  // Max possible: base 255, IV 31, EV 252, boosted nature
  const iv = gen <= 2 ? 15 : 31;
  const ev = gen <= 2 ? 65535 : 252;
  const mult = 1.1;
  if (statKey === 'HP') return calcHP(255, iv, ev, level, gen);
  return calcStat(255, iv, ev, level, mult, gen);
}
