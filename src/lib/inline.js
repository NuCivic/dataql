var Inline = {};

// Note that provision of jQuery is optional (it is **only** needed if you use fetch on a remote file)
(function(my) {
  "use strict";
  my.__type__ = 'inline';

  my.fetch = function(dataset) {
    var dfd = DQ.Deferred();
    dfd.resolve(dataset);
    return dfd.promise;
  };

}(Inline));

// backwards compatability for use in Recline
var recline = recline || {};
recline.Backend = recline.Backend || {};
recline.Backend.Inline = Inline;