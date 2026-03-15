// ─────────────────────────────────────────────────────
//  app.js — core app logic: calculate, compare, helpers, event wiring, init
//  Depends on: data.js, formulas.js, i18n.js, ui.js, pokemon.js
// ─────────────────────────────────────────────────────

// State is declared in data.js
let _initSilent = false; // suppress result panel during startup

function calculate(scroll = false, silent = false) {
  const level = state.level;
  const gen = state.gen;

  const hp = calcHP(+document.getElementById('base-hp').value || state.hp,
                    state.ivs[0], state.evs[0], level, gen);

  const results = STATS.map((s, i) => {
    const base = +(document.getElementById(`base-${i}`)?.value) || state.bases[i];
    const mult = getNatureMult(state.nature, s);
    return {
      name: s,  // internal key — keep in EN
      full: STAT_FULL[i],
      value: calcStat(base, state.ivs[i+1], state.evs[i+1], level, mult, gen),
      mult,
      color: STAT_COLORS[i],
    };
  });

  const allStats = [{ name:'HP', full:'HP', value:hp, mult:1.0, color:'#e84393' }, ...results];
  const total = allStats.reduce((a, s) => a + s.value, 0);

  if (!silent) document.getElementById('result-section').style.display = 'block';

  const genLabels = {1:'GEN I',2:'GEN II',3:'GEN III–V',6:'GEN VI+'};
  document.getElementById('result-gen').textContent = genLabels[gen] || 'GEN III';

  // Fill result grid
  const grid = document.getElementById('result-grid');
  grid.innerHTML = '';
  allStats.forEach(s => {
    const maxVal = getMaxStat(s.name, level, gen);
    const pct = Math.min(100, Math.round((s.value / maxVal) * 100));
    const cls = s.mult > 1 ? 'boosted' : s.mult < 1 ? 'reduced' : '';
    const cell = document.createElement('div');
    cell.className = 'stat-result';
    cell.innerHTML = `
      <div class="stat-result-name">${tStat(s.name)}</div>
      <div class="stat-result-value ${cls}">${s.value}</div>
      <div class="stat-result-pct">${pct}% max</div>
      <div class="stat-bar-bg">
        <div class="stat-bar-fill" style="width:${pct}%;background:${s.color}"></div>
      </div>
    `;
    grid.appendChild(cell);
  });

  document.getElementById('bst-value').textContent = total;

  // Breakdown
  buildBreakdown(allStats, level, gen);

  if (scroll && !silent) document.getElementById('result-section').scrollIntoView({ behavior:'smooth', block:'start' });
}

function buildBreakdown(allStats, level, gen) {
  const body = document.getElementById('breakdown-body');
  body.innerHTML = '';
  allStats.forEach(s => {
    const maxVal = getMaxStat(s.name, level, gen);
    const pct = Math.min(100, Math.round((s.value / maxVal) * 100));
    const cls = s.mult > 1 ? 'up' : s.mult < 1 ? 'down' : '';
    const modStr = s.mult > 1 ? '+10%' : s.mult < 1 ? '-10%' : '';
    const row = document.createElement('div');
    row.style.cssText = 'display:grid;grid-template-columns:60px 1fr 40px 36px;gap:8px;align-items:center;margin-bottom:10px';
    row.innerHTML = `
      <div style="font-family:var(--pixel);font-size:6px;color:var(--text2)">${tStat(s.name)}</div>
      <div style="position:relative;height:8px;background:var(--bg4);border-radius:4px;overflow:hidden">
        <div style="position:absolute;top:0;left:0;height:100%;width:${pct}%;background:${s.color};
                    border-radius:4px;transition:width 0.5s cubic-bezier(0.34,1.56,0.64,1)"></div>
      </div>
      <div style="font-family:var(--pixel);font-size:8px;color:var(--text);text-align:right">${s.value}</div>
      <div style="font-family:var(--pixel);font-size:6px;color:${cls==='up'?'#44ff44':cls==='down'?'#ff4444':'var(--text3)'}">
        ${modStr || '—'}
      </div>
    `;
    body.appendChild(row);
  });
}

function setAllIVs(val) {
  state.ivs = Array(6).fill(val);
  for (let i = 0; i < 6; i++) {
    const r = document.getElementById('iv-range-' + i);
    const n = document.getElementById('iv-num-'   + i);
    if (r) r.value = val;
    if (n) n.value = val;
  }
}

