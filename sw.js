'use strict';

var CACHE_NAME = 'browserui-cache';

let cachePromise = caches.open(CACHE_NAME);

self.addEventListener('fetch', function(event) {
  dump("fetch "+event.request.url+"\n");
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
  dump("hit cache\n");
          return response;
        }

        // Otherwise go over network
        return fetch(event.request).then(function(response) {
          // And cache it if the response is successful before
          // handing the response over to the browser
          if (parseInt(response.status) < 400) {
            cachePromise.then(function(cache) {
              cache.put(event.request, response.clone());
  dump("success request, cached!\n");
            });
          }
  dump("return response\n");
          return response;
        });
      }
    )
  );
});
