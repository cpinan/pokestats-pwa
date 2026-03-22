// ─────────────────────────────────────────────────────
//  summary.js — Build summary: text export, EV donut, share/copy
//  Depends on: data.js, i18n.js
// ─────────────────────────────────────────────────────

function buildTextSummary() {
  const name       = state.currentName || '------';
  const natureName = NATURES[state.nature]?.name || 'Hardy';
  const genLabels  = { 1:'Gen I', 2:'Gen II', 3:'Gen III-V', 6:'Gen VI+' };
  const gen        = genLabels[state.gen] || 'Gen III-V';
  const statKeys   = ['HP','ATK','DEF','SP.ATK','SP.DEF','SPD'];

  const evParts = state.evs.map((v, i) => v > 0 ? `${v} ${statKeys[i]}` : null).filter(Boolean);
  const evLine  = evParts.length ? evParts.join(' / ') : 'No EVs';

  const ivLine = `IVs: ${state.ivs.map((v, i) => `${v} ${statKeys[i]}`).join(' / ')}`;

  const statsLine = (state.lastStats || []).map((v, i) => `${statKeys[i]}: ${v}`).join('  ');

  return [
    name,
    `Level: ${state.level} | ${gen} | ${natureName} Nature`,
    `EVs: ${evLine}`,
    ivLine,
    '',
    statsLine,
    `BST: ${(state.lastStats || []).reduce((a, b) => a + b, 0)}`,
  ].filter(l => l !== null).join('\n');
}

function buildEVChart(evs) {
  const statKeys = ['HP','ATK','DEF','SP.ATK','SP.DEF','SPD'];
  const colors   = ['#e84393','#e74c3c','#f39c12','#3498db','#9b59b6','#2ecc71'];
  const total    = evs.reduce((a, b) => a + b, 0);

  if (total === 0) {
    return `<div style="text-align:center;font-family:var(--pixel);font-size:6px;color:var(--text3);padding:16px 0">${t('saved.noevs')}</div>`;
  }

  const r = 38, cx = 55, cy = 55;
  const circ = 2 * Math.PI * r;

  let cumPct = 0;
  const segs = evs.map((ev, i) => {
    if (ev === 0) return null;
    const pct      = ev / total;
    const dashArr  = pct * circ;
    const dashOff  = circ * (1 - cumPct);
    cumPct += pct;
    return { dashArr, dashOff, color: colors[i], ev, name: statKeys[i] };
  }).filter(Boolean);

  const circles = segs.map(s =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}"
       stroke-width="14"
       stroke-dasharray="${s.dashArr.toFixed(2)} ${circ.toFixed(2)}"
       stroke-dashoffset="${s.dashOff.toFixed(2)}"
       transform="rotate(-90 ${cx} ${cy})"/>`
  ).join('');

  const legend = segs.map(s =>
    `<div style="display:flex;align-items:center;gap:5px">
       <div style="width:8px;height:8px;border-radius:2px;background:${s.color};flex-shrink:0"></div>
       <span style="font-family:var(--pixel);font-size:clamp(5px,1.1vw,7px);color:var(--text2)">${s.name}: ${s.ev}</span>
     </div>`
  ).join('');

  return `
    <div class="ev-chart-wrap">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--bg4)" stroke-width="14"/>
        ${circles}
        <text x="${cx}" y="${cy + 4}" text-anchor="middle"
              font-family="'Press Start 2P',monospace" font-size="7" fill="var(--text2)">${total}</text>
      </svg>
      <div class="ev-chart-legend">${legend}</div>
    </div>`;
}

function renderSummaryPanel() {
  const panel = document.getElementById('summary-panel');
  if (!panel) return;
  const text    = buildTextSummary();
  const hasEVs  = state.evs.some(v => v > 0);
  const evChart = hasEVs ? `
    <div style="margin-top:14px">
      <div style="font-family:var(--pixel);font-size:clamp(6px,1.3vw,7px);color:var(--text2);margin-bottom:8px"
           data-i18n="summary.evdist">EV Distribution</div>
      ${buildEVChart(state.evs)}
    </div>` : '';
  panel.innerHTML = `
    <pre class="summary-text">${text}</pre>
    ${evChart}
    <div class="summary-actions">
      <button class="btn-summary-action" onclick="shareSummary()">
        <span data-i18n="btn.share">📤 SHARE</span>
      </button>
      <button class="btn-summary-action" onclick="copySummary()">
        <span data-i18n="btn.copytext">📋 COPY TEXT</span>
      </button>
    </div>
    <div id="summary-status" style="font-family:var(--pixel);font-size:6px;color:var(--accent);
         text-align:center;min-height:14px;margin-top:6px"></div>
  `;
  applyTranslations();
}

async function shareSummary() {
  const text = buildTextSummary();
  try {
    if (navigator.share) {
      await navigator.share({ title: 'PokéStats Build', text });
    } else {
      await copySummary();
    }
  } catch(e) {
    await copySummary();
  }
}

async function copySummary() {
  const text     = buildTextSummary();
  const statusEl = document.getElementById('summary-status');
  try {
    await navigator.clipboard.writeText(text);
    if (statusEl) { statusEl.textContent = '✓ Copied!'; setTimeout(() => { statusEl.textContent = ''; }, 2000); }
  } catch(e) {
    if (statusEl) { statusEl.textContent = '✗ Copy failed'; setTimeout(() => { statusEl.textContent = ''; }, 2000); }
  }
}
