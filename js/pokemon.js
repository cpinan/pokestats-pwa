// ─────────────────────────────────────────────────────
//  pokemon.js — Pokémon search, dropdown UI, API fetch, preset loader
//  Depends on: data.js, i18n.js
//
//  API SECURITY NOTE:
//  All requests go to the public PokeAPI (https://pokeapi.co).
//  PokeAPI is a free, public, read-only API — no key required.
//  If you proxy requests through your own backend, set API_BASE_URL
//  in your environment and update fetchAndApply() accordingly.
//  Never store API keys in client-side JS files.
// ─────────────────────────────────────────────────────

const API_BASE_URL = 'https://pokeapi.co/api/v2';
const CORS_PROXY   = 'https://corsproxy.io/?';

let dropdownOpen = false;

function filterDropdown(val) {
  document.getElementById('search-clear').style.display = val ? 'block' : 'none';
  renderDropdown(val);
}

function openDropdown() {
  const val = document.getElementById('pokemon-input').value;
  renderDropdown(val);
}

function renderDropdown(inputVal) {
  const dd = document.getElementById('pokemon-dropdown');
  const query = (inputVal || '').trim().toLowerCase();
  let matches;
  if (!query) {
    matches = allPokemon.slice(0, 60);
  } else {
    const byId    = allPokemon.filter(p => String(p.id) === query);
    const starts  = allPokemon.filter(p => p.name.startsWith(query) && String(p.id) !== query);
    const contains= allPokemon.filter(p => !p.name.startsWith(query) && p.name.includes(query));
    matches = [...byId, ...starts, ...contains].slice(0, 80);
  }

  dd.innerHTML = matches.map(p => {
    const display = p.name.split('-').map(w => w.charAt(0).toUpperCase()+w.slice(1)).join('-');
    return `<div class="dd-item" data-name="${p.name}" data-id="${p.id}"
         onclick="selectFromDropdown('${p.name}',${p.id})"
         style="display:flex;align-items:center;gap:10px;padding:8px 12px;cursor:pointer;
                border-bottom:1px solid var(--border);
                font-family:var(--body);font-size:14px;font-weight:600;color:var(--text);"
         onmouseenter="this.style.background='var(--bg3)'"
         onmouseleave="this.style.background=''">
       <span style="font-family:var(--pixel);font-size:5.5px;color:var(--text3);min-width:32px">
         #${String(p.id).padStart(3,'0')}
       </span>
       <span>${display}</span>
     </div>`;
  }).join('');

  if (!matches.length) {
    dd.innerHTML = `<div style="padding:12px;font-family:var(--pixel);font-size:6px;
                                color:var(--text3);text-align:center">NO RESULTS</div>`;
  }

  dd.style.display = 'block';
  dropdownOpen = true;
}

function closeDropdown() {
  document.getElementById('pokemon-dropdown').style.display = 'none';
  dropdownOpen = false;
}

function clearSearch() {
  document.getElementById('pokemon-input').value = '';
  document.getElementById('search-clear').style.display = 'none';
  closeDropdown();
}

async function selectFromDropdown(name, id) {
  closeDropdown();
  const display = name.split('-').map(w => w.charAt(0).toUpperCase()+w.slice(1)).join('-');
  document.getElementById('pokemon-input').value = display;
  document.getElementById('search-clear').style.display = 'block';
  await fetchAndApply(name);
}

async function searchPokemon() {
  const raw = document.getElementById('pokemon-input').value.trim().toLowerCase();
  if (!raw) { renderDropdown(''); return; }
  // Check if it matches a known pokemon name or ID first (avoids unnecessary fetch)
  const byName = allPokemon.find(p => p.name === raw || p.name === raw.replace(/\s+/g,'-'));
  const byId   = allPokemon.find(p => String(p.id) === raw);
  const target = byName || byId;
  if (target) {
    await fetchAndApply(target.name);
  } else {
    await fetchAndApply(raw);
  }
}

