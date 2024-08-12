const CACHE_NAME = 'calify-cache-v1';
const urlsToCache = [
    '/calify/',
    '/calify/index.html',
    '/calify/app.js',
    '/calify/styles.css',
    '/calify/icons/icon-192x192.png',
    '/calify/icons/icon-384x384.png',
    '/calify/icons/icon-512x512.png',
    '/calify/favicon.ico',
    'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap' // Caching Google Font
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