function setAllEVs(val) {
  // Reset then apply through syncEV so the 510 cap is enforced
  state.evs = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < 6; i++) syncEV(i, val, 'ev');
}

function spreadEVs(...vals) {
  // Apply preset values through syncEV so the 510 cap is respected
  // Reset first to give each stat full headroom
  state.evs = [0, 0, 0, 0, 0, 0];
  vals.forEach((v, i) => syncEV(i, v, 'ev'));
}

function showPage(name, navEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  navEl.classList.add('active');
  if (name === 'formula') buildNatureChart();
  if (name === 'compare') buildCompare();
}

document.getElementById('gen-select').addEventListener('change', function() {
  state.gen = +this.value;
  // Rebuild IV/EV inputs with appropriate max values
  buildIVInputs();
  buildEVInputs();
  if (state.gen <= 2) {
    setAllIVs(Math.min(15, state.ivs[0]));
  }
});

document.getElementById('level-range').addEventListener('input', function() {
  state.level = +this.value;
  document.getElementById('level-num').value = this.value;
});

document.getElementById('level-num').addEventListener('input', function() {
  const v = Math.max(1, Math.min(100, +this.value));
  state.level = v;
  document.getElementById('level-range').value = v;
});

function buildNatureChart() {
  const el = document.getElementById('full-nature-chart');
  el.innerHTML = '';  // always rebuild so language change takes effect
  const groups = {};
  NATURES.forEach(n => {
    const key = n.up || 'Neutral';
    if (!groups[key]) groups[key] = [];
    groups[key].push(n);
  });
  let html = '';
  Object.entries(groups).forEach(([k, nats]) => {
    html += `<div style="margin-bottom:12px">
      <div style="font-family:var(--pixel);font-size:6px;color:var(--text2);margin-bottom:6px">
        ${k === 'Neutral' ? t('label.neutral').toUpperCase() : '+' + tStat(k)}
      </div>`;
    nats.forEach(n => {
      const upC = n.up ? '#44ff44' : 'var(--text3)';
      const dnC = n.down ? '#ff4444' : 'var(--text3)';
      html += `<div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="font-family:var(--pixel);font-size:6.5px;color:var(--text);min-width:60px">${tNature(n.name)}</span>
        <span style="font-size:11px;color:${upC}">${n.up ? '▲'+tStat(n.up) : '—'}</span>
        <span style="font-size:11px;color:${dnC}">${n.down ? '▼'+tStat(n.down) : '—'}</span>
      </div>`;
    });
    html += `</div>`;
  });
  el.innerHTML = html;
}

function buildCompare() {
  const selA = document.getElementById('cmp-nature-a');
  const selB = document.getElementById('cmp-nature-b');
  if (selA.innerHTML) return;
  NATURES.forEach((n, i) => {
    selA.innerHTML += `<option value="${i}">${tNature(n.name)}</option>`;
    selB.innerHTML += `<option value="${i}">${tNature(n.name)}</option>`;
  });
  selB.value = 1;

  // Build EV sliders for A and B
  buildCmpEVs('cmp-ev-inputs-a', 'ca');
  buildCmpEVs('cmp-ev-inputs-b', 'cb');
}

// cmpEVsA / cmpEVsB declared in data.js

function buildCmpEVs(containerId, prefix) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  const allStats = ['HP', ...STATS];
  allStats.forEach((s, i) => {
    const div = document.createElement('div');
    div.className = 'ev-row';
    div.style.marginBottom = '8px';
    div.innerHTML = `
      <div class="stat-label" style="font-size:6px">${tStat(s)}</div>
      <input type="range" id="${prefix}-ev-range-${i}" min="0" max="252" step="4" value="0"
             oninput="syncCmpEV('${prefix}', ${i}, +this.value)">
      <input type="number" id="${prefix}-ev-num-${i}" min="0" max="252" value="0"
             style="width:44px;text-align:center;padding:4px 2px;font-size:13px"
             oninput="syncCmpEV('${prefix}', ${i}, Math.min(252, Math.max(0, +this.value||0)))">
    `;
    container.appendChild(div);
  });
}

