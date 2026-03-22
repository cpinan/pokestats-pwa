// ─────────────────────────────────────────────────────
//  saves.js — localStorage wrapper for saved builds
//  Depends on: nothing (loaded before ui.js)
// ─────────────────────────────────────────────────────

const SAVES_KEY = 'pokestats-saves';
const MAX_SAVES = 20;

function getSaves() {
  try { return JSON.parse(localStorage.getItem(SAVES_KEY)) || []; }
  catch { return []; }
}

function saveBuild(data) {
  const saves = getSaves();
  if (saves.length >= MAX_SAVES) saves.shift();
  saves.push({ ...data, id: Date.now().toString(36), savedAt: Date.now() });
  localStorage.setItem(SAVES_KEY, JSON.stringify(saves));
}

function deleteSave(id) {
  localStorage.setItem(SAVES_KEY, JSON.stringify(getSaves().filter(s => s.id !== id)));
}

function loadSave(id) {
  return getSaves().find(s => s.id === id) || null;
}
