const staticCacheName = "site-static-v1";
const DATA_URL = "https://jsonplaceholder.typicode.com/posts"; // Example API URL

const assets = [
  "./index.html",
  "./js/app.js",
  "./css/bootstrap.min.css",
  "./images/Facebook_iconsvg.png",
  "./pages/fallbackpage.html",
];
self.addEventListener("install", function (event) {
  console.log("service worker installed ...");
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("cache assets");
      cache.addAll(assets);
    })
  );
});

// Activate event: Update the cache if needed
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [staticCacheName]; // Keep only the current cache
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
// Fetch event - serve data from cache or fetch new data
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes(DATA_URL)) {
    // Cache the data for offline use
    event.respondWith(
      caches.match(event.request).then((cacheResponse) => {
        if (cacheResponse) {
          console.log("Serving from cache:", event.request.url);
          return cacheResponse; // Serve cached response if available
        }

        // Otherwise, fetch the data and cache it
        event.waitUntil(
          fetch(event.request).then((fetchResponse) => {
            caches.open(staticCacheName).then((cache) => {
              cache.put(event.request, fetchResponse); // Cache the response
            });
            return fetchResponse;
          })
        );
      })
    );
  } else {
    // For other requests, try fetching as usual
    event.respondWith(
      fetch(event.request).catch(() => {
        caches.match("./pages/fallbackpage.html");
      })
    );
  }
});
