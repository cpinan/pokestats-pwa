// ─────────────────────────────────────────────────────
//  storage.js — IndexedDB wrapper for offline Pokémon data cache
//  Depends on: nothing (loaded before ui.js)
// ─────────────────────────────────────────────────────

const DB_NAME = 'pokestats-db', DB_VERSION = 1, STORE = 'pokemon-cache';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => e.target.result.createObjectStore(STORE, { keyPath: 'name' });
    req.onsuccess = e => resolve(e.target.result);
    req.onerror   = e => reject(e.target.error);
  });
}

async function savePokemon(data) {
  try {
    const db = await openDB();
    db.transaction(STORE, 'readwrite').objectStore(STORE).put({ name: data.name, data, savedAt: Date.now() });
  } catch (e) {
    // IndexedDB unavailable (private browsing, etc.) — silently skip
  }
}

async function getCachedPokemon(name) {
  try {
    const db = await openDB();
    return new Promise(resolve => {
      const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(name);
      req.onsuccess = e => resolve(e.target.result?.data || null);
      req.onerror   = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}
