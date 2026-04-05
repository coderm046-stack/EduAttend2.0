/* ================================================================
   EduAttend — Service Worker  (sw.js)
   Strategy:
     • Static shell  → Cache-first  (HTML, JS, CSS, fonts, icons)
     • Navigations   → Network-first with offline fallback
     • Everything else → Network-first with stale fallback
   ================================================================ */

const CACHE_NAME   = 'eduattend-v1';
const OFFLINE_URL  = './index.html';

/* ── Assets to pre-cache on install ── */
const PRECACHE_ASSETS = [
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
];

/* ───────────────────────── INSTALL ─────────────────────────── */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching shell assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  /* Activate immediately without waiting for old tabs to close */
  self.skipWaiting();
});

/* ───────────────────────── ACTIVATE ────────────────────────── */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    )
  );
  /* Take control of all open clients immediately */
  self.clients.claim();
});

/* ───────────────────────── FETCH ───────────────────────────── */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* Skip non-GET and cross-origin requests */
  if (request.method !== 'GET') return;
  if (url.origin !== location.origin) return;

  /* ── Navigation requests: Network-first → offline fallback ── */
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          /* Clone and cache the fresh page */
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(async () => {
          /* Offline — serve cached shell */
          const cached = await caches.match(OFFLINE_URL);
          return cached || new Response('<h1>You are offline</h1>', {
            headers: { 'Content-Type': 'text/html' },
          });
        })
    );
    return;
  }

  /* ── Static assets (JS/CSS/fonts/images): Cache-first ── */
  if (
    url.pathname.match(/\.(js|css|woff2?|ttf|otf|png|jpg|jpeg|svg|gif|webp|ico)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  /* ── Everything else: Network-first → stale fallback ── */
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});

/* ───────────────── BACKGROUND SYNC (optional) ──────────────── */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-attendance') {
    console.log('[SW] Background sync: attendance data');
    /* Extend here if you add IndexedDB-based offline queuing */
  }
});

/* ───────────────── PUSH NOTIFICATIONS (optional) ───────────── */
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'EduAttend', {
      body: data.body || '',
      icon: './icon-192.png',
      badge: './icon-192.png',
      data: data.url || '/',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});
