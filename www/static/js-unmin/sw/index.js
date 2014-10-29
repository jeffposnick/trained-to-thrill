self.oninstall = function(event) {
  var urlsToPrefetch = [
    '/trained-to-thrill/',
    '/trained-to-thrill/static/css/all.css',
    '/trained-to-thrill/static/js/page.js',
    '/trained-to-thrill/static/imgs/logo.svg',
    '/trained-to-thrill/static/imgs/icon.png'
  ];

  event.waitUntil(
    caches.open('trains-static-v14').then(function(cache) {
      return Promise.all(
        urlsToPrefetch.map(function(url) {
          return fetch(url);
        })
      ).then(function(responses) {
        return responses.map(function(response, i) {
          return cache.put(urlsToPrefetch[i], response);
        });
      });
    })
  );
};

var expectedCaches = [
  'trains-static-v14',
  'trains-imgs',
  'trains-data'
];

self.onactivate = function(event) {
  // remove caches beginning "trains-" that aren't in
  // expectedCaches
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (!/^trains-/.test(cacheName)) {
            return;
          }
          if (expectedCaches.indexOf(cacheName) == -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
};

self.onfetch = function(event) {
  var requestURL = new URL(event.request.url);

  if (requestURL.hostname == 'api.flickr.com') {
    event.respondWith(flickrAPIResponse(event.request));
  }
  else if (/\.staticflickr\.com$/.test(requestURL.hostname)) {
    event.respondWith(flickrImageResponse(event.request));
  }
  else {
    event.respondWith(
      caches.open('trains-static-v14').then(function(cache) {
        return cache.match(event.request).catch(function() {
          return null;
        });
      })
    );
  }
};

function flickrAPIResponse(request) {
  if (request.headers.get('Accept') == 'x-cache/only') {
    return caches.open('trains-data').then(function(cache) {
      return cache.match(request).catch(function() {
        return null;
      });
    });
  }
  else {
    return fetch(request).then(function(response) {
      return caches.open('trains-data').then(function(cache) {
        // clean up the image cache
        Promise.all([
          response.clone().json(),
          caches.open('trains-imgs')
        ]).then(function(results) {
          var data = results[0];
          var imgCache = results[1];

          var imgURLs = data.photos.photo.map(function(photo) {
            return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_c.jpg';
          });

          // if an item in the cache *isn't* in imgURLs, delete it
          imgCache.keys().then(function(requests) {
            requests.forEach(function(request) {
              if (imgURLs.indexOf(request.url) == -1) {
                imgCache.delete(request);
              }
            });
          });
        });

        cache.put(request, response.clone()).then(function() {
          console.log("Yey cache");
        }, function(error) {
          console.error("Nay cache", error);
        });

        return response;
      });
    });
  }
}

function flickrImageResponse(request) {
  return caches.open('trains-imgs').then(function(cache) {
    return cache.match(request).then(function(response) {
      return response;
    }).catch(function() {
      return fetch(request).then(function(response) {
        caches.open('trains-imgs').then(function(cache) {
          cache.put(request, response).then(function() {
            console.log('yey img cache');
          }, function(error) {
            console.error('nay img cache', error);
          });
        });

        return response.clone();
      });
    });
  });
}