function syncCmpEV(prefix, i, val) {
  val = Math.round(val);
  if (prefix === 'ca') cmpEVsA[i] = val;
  if (prefix === 'cb') cmpEVsB[i] = val;
  const r = document.getElementById(prefix + '-ev-range-' + i);
  const n = document.getElementById(prefix + '-ev-num-'   + i);
  if (r && +r.value !== val) r.value = val;
  if (n && +n.value !== val) n.value = val;
}

function runCompare() {
  const natA = +document.getElementById('cmp-nature-a').value;
  const natB = +document.getElementById('cmp-nature-b').value;
  const level = state.level;
  const gen = state.gen;
  const allStats = ['HP', ...STATS]; // 'HP' translated via tStat()

  const calcs = (evs, nat) => {
    const hp = calcHP(state.hp, state.ivs[0], evs[0], level, gen);
    const others = STATS.map((s, i) =>
      calcStat(state.bases[i], state.ivs[i+1], evs[i+1], level, getNatureMult(nat, s), gen)
    );
    return [hp, ...others];
  };

  const valsA = calcs(cmpEVsA, natA);
  const valsB = calcs(cmpEVsB, natB);

  const res = document.getElementById('compare-results');
  let html = `<div style="display:grid;grid-template-columns:50px 1fr 1fr;gap:6px;
    font-family:var(--pixel);font-size:6px;color:var(--text2);margin-bottom:8px">
    <div></div>
    <div style="text-align:center">${tNature(NATURES[natA].name).toUpperCase()}</div>
    <div style="text-align:center">${tNature(NATURES[natB].name).toUpperCase()}</div>
  </div>`;

  allStats.forEach((s, i) => {
    const a = valsA[i], b = valsB[i];
    const winA = a > b, winB = b > a;
    html += `<div style="display:grid;grid-template-columns:50px 1fr 1fr;gap:6px;align-items:center;
      padding:6px 0;border-bottom:1px solid var(--border)">
      <div style="font-family:var(--pixel);font-size:6px;color:var(--text2)">${tStat(s)}</div>
      <div style="font-family:var(--pixel);font-size:11px;text-align:center;
        color:${winA?'#44ff44':'var(--text)'}">${a}${winA?' ★':''}</div>
      <div style="font-family:var(--pixel);font-size:11px;text-align:center;
        color:${winB?'#44ff44':'var(--text)'}">${b}${winB?' ★':''}</div>
    </div>`;
  });

  const totalA = valsA.reduce((x,y)=>x+y,0);
  const totalB = valsB.reduce((x,y)=>x+y,0);
  html += `<div style="display:grid;grid-template-columns:50px 1fr 1fr;gap:6px;
    padding:8px 0;font-family:var(--pixel);font-size:8px">
    <div style="color:var(--text2)">${t('label.total')}</div>
    <div style="text-align:center;color:${totalA>=totalB?'var(--accent)':'var(--text2)'}">${totalA}</div>
    <div style="text-align:center;color:${totalB>totalA?'var(--accent)':'var(--text2)'}">${totalB}</div>
  </div>`;
  res.innerHTML = html;
}

function init() {
  buildBaseStatsGrid();
  buildNatureGrid();
  buildIVInputs();
  buildEVInputs();

  document.getElementById('sprite-placeholder').style.display = 'block';
  document.getElementById('pokemon-sprite').style.display = 'none';

  // Enter key: search or select first dropdown item
  document.getElementById('pokemon-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const first = document.querySelector('.dd-item');
      if (first && dropdownOpen) { first.click(); }
      else { searchPokemon(); }
    }
    if (e.key === 'Escape') { closeDropdown(); }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const items = document.querySelectorAll('.dd-item');
      if (items.length) { items[0].focus(); }
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    const field = document.getElementById('pokemon-input');
    const dd    = document.getElementById('pokemon-dropdown');
    if (!field.contains(e.target) && !dd.contains(e.target)) {
      closeDropdown();
    }
  });

  // List is embedded — no API call needed for dropdown

  // Detect and apply language
  currentLang = detectLang();
  document.getElementById('lang-select').value = currentLang;
  applyTranslations();

  // Load Garchomp as default (silent — don't show results panel on startup)
  _initSilent = true;
  loadPreset('garchomp');
  _initSilent = false;

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
}

init();
