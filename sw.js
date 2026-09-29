/* ==========================================================================
   天下第一塔羅牌 - PWA Service Worker (sw.js)
   離線快取與全站資源快取更新
   ========================================================================== */

const CACHE_NAME = 'astral-tarot-v1.0';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/tarot-deck.css',
  './css/modal-widgets.css',
  './js/security-sanitizer.js',
  './js/tarot-data-major.js',
  './js/tarot-data-minor.js',
  './js/spreads-data.js',
  './js/i18n.js',
  './js/audio-engine.js',
  './js/tarot-engine.js',
  './js/ai-reader.js',
  './js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      });
    })
  );
});