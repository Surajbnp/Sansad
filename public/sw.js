const CACHE_NAME = "ssa-cache-v1";

const urlsToCache = [
  "/",
  "/manifest.json",
  "/icons/icon1.png",
  "/icons/icon0.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      return res || fetch(event.request);
    }),
  );
});
