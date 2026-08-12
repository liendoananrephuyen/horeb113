// Service Worker — Horeb 113 (GitHub Pages)
// Scope: /horeb113/

const CACHE = 'horeb113-v1';
const STATIC = [
  './nhap-sa-mac.html',
  './dung-leu.html',
  './manifest-nhap.json',
  './manifest-dung.json',
  './icons/nhap-192.png',
  './icons/nhap-512.png',
  './icons/dung-192.png',
  './icons/dung-512.png',
];

// Cài đặt: cache toàn bộ asset tĩnh
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC))
  );
  self.skipWaiting();
});

// Kích hoạt: xóa cache cũ
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: API → mạng luôn; còn lại → cache trước, mạng sau
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // API hylecuoicung.com → không cache, luôn lấy từ server
  if (url.hostname === 'hylecuoicung.com') return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (e.request.method === 'GET' && res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