async function fetchAndApply(query) {
  const status = document.getElementById('search-status');
  status.style.color = 'var(--text3)';
  status.textContent = t('status.searching');
  try {
    // Use a CORS-safe proxy pattern: try direct first, then proxy
    let data = null;
    const directUrl = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`;
    try {
      const res = await fetch(directUrl, { mode: 'cors' });
      if (!res.ok) throw new Error(res.status);
      data = await res.json();
    } catch(fetchErr) {
      // Fallback: try no-cors-friendly proxy
      const proxyUrl = `${CORS_PROXY}${encodeURIComponent(directUrl)}`;
      const res2 = await fetch(proxyUrl);
      if (!res2.ok) throw new Error(`Not found: ${query}`);
      data = await res2.json();
    }
    applyPokeAPIData(data);
    status.style.color = '#44ff44';
    status.textContent = `✓ ${data.name.toUpperCase()} ${t('status.loaded')}`;
    setTimeout(() => { status.textContent = ''; }, 2000);
  } catch(e) {
    // Final fallback: use hardcoded presets if available, else show error
    const preset = Object.values(PRESETS).find(p => p.name.toLowerCase() === query.toLowerCase());
    if (preset) {
      loadPreset(Object.keys(PRESETS).find(k => PRESETS[k] === preset));
      status.style.color = '#ffcc00';
      status.textContent = `⚠ ${t('status.offline')} — ${preset.name}`;
    } else {
      status.style.color = '#ff4444';
      status.textContent = `✗ Fetch failed — try serving over HTTP (not file://)`;
    }
  }
}

function applyPokeAPIData(data) {
  const statMap = {};
  data.stats.forEach(s => { statMap[s.stat.name] = s.base_stat; });
  const hp  = statMap['hp']              || 50;
  const atk = statMap['attack']          || 50;
  const def = statMap['defense']         || 50;
  const spa = statMap['special-attack']  || 50;
  const spd = statMap['special-defense'] || 50;
  const spe = statMap['speed']           || 50;

  state.hp    = hp;
  state.bases = [atk, def, spa, spd, spe];
  document.getElementById('base-hp').value = hp;
  [atk, def, spa, spd, spe].forEach((v, i) => {
    const el = document.getElementById(`base-${i}`);
    if (el) el.value = v;
  });

  const num  = data.id;
  const name = data.name;
  document.getElementById('pokedex-num').textContent = `#${String(num).padStart(3,'0')}`;
  document.getElementById('pokemon-name-display').textContent = name.toUpperCase();
  const display = name.split('-').map(w => w.charAt(0).toUpperCase()+w.slice(1)).join('-');
  document.getElementById('pokemon-input').value = display;
  document.getElementById('search-clear').style.display = 'block';

  updateTypeBadges(data.types.map(t => t.type.name));

  const sprites = data.sprites;
  const url = sprites.front_default ||
    (sprites.other && sprites.other['official-artwork'] && sprites.other['official-artwork'].front_default) || '';
  loadSpriteUrl(url);

  calculate();
}

function loadPreset(key) {
  const p = PRESETS[key];
  if (!p) return;
  state.hp    = p.bases[0];
  state.bases = p.bases.slice(1);
  document.getElementById('base-hp').value = p.bases[0];
  STATS.forEach((_, i) => {
    const el = document.getElementById(`base-${i}`);
    if (el) el.value = state.bases[i];
  });
  document.getElementById('pokedex-num').textContent = `#${String(p.num).padStart(3,'0')}`;
  document.getElementById('pokemon-name-display').textContent = p.name.toUpperCase();
  document.getElementById('pokemon-input').value = p.name;
  document.getElementById('search-clear').style.display = 'block';
  updateTypeBadges(p.types);
  loadSprite(p.num);
  calculate();
}

function updateTypeBadges(types) {
  document.getElementById('type-badges').innerHTML = types.map(t =>
    `<span class="type-badge" style="background:${TYPE_COLORS[t]||'#888'}">${t}</span>`
  ).join('');
}

function loadSprite(num) {
  loadSpriteUrl(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${num}.png`);
}

function loadSpriteUrl(url) {
  const img = document.getElementById('pokemon-sprite');
  const ph  = document.getElementById('sprite-placeholder');
  if (!url) { img.style.display = 'none'; ph.style.display = 'block'; return; }
  img.src = url;
  img.style.display = 'block';
  ph.style.display = 'none';
  img.onerror = () => { img.style.display = 'none'; ph.style.display = 'block'; };
}
