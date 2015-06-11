var PapaCSV = {};

(function(my) {
  "use strict";
  my.__type__ = 'papacsv';

  my.fetch = function(dataset) {
    var dfd = DQ.Deferred();
    var config = { complete: _.partial(my._complete, _, dfd, dataset)};

    if (dataset.file) {
      Papa.parse(dataset.file, config);
    } else if (dataset.data) {
      Papa.parse(dataset.data, config);
    } else if (dataset.url) {
      config.download = true;
      Papa.parse(dataset.url, config);
    }
    return dfd.promise;
  };

  my._complete = function(data, dfd, dataset){
    var out = my.extractFields(data.data, dataset);
    out.useMemoryStore = true;
    dfd.resolve(out);
  };

  // Convert array of rows in { records: [ ...] , fields: [ ... ] }
  // @param {Boolean} noHeaderRow If true assume that first row is not a header (i.e. list of fields but is data.
  my.extractFields = function(rows, noFields) {
    if (noFields.noHeaderRow !== true && rows.length > 0) {
      return {
        fields: rows[0],
        records: rows.slice(1)
      }
    } else {
      return {
        records: rows
      }
    }
  };

}(PapaCSV));

// backwards compatability for use in Recline
var recline = recline || {};
recline.Backend = recline.Backend || {};
recline.Backend.PapaCSV = PapaCSV;
