function updateDynamicCache(cacheName, cacheLimit, req, res) {
  if (res.ok) {
    caches.open(cacheName).then((cache) => {
      cache.put(req, res.clone());
      limpiarCache(cacheName, cacheLimit);
    });
  } else {
    return res;
  }
}

const limpiarCache = (cacheName, numberItem) => {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > numberItem) {
        cache.delete(keys[0]).then(() => limpiarCache(cacheName, numberItem));
      }
    });
  });
};
