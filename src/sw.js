const staticCacheName = "site-static-v1";
const dynamicCacheName = "site-dynamic-v1";

const staticAssets = [
  "./images/bg-img.jpg",
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./pages/profile.html",
  "./js/profile.js",
  "./css/profile.css",
  "./js/post.js",
  "./images/Facebook_iconsvg.png",
];

const dynamicAssets = [
  // bootstrap
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js",
  // fontawesome
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/webfonts/fa-solid-900.woff2",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/webfonts/fa-regular-400.woff2",
  // all posts
  "https://linked-posts.routemisr.com/posts",
  // user profile data
  "https://linked-posts.routemisr.com/users/profile-data",
];

self.addEventListener("install", function (event) {
  console.log("service worker installed ...");
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("Caching Static Assets");
      cache.addAll(staticAssets);
    })
  );
});

// Activate event: Update the cache if needed
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [staticCacheName, dynamicCacheName]; // Keep only the current cache
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
  const requestUrl = event.request.url;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      const isDynamic = dynamicAssets.some((url) => requestUrl.includes(url));

      if (isDynamic) {
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200) {
              return response;
            }

            // Cache the response dynamically
            const responseClone = response.clone();
            caches.open(dynamicCacheName).then((cache) => {
              cache.put(event.request, responseClone);
            });

            // Cache user profile photo
            if (
              requestUrl ===
              "https://linked-posts.routemisr.com/users/profile-data"
            ) {
              response
                .clone()
                .json()
                .then((data) => {
                  const userPhotoUrl = data.user.photo;
                  if (userPhotoUrl) {
                    fetch(userPhotoUrl)
                      .then((photoResponse) => {
                        if (photoResponse && photoResponse.status === 200) {
                          caches.open(dynamicCacheName).then((cache) => {
                            cache.put(userPhotoUrl, photoResponse);
                          });
                        }
                      })
                      .catch((error) => {
                        console.error("Failed to fetch user photo:", error);
                      });
                  }
                });
            }

            if (
              requestUrl.includes("https://linked-posts.routemisr.com/posts")
            ) {
              response
                .clone()
                .json()
                .then((data) => {
                  const posts = data.posts;
                  posts.forEach((post) => {
                    if (post.image) {
                      fetch(post.image)
                        .then((photoResponse) => {
                          if (photoResponse && photoResponse.status === 200) {
                            caches.open(dynamicCacheName).then((cache) => {
                              cache.put(post.image, photoResponse);
                            });
                          }
                        })
                        .catch((error) => {
                          console.error("Failed to fetch post photo:", error);
                        });
                    }

                    if (post.user.photo) {
                      fetch(post.user.photo)
                        .then((photoResponse) => {
                          if (photoResponse && photoResponse.status === 200) {
                            caches.open(dynamicCacheName).then((cache) => {
                              cache.put(post.user.photo, photoResponse);
                            });
                          }
                        })
                        .catch((error) => {
                          console.error("Failed to fetch user photo:", error);
                        });
                    }
                  });
                });
            }

            return response;
          })
          .catch((error) => {
            console.error("Fetch failed for dynamic asset:", error);
            throw error;
          });
      }

      // For other requests, fetch directly without caching
      return fetch(event.request);
    })
  );
});
