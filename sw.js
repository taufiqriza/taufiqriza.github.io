// Service Worker for Taufiq Riza Portfolio PWA - GitHub Pages Compatible
const CACHE_NAME = 'taufiqriza-portfolio-v2';

// Install event
self.addEventListener('install', event => {
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - Network first, then cache (better for GitHub Pages)
self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Clone the response
                const responseToCache = response.clone();

                // Cache successful responses
                if (response.status === 200) {
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                }

                return response;
            })
            .catch(() => {
                // Return from cache if offline
                return caches.match(event.request)
                    .then(response => {
                        if (response) {
                            return response;
                        }
                        // For navigation requests, return cached index.html
                        if (event.request.mode === 'navigate') {
                            return caches.match('./index.html');
                        }
                    });
            })
    );
});
