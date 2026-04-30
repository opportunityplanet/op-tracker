const CACHE = 'op-tracker-v1';
const FILES = [
  '/op-tracker/',
  '/op-tracker/index.html',
  '/op-tracker/manifest.json',
  '/op-tracker/icon-192.png',
  '/op-tracker/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/op-tracker/')))
  );
});
