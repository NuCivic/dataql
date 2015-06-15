var DQ = DQ || {};
DQ.backends = DQ.backends || {};
DQ.backends.XLSX = {};

(function(my) {
  "use strict";
  my.__type__ = 'xlsx';

  my.fetch = function(dataset) {

    var dfd = DQ.Deferred();
    DQ.ajax(dataset.url)
    .get({responseType: 'arraybuffer'})
    .then(function(d) {
      var out = {};
      var data = new Uint8Array(d);
      var arr = new Array();
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join('');
      var workbook = XLSX.read(bstr, {type:"binary"});
      out.fields = my.extractFields(workbook.Sheets[dataset.sheet]);
      out.records = my.extractData(workbook.Sheets[dataset.sheet], out.fields);
      dfd.resolve(out);
    });

    return dfd.promise;
  };

  my.extractFields = function(sheet){
    var headers = [];
    var range = XLSX.utils.decode_range(sheet['!ref']);
    var C, R = range.s.r;

    for(C = range.s.c; C <= range.e.c; ++C) {
        var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})];
        var hdr = "UNKNOWN " + C;
        if(cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
    }
    return headers;
  }

  my.extractData = function(sheet, headers) {
    var result = [];
    var range = XLSX.utils.decode_range(sheet['!ref']);
    var row = {};
    var C, R, value;

    for(R = range.s.r + 1; R <= range.e.r; ++R) {
      row = {};
      for(C = range.s.c; C <= range.e.c; ++C) {
        var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})];
        if(cell && cell.t) value = XLSX.utils.format_cell(cell);
        row[headers[C]] = value;
      }
      result.push(row);
    }
    return result;
  }
}(DQ.backends.XLSX));


