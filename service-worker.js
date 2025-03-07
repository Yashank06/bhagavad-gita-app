const CACHE_NAME = 'gita-app-v1';
const ASSETS = [
  '/bhagavad-gita-app/',
  '/bhagavad-gita-app/index.html',
  '/bhagavad-gita-app/styles.css',
  '/bhagavad-gita-app/script.js',
  '/bhagavad-gita-app/verses.json',
  '/bhagavad-gita-app/manifest.json',
  '/bhagavad-gita-app/icon-192x192.png',
  '/bhagavad-gita-app/icon-512x512.png'
];

// Install the service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .catch((error) => console.error('Failed to cache assets:', error))
  );
});

// Fetch cached assets
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});