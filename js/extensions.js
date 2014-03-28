Array.merge = function(arr1, arr2) {
  return [].push.apply(arr1, arr2);
}

localforage.getOrFetch = function(key, fetchAsync, timeout, callback) {
  if (!timeout) { //default lifespan is 5 minutes
    timeout = 5 * 60000;
  }

  return new Promise(function(resolve) {
    localforage.getItem(key, function(cache) {
      if (cache === null || +cache.expires <= +new Date) {
        fetchAsync()
          .then(function(data) {
            localforage.setItem(key, { expires: +new Date + timeout, data: data });
            callback && callback(data);
            resolve(data);
          })
          .catch(function() {
            if (cache && cache.data) {
              resolve(cache.data);
            }
            else {
              reject();
            }
          });
      }
      else {
        callback && callback(cache.data);
        resolve(cache.data);
      }
    });
  });
}

function toggleDropdown(targetId) {
  var target = document.getElementById(targetId);

  if (target.getAttribute("data-state") !== "open") {
    target.setAttribute("data-state", "open");
  }
  else {
    target.setAttribute("data-state", "closed");
  }
}