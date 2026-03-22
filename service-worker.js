// ============================================================
// Campus Konnect – Service Worker v2
// Strategy: Cache-First for static, Network-First for API
// ============================================================

const CACHE_VERSION = 'v2';
const STATIC_CACHE  = `konnect-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `konnect-dynamic-${CACHE_VERSION}`;

// Assets to pre-cache on install (app shell)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/businesses.html',
  '/create-profile.html',
  '/admin.html',
  '/style.css',
  '/admin.css',
  '/script.js',
  '/manifest.json',
  '/icon-72.png',
  '/icon-96.png',
  '/icon-128.png',
  '/icon-144.png',
  '/icon-152.png',
  '/icon-192.png',
  '/icon-384.png',
  '/icon-512.png',
  '/offline.html'
];

// ── INSTALL: Pre-cache all static shell assets ──────────────
self.addEventListener('install', event => {
  console.log('[SW] Installing Campus Konnect v2...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Pre-caching app shell');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Pre-cache failed (some assets may be missing):', err))
  );
});

// ── ACTIVATE: Remove old caches ─────────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Activating Campus Konnect v2...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ── FETCH: Smart routing ─────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Skip non-GET and browser-extension requests
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) return;

  // 2. API calls → Network-First (live data with cache fallback)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // 3. Google Fonts & external CDN → Stale-While-Revalidate
  if (url.origin !== self.location.origin) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // 4. App shell / static assets → Cache-First
  event.respondWith(cacheFirst(request));
});

// ── Strategy: Cache-First ────────────────────────────────────
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // If it's a navigation request, show the offline page
    if (request.mode === 'navigate') {
      const offlinePage = await caches.match('/offline.html');
      return offlinePage || new Response('<h1>You are offline</h1>', {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    return new Response('Network error', { status: 503 });
  }
}

// ── Strategy: Network-First ──────────────────────────────────
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response(JSON.stringify({ error: 'Offline', cached: false }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ── Strategy: Stale-While-Revalidate ────────────────────────
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

// ── Background Sync placeholder ──────────────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'sync-posts') {
    console.log('[SW] Background sync triggered for posts');
  }
});

// ── Push Notification placeholder ───────────────────────────
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Campus Konnect';
  const options = {
    body: data.body || 'New activity on Campus Konnect!',
    icon: '/icon-192.png',
    badge: '/icon-96.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
