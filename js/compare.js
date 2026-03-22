// ─────────────────────────────────────────────────────
//  compare.js — Multi-Pokémon comparator (up to 4 slots)
//  Depends on: data.js, formulas.js, i18n.js
// ─────────────────────────────────────────────────────

function addCompareSlot() {
  if (compareSlots.length >= 4) return false;
  const name = document.getElementById('pokemon-name-display').textContent;
  const num  = parseInt(document.getElementById('pokedex-num').textContent.replace('#','')) || 0;
  const types = Array.from(document.querySelectorAll('#type-badges .type-badge'))
                     .map(b => b.textContent.toLowerCase());
  compareSlots.push({
    pokemon: name,
    num,
    types,
    bases:  [state.hp, ...state.bases],
    nature: state.nature,
    ivs:    [...state.ivs],
    evs:    [...state.evs],
    level:  state.level,
    gen:    state.gen,
  });
  return true;
}

function removeCompareSlot(index) {
  compareSlots.splice(index, 1);
  renderComparatorGrid();
}

function calculateSlot(slot) {
  const allStatKeys = ['HP', ...STATS];
  return allStatKeys.map((s, i) => {
    const value = i === 0
      ? calcHP(slot.bases[0], slot.ivs[0], slot.evs[0], slot.level, slot.gen)
      : calcStat(slot.bases[i], slot.ivs[i], slot.evs[i], slot.level, getNatureMult(slot.nature, s), slot.gen);
    return { name: s, value };
  });
}

function addCurrentToComparator() {
  if (compareSlots.length >= 4) {
    const statusEl = document.getElementById('cmp-add-status');
    if (statusEl) { statusEl.textContent = t('compare.maxslots'); setTimeout(() => { statusEl.textContent = ''; }, 2000); }
    return;
  }
  addCompareSlot();
  // Navigate to compare tab in pokemon mode
  const navCompare = document.querySelectorAll('.nav-item')[2];
  showPage('compare', navCompare);
  setCmpMode('pokemon');
}

function setCmpMode(mode) {
  const buildCard   = document.getElementById('cmp-build-card');
  const pokemonCard = document.getElementById('cmp-pokemon-card');
  const buildBtn    = document.getElementById('cmp-mode-build');
  const pokemonBtn  = document.getElementById('cmp-mode-pokemon');
  if (!buildCard || !pokemonCard) return;

  if (mode === 'build') {
    buildCard.style.display   = 'block';
    pokemonCard.style.display = 'none';
    buildBtn.classList.add('active');
    pokemonBtn.classList.remove('active');
  } else {
    buildCard.style.display   = 'none';
    pokemonCard.style.display = 'block';
    buildBtn.classList.remove('active');
    pokemonBtn.classList.add('active');
    renderComparatorGrid();
  }
}

function renderComparatorGrid() {
  const slotsEl = document.getElementById('cmp-slots');
  const gridEl  = document.getElementById('cmp-pokemon-grid');
  const addBtn  = document.getElementById('btn-add-pokemon');
  if (!slotsEl || !gridEl) return;

  if (addBtn) {
    addBtn.disabled      = compareSlots.length >= 4;
    addBtn.style.opacity = compareSlots.length >= 4 ? '0.5' : '1';
  }

  if (compareSlots.length === 0) {
    slotsEl.innerHTML = '';
    gridEl.innerHTML  = `<div class="saved-empty">${t('compare.empty')}</div>`;
    return;
  }

  // Slot header cards
  slotsEl.innerHTML = compareSlots.map((slot, i) => `
    <div class="cmp-slot-card">
      <div class="cmp-slot-info">
        <div class="cmp-slot-name">${slot.pokemon}</div>
        <div class="cmp-slot-sub">#${String(slot.num).padStart(3,'0')} · Lv ${slot.level} · ${tNature(NATURES[slot.nature]?.name || 'Hardy')}</div>
      </div>
      <button class="cmp-slot-remove" onclick="removeCompareSlot(${i})">✕</button>
    </div>
  `).join('');

  // Calculate all slots
  const allResults  = compareSlots.map(slot => calculateSlot(slot));
  const allStatKeys = ['HP', ...STATS];
  const cols        = compareSlots.length;

  let html = `<div class="cmp-grid" style="grid-template-columns:52px repeat(${cols},1fr)">`;

  // Header row — Pokémon names
  html += `<div class="cmp-cell cmp-head"></div>`;
  compareSlots.forEach(slot => {
    html += `<div class="cmp-cell cmp-head">${slot.pokemon}</div>`;
  });

  // Stat rows
  allStatKeys.forEach((s, si) => {
    const vals   = allResults.map(r => r[si].value);
    const maxVal = Math.max(...vals);
    html += `<div class="cmp-cell cmp-stat-label">${tStat(s)}</div>`;
    vals.forEach(v => {
      const win = v === maxVal && cols > 1;
      html += `<div class="cmp-cell cmp-stat-val${win ? ' cmp-winner' : ''}">${v}${win ? ' ★' : ''}</div>`;
    });
  });

  // BST row
  const totals   = allResults.map(r => r.reduce((a, b) => a + b.value, 0));
  const maxTotal = Math.max(...totals);
  html += `<div class="cmp-cell cmp-stat-label cmp-bst-label">BST</div>`;
  totals.forEach(v => {
    const win = v === maxTotal && cols > 1;
    html += `<div class="cmp-cell cmp-stat-val cmp-bst-val${win ? ' cmp-winner' : ''}">${v}${win ? ' ★' : ''}</div>`;
  });

  html += `</div>`;
  gridEl.innerHTML = html;
}
