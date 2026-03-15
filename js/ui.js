// ─────────────────────────────────────────────────────
//  ui.js — DOM builders for base stats, nature grid, IV/EV sliders
//  Depends on: data.js, i18n.js, formulas.js
// ─────────────────────────────────────────────────────

function buildBaseStatsGrid() {
  const container = document.getElementById('base-stats-grid');
  container.innerHTML = '';
  STATS.forEach((s, i) => {
    const row = document.createElement('div');
    row.className = 'stat-section';
    row.style.marginTop = '8px';
    row.innerHTML = `
      <div class="stat-label">${tStat(s)}</div>
      <input type="number" id="base-${i}" min="1" max="255" value="${state.bases[i]}"
             style="text-align:center" oninput="state.bases[${i}]=+this.value">
      <div class="stat-modifier" id="nat-${i}"></div>
      <div></div><div></div>
    `;
    container.appendChild(row);
  });
  updateNatureIndicators();
}

function buildIVInputs() {
  const container = document.getElementById('iv-inputs');
  container.innerHTML = '';
  const allStats = ['HP', ...STATS];
  const maxIV = state.gen <= 2 ? 15 : 31;
  allStats.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'ev-row';
    div.innerHTML = `
      <div class="stat-label" style="font-size:6px">${tStat(s)}</div>
      <input type="range" id="iv-range-${i}" min="0" max="${maxIV}" step="1"
             value="${state.ivs[i]}"
             oninput="syncIV(${i}, +this.value)">
      <input type="number" id="iv-num-${i}" min="0" max="${maxIV}"
             value="${state.ivs[i]}"
             style="width:44px;text-align:center;padding:4px 2px;font-size:13px"
             oninput="syncIV(${i}, Math.min(${maxIV}, Math.max(0, +this.value||0)))">
    `;
    container.appendChild(div);
  });
}

function syncIV(i, val) {
  val = Math.round(val);
  state.ivs[i] = val;
  const r = document.getElementById('iv-range-' + i);
  const n = document.getElementById('iv-num-'   + i);
  if (r && +r.value !== val) r.value = val;
  if (n && +n.value !== val) n.value = val;
}

function buildEVInputs(containerId = 'ev-inputs', prefix='ev') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  const maxEV  = state.gen <= 2 ? 65535 : 252;
  const stepEV = state.gen <= 2 ? 1 : 4;
  const allStats = ['HP', ...STATS];
  allStats.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'ev-row';
    div.innerHTML = `
      <div class="stat-label" style="font-size:6px">${tStat(s)}</div>
      <input type="range" id="${prefix}-range-${i}" min="0" max="${maxEV}" step="${stepEV}"
             value="${state.evs[i]}"
             oninput="syncEV(${i}, +this.value, '${prefix}')">
      <input type="number" id="${prefix}-num-${i}" min="0" max="${maxEV}"
             value="${state.evs[i]}"
             style="width:44px;text-align:center;padding:4px 2px;font-size:13px"
             oninput="syncEV(${i}, Math.min(${maxEV}, Math.max(0, +this.value||0)), '${prefix}')">
    `;
    container.appendChild(div);
  });
  updateEVTotal();
}

function syncEV(i, val, prefix) {
  val = Math.round(val);

  if (prefix === 'ev' && state.gen > 2) {
    const EV_MAX_TOTAL = 510;
    const EV_MAX_STAT  = 252;
    // Clamp to per-stat max first
    val = Math.min(val, EV_MAX_STAT);
    // Then clamp so total doesn't exceed 510
    const usedByOthers = state.evs.reduce((sum, v, idx) => idx === i ? sum : sum + v, 0);
    const remaining = EV_MAX_TOTAL - usedByOthers;
    if (val > remaining) val = Math.max(0, remaining);
  }

  if (prefix === 'ev') {
    state.evs[i] = val;
    updateEVTotal();
  }
  const r = document.getElementById(prefix + '-range-' + i);
  const n = document.getElementById(prefix + '-num-'   + i);
  if (r && +r.value !== val) r.value = val;
  if (n && +n.value !== val) n.value = val;
}

function updateEVTotal() {
  const total = state.evs.reduce((a, b) => a + b, 0);
  const max = state.gen <= 2 ? 393216 : 510;
  const el = document.getElementById('ev-total');
  if (el) {
    el.textContent = `${total} / ${max}`;
    el.style.color = total >= max ? 'var(--accent)' : 'var(--text2)';
  }
  // Update slider max hints — grey out sliders that have no remaining budget
  if (state.gen > 2) {
    const remaining = max - total;
    for (let j = 0; j < 6; j++) {
      const r = document.getElementById('ev-range-' + j);
      const n = document.getElementById('ev-num-'   + j);
      const headroom = state.evs[j] + remaining;
      const cap = Math.min(252, headroom);
      if (r) r.max = cap;
      if (n) n.max = cap;
    }
  }
}

function buildNatureGrid() {
  const grid = document.getElementById('nature-grid');
  grid.innerHTML = '';
  NATURES.forEach((n, i) => {
    const btn = document.createElement('div');
    btn.className = 'nature-btn' + (i === state.nature ? ' active' : '');
    const upStr = n.up ? `<div class="up">+${tStat(n.up)}</div>` : '';
    const downStr = n.down ? `<div class="down">-${tStat(n.down)}</div>` : '';
    const neutral = !n.up ? `<div class="neutral">—</div>` : '';
    btn.innerHTML = `<div>${tNature(n.name)}</div>${upStr}${downStr}${neutral}`;
    btn.onclick = () => selectNature(i);
    grid.appendChild(btn);
  });
}

function selectNature(i) {
  state.nature = i;
  document.querySelectorAll('.nature-btn').forEach((b, j) => {
    b.classList.toggle('active', j === i);
  });
  const n = NATURES[i];
  const desc = n.up
    ? `${t('section.nature')}: <strong>${tNature(n.name)}</strong> — <span style="color:#44ff44">+${tStat(n.up)}</span> / <span style="color:#ff4444">-${tStat(n.down)}</span>`
    : `${t('section.nature')}: <strong>${tNature(n.name)}</strong> — ${t('nature.nomods')}`;
  document.getElementById('selected-nature').innerHTML = desc;
  updateNatureIndicators();
}

function updateNatureIndicators() {
  const n = NATURES[state.nature];
  STATS.forEach((s, i) => {
    const el = document.getElementById(`nat-${i}`);
    if (!el) return;
    if (s === n.up) { el.textContent = '▲'; el.className = 'stat-modifier up'; }
    else if (s === n.down) { el.textContent = '▼'; el.className = 'stat-modifier down'; }
    else { el.textContent = ''; el.className = 'stat-modifier'; }
  });
}
