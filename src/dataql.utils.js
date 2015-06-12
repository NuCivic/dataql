/*jshint -W030 */

;(function(global){
  'use strict';

  var castMap = {
    'string': String,
    'boolean': Boolean,
    'number': Number,
    'date': Date,
    'integer': parseInt,
    'float': parseFloat
  };

  DQ.__jsonp_unique = 0;

  /**
   * Ajax calls using promises.
   * From https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
   */
  DQ.trim = function(text){
    return text.replace(/^\s+|\s+$/gm,'');
  };

  DQ.cast = function(value, type){
    var rest = _.drop(_.toArray(arguments), 2);
    return castMap[type].apply(null, [value].concat(rest));
  };

  /**
   * Ajax calls using promises.
   * From https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
   */
  DQ.ajax = function(url){

    // A small example of object
    var core = {

      // Method that performs the ajax request
      ajax : function (method, url, args) {

        // Creating a promise
        var promise = new Promise( function (resolve, reject) {

          // Instantiates the XMLHttpRequest
          var client = new XMLHttpRequest();
          var uri = url;

          if (args && (method === 'POST' || method === 'PUT')) {
            uri += '?';
            var argcount = 0;
            for (var key in args) {
              if (args.hasOwnProperty(key)) {
                if (argcount++) {
                  uri += '&';
                }
                uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
              }
            }
          }

          client.open(method, uri);
          client.send();

          client.onload = function () {
            if (this.status == 200) {
              // Performs the function "resolve" when this.status is equal to 200
              resolve(this.response);
            } else {
              // Performs the function "reject" when this.status is different than 200
              reject(this.statusText);
            }
          };
          client.onerror = function () {
            reject(this.statusText);
          };
        });

        // Return the promise
        return promise;
      }
    };

    // Adapter pattern
    return {
      'get' : function(args) {
        return core.ajax('GET', url, args);
      },
      'post' : function(args) {
        return core.ajax('POST', url, args);
      },
      'put' : function(args) {
        return core.ajax('PUT', url, args);
      },
      'delete' : function(args) {
        return core.ajax('DELETE', url, args);
      }
    };
  }

  /**
   * Gets a cross-domain json
   * @param  {String} url
   * @return {Promise}
   * https://gist.github.com/132080/110d1b68d7328d7bfe7e36617f7df85679a08968
   */
  DQ.jsonp = function(url, error_timeout) {
    var promise = new Promise( function (resolve, reject) {

      var name = '_jsonp_' + DQ.__jsonp_unique++;
      var paramGlue = url.match(/\?/) ? '&' : '?';
      var script;
      var timeout;

      // Append callback function to the url
      url +=  paramGlue + 'callback=' + name;

      // Create script
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;

      timeout = setTimeout(function(){
        reject({error: 'Request timeout'});
      }, error_timeout || 5000);

      // Setup handler
      window[name] = function(data){
        resolve(data);
        window.clearTimeout(timeout);
        document.getElementsByTagName('head')[0].removeChild(script);
        script = null;
        delete window[name];
      };

      // Load JSON
      document.getElementsByTagName('head')[0].appendChild(script);
    });
    return promise;
  }

  /**
   * Deferred polyfill
   * From https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred
   */
  DQ.Deferred = function () {
    if (Promise && Promise.defer) {
      return Promise.defer();
    } else if (PromiseUtils && PromiseUtils.defer) {
      return PromiseUtils.defer();
    } else {
      try {
        this.resolve = null;
        this.reject = null;

        this.promise = new Promise(function(resolve, reject) {
          this.resolve = resolve;
          this.reject = reject;
        }.bind(this));
        Object.freeze(this);
      } catch (ex) {
        throw new Error('Promise/Deferred is not available');
      }
    }
  }

})(window);