const CACHE = 'menu-guide-v1';
const STATIC = ['/', '/index.html', '/manifest.json', '/sw.js', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(STATIC.filter(u => !u.includes('icon') || true)))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Never intercept: API calls, Firebase, or external resources
  if (url.includes('workers.dev') || url.includes('googleapis.com') ||
      url.includes('gstatic.com') || url.includes('firestore.google')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
