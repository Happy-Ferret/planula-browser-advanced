'use strict';

importScripts('lib/sww.js/dist/sww.js');

function AutoCache(cacheName, options, missPolicy) {
  this.cacheName = 'offline';
}

AutoCache.prototype.onFetch = function at_onFetch(request, response) {
  // If another middleware layer already have a response, the simple cache
  // just pass through the response and does nothing.
  if (response) {
    return Promise.resolve(response);
  }

  var clone = request.clone();
  var _this = this;
  return this.ensureCache().then(function(cache) {
    return cache.match(clone, _this.options).then(function(res) {
      if (res) {
        return res;
      }

      return this.fetchAndCache(request, cache);
    });
  });
};

AutoCache.prototype.ensureCache = function at_ensureCache() {
  if (!this.cacheRequest) {
    this.cacheRequest = caches.open(this.cacheName);
  }
  return this.cacheRequest;
};

AutoCache.prototype.fetchAndCache = function at_fetchAndCache(request, cache) {
  return fetch(request.clone()).then(function(response) {
    if (parseInt(response.status) < 400) {
      cache.put(request.clone(), response.clone());
    }
    return response;
  });
};


var worker = new self.ServiceWorkerWare();
worker.use(new AutoCache());
worker.init();

