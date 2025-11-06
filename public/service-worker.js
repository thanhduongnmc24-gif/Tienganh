// Tên bộ nhớ cache
const CACHE_NAME = 'hoc-tieng-anh-v1';

// Các tệp cần cache lại để chạy offline
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Sự kiện 'install': Mở cache và thêm các tệp
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Mở cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Sự kiện 'fetch': Phục vụ tệp từ cache nếu có
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Nếu tìm thấy trong cache, trả về nó
        if (response) {
          return response;
        }
        // Nếu không, tải từ mạng
        return fetch(event.request);
      }
    )
  );
});
