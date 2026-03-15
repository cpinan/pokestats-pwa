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
  const allStats = ['HP', ...STATS]; // 'HP' translated via tStat()
  allStats.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'ev-row';
    div.innerHTML = `
      <div class="stat-label" style="font-size:6px">${tStat(s)}</div>
      <input type="range" min="0" max="${state.gen <= 2 ? 15 : 31}"
             value="${state.ivs[i]}" step="1"
             oninput="state.ivs[${i}]=+this.value;document.getElementById('iv-val-${i}').textContent=this.value">
      <div class="ev-value" id="iv-val-${i}">${state.ivs[i]}</div>
    `;
    container.appendChild(div);
  });
}

function buildEVInputs(containerId = 'ev-inputs', prefix='ev') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  const maxEV = state.gen <= 2 ? 65535 : 252;
  const allStats = ['HP', ...STATS]; // 'HP' translated via tStat()
  allStats.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'ev-row';
    div.innerHTML = `
      <div class="stat-label" style="font-size:6px">${tStat(s)}</div>
      <input type="range" min="0" max="${maxEV}" step="${state.gen <= 2 ? 1 : 4}"
             value="${state.evs[i]}"
             oninput="updateEV(${i},+this.value,'${prefix}')">
      <div class="ev-value" id="${prefix}-val-${i}">${state.evs[i]}</div>
    `;
    container.appendChild(div);
  });
  updateEVTotal();
}

function updateEV(i, val, prefix='ev') {
  if (prefix === 'ev') {
    state.evs[i] = val;
    document.getElementById(`ev-val-${i}`).textContent = val;
    updateEVTotal();
  }
}

function updateEVTotal() {
  const total = state.evs.reduce((a, b) => a + b, 0);
  const max = state.gen <= 2 ? 393216 : 510;
  const el = document.getElementById('ev-total');
  if (el) {
    el.textContent = `${total} / ${max}`;
    el.style.color = total > max ? '#ff4444' : 'var(--accent)';
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
