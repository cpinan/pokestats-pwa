// ─────────────────────────────────────────────────────────────────────────────
//  sw.js — Service Worker
//  Uses relative paths so it works on both localhost and GitHub Pages
//  (/pokestats-pwa/) without any changes.
// ─────────────────────────────────────────────────────────────────────────────

const CACHE = 'pokestats-v10';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './css/animations.css',
  './js/data.js',
  './js/formulas.js',
  './js/i18n.js',
  './js/storage.js',
  './js/saves.js',
  './js/ui.js',
  './js/pokemon.js',
  './js/app.js',
  './locales/en.js',
  './locales/es.js',
  './manifest.json',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request))
      .catch(() => caches.match('./index.html'))
  );
});
