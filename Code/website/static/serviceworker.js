self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('your-cache-name').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/static/logo.png',
        // Add other static assets here
      ]).catch((error) => {
        console.error('Cache addAll error:', error);
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});


// self.addEventListener('install', (event) => {
//     event.waitUntil(
//       caches.open('your-cache-name').then((cache) => {
//         return cache.addAll([
//           '/',
//           '/index.html',
//           '/static/logo.png',
//           // Add other static assets here
//         ]);
//       })
//     );
//   });
  
//   self.addEventListener('fetch', (event) => {
//     event.respondWith(
//       caches.match(event.request).then((response) => {
//         return response || fetch(event.request);
//       })
//     );
//   });
  