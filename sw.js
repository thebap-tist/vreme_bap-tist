const CACHE = 'slovreme-v1';
const ASSETS = [
  '/vreme_bap-tist/',
  '/vreme_bap-tist/index.html',
  '/vreme_bap-tist/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Za API klice — vedno network, brez cache
  if (e.request.url.includes('api.') || e.request.url.includes('rainviewer') || e.request.url.includes('arso')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
