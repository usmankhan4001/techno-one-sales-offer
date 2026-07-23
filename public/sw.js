const CACHE_NAME = 'techno-one-full-offline-v2';

// ALL 36 Unit Plans to pre-cache for complete offline availability
const UNIT_PLANS = [
  '101', '102', '103', '104', '105', '106',
  '201', '202', '203', '204', '205', '206',
  '301', '302', '303', '304', '305', '306',
  '401', '402', '403', '404', '405', '406',
  'G-01', 'G-02', 'G-03',
  'LG-01', 'LG-02', 'LG-03',
  'M-01', 'M-02', 'M-03', 'M-04', 'M-05', 'M-06'
].map(u => `/unit_plans/${u}.png`);

// Core static assets to cache
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/assets/techno_one_logo.png',
  '/assets/template_title_page.png',
  '/assets/template_table_page.png',
  '/assets/template_table_page_continuation.png',
  '/assets/page_4_back_cover.png'
];

const ALL_PRECACHE_ASSETS = [...CORE_ASSETS, ...UNIT_PLANS];

// Install Event - Pre-cache all app assets and 36 floor plans
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[ServiceWorker] Pre-caching all 36 unit plans and app assets for 100% offline use');
      for (const asset of ALL_PRECACHE_ASSETS) {
        try {
          await cache.add(asset);
        } catch (e) {
          console.warn('[ServiceWorker] Note on asset precache:', asset, e);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[ServiceWorker] Purging old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Cache-first strategy for instant offline loading
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
