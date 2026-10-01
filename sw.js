/* ==========================================================================
   SITAROT - Service Worker (sw.js)
   解決版本更新讀取舊快取問題（HTML採 Network-First，靜態資源採 Cache-First）
   ========================================================================== */

const CACHE_NAME = 'sitarot-v2.1';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/style.css',
  '/css/tarot-deck.css',
  '/css/modal-widgets.css',
  '/js/security-sanitizer.js',
  '/js/tarot-data-major.js',
  '/js/tarot-data-minor.js',
  '/js/tarot-data.js',
  '/js/spreads-data.js',
  '/js/i18n.js',
  '/js/audio-engine.js',
  '/js/tarot-engine.js',
  '/js/ai-reader.js',
  '/js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => 
      Promise.all(keys.map((k) => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 對於 HTML 網頁，改採 Network-First 策略以確保隨時能看到最新的內容
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((networkResponse) => {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          return networkResponse;
        })
        .catch(() => caches.match(req) || caches.match('/index.html'))
    );
    return;
  }

  // 其他靜態檔案 (CSS/JS/Images) 採用 Cache-First 策略加速
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        }
        return networkResponse;
      });
    })
  );
});