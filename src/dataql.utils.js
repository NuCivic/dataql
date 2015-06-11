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