const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/index.js",
    "/manifest.webmanifest",
    "/style.css",
];

const PRECACHE = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

// Install
self.addEventListener("install", function(evt) {
    evt.waitUntil(
      caches.open(PRECACHE).then(cache => {
        console.log("Your files were pre-cached successfully!");
        return cache.addAll(FILES_TO_CACHE);
      })
    );
  
    self.skipWaiting();
});

 
self.addEventListener("activate", function(evt) {
    evt.waitUntil(
      caches.keys().then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if (key !== PRECACHE && key !== DATA_CACHE_NAME) {
              console.log("Removing old cache data", key);
              return caches.delete(key);
            }
          })
        );
      })
    );
  
    self.clients.claim();
});