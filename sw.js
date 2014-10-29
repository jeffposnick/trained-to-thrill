(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//var caches = require('../libs/caches');

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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9qZWZmeS9naXQvdHJhaW5lZC10by10aHJpbGwvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9qZWZmeS9naXQvdHJhaW5lZC10by10aHJpbGwvd3d3L3N0YXRpYy9qcy11bm1pbi9zdy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vdmFyIGNhY2hlcyA9IHJlcXVpcmUoJy4uL2xpYnMvY2FjaGVzJyk7XG5cbnNlbGYub25pbnN0YWxsID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgdmFyIHVybHNUb1ByZWZldGNoID0gW1xuICAgICcvdHJhaW5lZC10by10aHJpbGwvJyxcbiAgICAnL3RyYWluZWQtdG8tdGhyaWxsL3N0YXRpYy9jc3MvYWxsLmNzcycsXG4gICAgJy90cmFpbmVkLXRvLXRocmlsbC9zdGF0aWMvanMvcGFnZS5qcycsXG4gICAgJy90cmFpbmVkLXRvLXRocmlsbC9zdGF0aWMvaW1ncy9sb2dvLnN2ZycsXG4gICAgJy90cmFpbmVkLXRvLXRocmlsbC9zdGF0aWMvaW1ncy9pY29uLnBuZydcbiAgXTtcblxuICBldmVudC53YWl0VW50aWwoXG4gICAgY2FjaGVzLm9wZW4oJ3RyYWlucy1zdGF0aWMtdjE0JykudGhlbihmdW5jdGlvbihjYWNoZSkge1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgICB1cmxzVG9QcmVmZXRjaC5tYXAoZnVuY3Rpb24odXJsKSB7XG4gICAgICAgICAgcmV0dXJuIGZldGNoKHVybCk7XG4gICAgICAgIH0pXG4gICAgICApLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2VzKSB7XG4gICAgICAgIHJldHVybiByZXNwb25zZXMubWFwKGZ1bmN0aW9uKHJlc3BvbnNlLCBpKSB7XG4gICAgICAgICAgcmV0dXJuIGNhY2hlLnB1dCh1cmxzVG9QcmVmZXRjaFtpXSwgcmVzcG9uc2UpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pXG4gICk7XG59O1xuXG52YXIgZXhwZWN0ZWRDYWNoZXMgPSBbXG4gICd0cmFpbnMtc3RhdGljLXYxNCcsXG4gICd0cmFpbnMtaW1ncycsXG4gICd0cmFpbnMtZGF0YSdcbl07XG5cbnNlbGYub25hY3RpdmF0ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gIC8vIHJlbW92ZSBjYWNoZXMgYmVnaW5uaW5nIFwidHJhaW5zLVwiIHRoYXQgYXJlbid0IGluXG4gIC8vIGV4cGVjdGVkQ2FjaGVzXG4gIGV2ZW50LndhaXRVbnRpbChcbiAgICBjYWNoZXMua2V5cygpLnRoZW4oZnVuY3Rpb24oY2FjaGVOYW1lcykge1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgICBjYWNoZU5hbWVzLm1hcChmdW5jdGlvbihjYWNoZU5hbWUpIHtcbiAgICAgICAgICBpZiAoIS9edHJhaW5zLS8udGVzdChjYWNoZU5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChleHBlY3RlZENhY2hlcy5pbmRleE9mKGNhY2hlTmFtZSkgPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWNoZXMuZGVsZXRlKGNhY2hlTmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9KVxuICApO1xufTtcblxuc2VsZi5vbmZldGNoID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgdmFyIHJlcXVlc3RVUkwgPSBuZXcgVVJMKGV2ZW50LnJlcXVlc3QudXJsKTtcblxuICBpZiAocmVxdWVzdFVSTC5ob3N0bmFtZSA9PSAnYXBpLmZsaWNrci5jb20nKSB7XG4gICAgZXZlbnQucmVzcG9uZFdpdGgoZmxpY2tyQVBJUmVzcG9uc2UoZXZlbnQucmVxdWVzdCkpO1xuICB9XG4gIGVsc2UgaWYgKC9cXC5zdGF0aWNmbGlja3JcXC5jb20kLy50ZXN0KHJlcXVlc3RVUkwuaG9zdG5hbWUpKSB7XG4gICAgZXZlbnQucmVzcG9uZFdpdGgoZmxpY2tySW1hZ2VSZXNwb25zZShldmVudC5yZXF1ZXN0KSk7XG4gIH1cbiAgZWxzZSB7XG4gICAgZXZlbnQucmVzcG9uZFdpdGgoXG4gICAgICBjYWNoZXMub3BlbigndHJhaW5zLXN0YXRpYy12MTQnKS50aGVuKGZ1bmN0aW9uKGNhY2hlKSB7XG4gICAgICAgIHJldHVybiBjYWNoZS5tYXRjaChldmVudC5yZXF1ZXN0KS5jYXRjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGZsaWNrckFQSVJlc3BvbnNlKHJlcXVlc3QpIHtcbiAgaWYgKHJlcXVlc3QuaGVhZGVycy5nZXQoJ0FjY2VwdCcpID09ICd4LWNhY2hlL29ubHknKSB7XG4gICAgcmV0dXJuIGNhY2hlcy5vcGVuKCd0cmFpbnMtZGF0YScpLnRoZW4oZnVuY3Rpb24oY2FjaGUpIHtcbiAgICAgIHJldHVybiBjYWNoZS5tYXRjaChyZXF1ZXN0KS5jYXRjaChmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBlbHNlIHtcbiAgICByZXR1cm4gZmV0Y2gocmVxdWVzdCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgcmV0dXJuIGNhY2hlcy5vcGVuKCd0cmFpbnMtZGF0YScpLnRoZW4oZnVuY3Rpb24oY2FjaGUpIHtcbiAgICAgICAgLy8gY2xlYW4gdXAgdGhlIGltYWdlIGNhY2hlXG4gICAgICAgIFByb21pc2UuYWxsKFtcbiAgICAgICAgICByZXNwb25zZS5jbG9uZSgpLmpzb24oKSxcbiAgICAgICAgICBjYWNoZXMub3BlbigndHJhaW5zLWltZ3MnKVxuICAgICAgICBdKS50aGVuKGZ1bmN0aW9uKHJlc3VsdHMpIHtcbiAgICAgICAgICB2YXIgZGF0YSA9IHJlc3VsdHNbMF07XG4gICAgICAgICAgdmFyIGltZ0NhY2hlID0gcmVzdWx0c1sxXTtcblxuICAgICAgICAgIHZhciBpbWdVUkxzID0gZGF0YS5waG90b3MucGhvdG8ubWFwKGZ1bmN0aW9uKHBob3RvKSB7XG4gICAgICAgICAgICByZXR1cm4gJ2h0dHBzOi8vZmFybScgKyBwaG90by5mYXJtICsgJy5zdGF0aWNmbGlja3IuY29tLycgKyBwaG90by5zZXJ2ZXIgKyAnLycgKyBwaG90by5pZCArICdfJyArIHBob3RvLnNlY3JldCArICdfYy5qcGcnO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gaWYgYW4gaXRlbSBpbiB0aGUgY2FjaGUgKmlzbid0KiBpbiBpbWdVUkxzLCBkZWxldGUgaXRcbiAgICAgICAgICBpbWdDYWNoZS5rZXlzKCkudGhlbihmdW5jdGlvbihyZXF1ZXN0cykge1xuICAgICAgICAgICAgcmVxdWVzdHMuZm9yRWFjaChmdW5jdGlvbihyZXF1ZXN0KSB7XG4gICAgICAgICAgICAgIGlmIChpbWdVUkxzLmluZGV4T2YocmVxdWVzdC51cmwpID09IC0xKSB7XG4gICAgICAgICAgICAgICAgaW1nQ2FjaGUuZGVsZXRlKHJlcXVlc3QpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY2FjaGUucHV0KHJlcXVlc3QsIHJlc3BvbnNlLmNsb25lKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJZZXkgY2FjaGVcIik7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcIk5heSBjYWNoZVwiLCBlcnJvcik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGZsaWNrckltYWdlUmVzcG9uc2UocmVxdWVzdCkge1xuICByZXR1cm4gY2FjaGVzLm9wZW4oJ3RyYWlucy1pbWdzJykudGhlbihmdW5jdGlvbihjYWNoZSkge1xuICAgIHJldHVybiBjYWNoZS5tYXRjaChyZXF1ZXN0KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZmV0Y2gocmVxdWVzdCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBjYWNoZXMub3BlbigndHJhaW5zLWltZ3MnKS50aGVuKGZ1bmN0aW9uKGNhY2hlKSB7XG4gICAgICAgICAgY2FjaGUucHV0KHJlcXVlc3QsIHJlc3BvbnNlKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3lleSBpbWcgY2FjaGUnKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignbmF5IGltZyBjYWNoZScsIGVycm9yKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmNsb25lKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59XG4iXX0=
