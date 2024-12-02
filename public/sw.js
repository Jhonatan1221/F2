importScripts("/js/sw-utils.js");
importScripts("https://cdn.jsdelivr.net/npm/pouchdb@8.0.1/dist/pouchdb.min.js");
importScripts("/js/sw-db.js");

const CACHE_DYNAMIC = "dynamic-v0";
const CACHE_STATIC = "static-v0";
const CACHE_INMUTABLE = "inmutable-v0";

const CACHE_DYNAMIC_LIMIT = 151;

self.addEventListener("install", (event) => {
  console.log("SW: installed");
  const cachePromise = caches.open(CACHE_STATIC).then((cache) => {
    return cache.addAll([
      "/",
      "/img/29.png",
      "/img/40.png",
      "/img/57.png",
      "/img/58.png",
      "/img/60.png",
      "/img/80.png",
      "/img/87.png",
      "/img/114.png",
      "/img/120.png",
      "/img/180.png",
      "/img/1024.png",
      "/img/maskable_icon_x192.png",
      "/img/pinterest_mobile_360x740.png",
      "/img/pinterest_desktop_1280x800.png",
      "/js/app.js",
      "/js/sw-utils.js",
      "/favicon.ico",
      "/firebase-messaging-sw.js",
      "/manifest.json",
      "/OfflineFallback.js",
      "/sw.js",
      "/img/not-found.png",
      "/index.html",
    ]);
  });
  const cacheInmutable = caches.open(CACHE_INMUTABLE).then((cache) => {
    return cache.addAll([]);
  });
  event.waitUntil(Promise.all([cachePromise, cacheInmutable]));
});
self.addEventListener("activate", (event) => {
  console.log("SW: activated");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== CACHE_STATIC &&
              cacheName !== CACHE_DYNAMIC &&
              cacheName !== CACHE_INMUTABLE
            ) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", (event) => {
  if (!event.request.url.includes("http")) return;

  let fetchResponse;

  if (event.request.url.includes("/api/users")) {
    fetchResponse = manageAPIPOSTS(
      CACHE_DYNAMIC,
      CACHE_DYNAMIC_LIMIT,
      event.request
    );
  } else {
    if (event.request.method === "GET") {
      fetchResponse = caches.match(event.request).then((res) => {
        //return cache if exists
        if (res) return res;

        //if not exists, fetch from network
        return fetch(event.request)
          .then((newRes) => {
            if (newRes.ok) {
              //save in cache
              updateDynamicCache(
                CACHE_DYNAMIC,
                CACHE_DYNAMIC_LIMIT,
                event.request,
                newRes.clone()
              );
              return newRes.clone();
            }
            //if not possible to save in cache, return response
            return newRes;
          })
          .catch(() => {
            //if not possible to fetch from network, return offline page
            if (event.request.url.includes(".jsx")) {
              return caches.open(CACHE_STATIC).then((cache) => {
                return cache.match("/OfflineFallback.js");
              });
            }
            //if not possible to fetch from network, return offline image
            if (
              event.request.url.includes(".jpeg") ||
              event.request.url.includes(".jpg") ||
              event.request.url.includes(".png") ||
              event.request.url.includes(".gif") ||
              event.request.url.includes(".webp") ||
              event.request.url.includes(".svg")
            ) {
              return caches.open(CACHE_STATIC).then((cache) => {
                return cache.match("/img/not-found.png");
              });
            }
            return caches.open(CACHE_STATIC).then((cache) => {
              return cache.match("/OfflineFallback.js");
            });
          });
      });
    } else if (event.request.method === "POST") {
      fetchResponse = fetch(event.request).catch((err) => {
        console.log("SW API POST request failed: ", err);
      });
    }
  }

  event.respondWith(fetchResponse);
});

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-post-edit-username") {
    console.log("SW: Sync post-edit-username");
    event.waitUntil(postUpdateUsername());
  }
});
