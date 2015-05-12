'use strict';

var dataset = [];
var fixed_dataset = [
  {y: 1, country: 'DE'},
  {y: 1, country: 'DE'},
  {y: 2, country: 'AR'},
  {y: 2, country: 'DE'},
  {y: 2, country: 'US'},
  {y: 2, country: 'DK'},
];

var countries = ['DE', 'UK', 'US', 'AR', 'BR', 'CL', 'RU', 'RO', 'AF', 'AU'];
var country;
var lat;
var lon;
var x;
var y;
var date;

function randomDate(start, end) {
  var dt = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(dt);
}

for(var i = 0; i < 100; i++ ){
  country = _.sample(countries);
  date = randomDate(new Date(2050, 0, 1), new Date());
  lat = _.random(-90, 90);
  lon = _.random(-180, 180, true);
  x = _.random(0, 300);
  y = _.random(0, 300);
  dataset.push({
    id: i,
    date: date,
    x: x,
    y: y,
    country: country,
    lat: lat,
    lon: lon,
    extra: country
  });
}

// PapaParse
describe('PapaParse backend', function(){
  it('should retrive and parse remote csv without errors', function(done){
    tables({
      url: 'http://demo.getdkan.com/sites/default/files/us_foreclosures_jan_2012_by_state_0.csv', // jshint ignore:line
      backend:'papacsv',
      as: 'us_foreclosure',
      skipEmptyLines: true
    })
    .ops([
      {
        method: 'set',
        table: 'us_foreclosure'
      }
    ])
    .execute(function(data){
      var row = _.first(data);
      expect(data).to.be.an('array');
      expect(data).to.have.length(52);
      expect(Object.keys(row)).to.have.length(3);
      done();
    });
  });
});

// Gdocs backend
describe('Gdocs backend', function(){
  it('should retrive and parse a google spreadsheet without errors', function(done){ // jshint ignore:line

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {

      if (xhr.readyState == XMLHttpRequest.DONE ) {
        console.log(xhr.status);
        if(xhr.status == 200){
          console.log(xhr.responseText);
        } else if(xhr.status == 400) {
          console.log('There was an error 400');
        } else {
          console.log('something else other than 200 was returned');
        }

        done();
      }
    }

    xhr.open("GET", "http://docs.google.com/spreadsheet/ccc?key=0Aon3JiuouxLUdGZPaUZsMjBxeGhfOWRlWm85MmV0UUE#gid=0", true);

    xhr.send();

    // tables({
    //   url: 'https://docs.google.com/spreadsheet/ccc?key=0Aon3JiuouxLUdGZPaUZsMjBxeGhfOWRlWm85MmV0UUE#gid=0', // jshint ignore:line
    //   backend:'gdocs',
    //   as: 'gdocs_example'
    // })
    // .ops([
    //   {
    //     method: 'set',
    //     table: 'gdocs_example'
    //   },
    //   // {
    //   //   method: 'rename',
    //   //   oldName: 'country',
    //   //   newName: 'pais'
    //   // }
    // ])
    // .execute(function(data){
    //   done();
    // });
  });
});

// // CSV.js
// describe('CSV backend', function(){
//   it('should retrive and parse remote csv without errors', function(done){
//     select('state', 'total.foreclosures')
//     .from({
//       url: 'http://demo.getdkan.com/sites/default/files/us_foreclosures_jan_2012_by_state_0.csv', // jshint ignore:line
//       backend:'csv'
//     })
//     .execute(function(err, data){
//       var row = _.first(data);
//       expect(data).to.be.an('array');
//       expect(data).to.have.length(51);
//       expect(Object.keys(row)).to.have.length(2);
//       done();
//     });
//   });
// });

// // Rename
// describe('Rename field', function(){
//   it('state should be renamed as province', function(done){
//     select('state', 'total.foreclosures')
//     .rename({state:'province'})
//     .from({
//       url: 'http://demo.getdkan.com/sites/default/files/us_foreclosures_jan_2012_by_state_0.csv', // jshint ignore:line
//       backend:'csv'
//     })
//     .execute(function(err, data){
//       var row = _.first(data);
//       expect(data).to.be.an('array');
//       expect(data).to.have.length(51);
//       expect(Object.keys(row)).to.have.length(2);
//       expect(Object.keys(row)).to.have.contain('province');
//       done();
//     });
//   });
// });

// // Join
// describe('Join datasets', function(){
//   it('should join two datasets successfully', function(done){
//     select('id', 'country', 'x', 'extra')
//     .from({
//       records: dataset, // jshint ignore:line
//       backend:'inline'
//     })
//     .join({
//       url: 'http://demo.getdkan.com/sites/default/files/us_foreclosures_jan_2012_by_state_0.csv', // jshint ignore:line
//       backend:'csv',
//       where: function(rowa, rowb){
//         return rowa.country.trim() === rowb.country.trim();
//       }
//     })
//     .execute(function(err, data){
//       var row = _.first(data);
//       expect(data).to.be.an('array');
//       expect(data).to.have.length(100);
//       expect(Object.keys(row)).to.have.length(4);
//       done();
//     });
//   });
// });

// // Average
// describe('Aggregate avg', function(){
//   it('should compute the collection avg grouped by country without errors', function(done){ // jshint ignore:line
//     select('country')
//     .from({
//       records: fixed_dataset, // jshint ignore:line
//       backend:'inline'
//     })
//     .order(function(row){
//       return -row.id;
//     })
//     .aggregate({field:'y', method: 'avg', as:'avg'})
//     .group('country')
//     .execute(function(err, data){
//       var row = _.findWhere(data, {country: 'US'});
//       expect(row.avg).to.be(2);
//       expect(data).to.be.an('array');
//       expect(data).to.have.length(4);
//       done();
//     });
//   });
// });

// // Percentage
// describe('Aggregate percentage', function(){
//   it('should compute the collection percentage grouped by country without errors', function(done){ // jshint ignore:line
//     select('country')
//     .from({
//       records: fixed_dataset, // jshint ignore:line
//       backend:'inline'
//     })
//     .order(function(row){
//       return -row.id;
//     })
//     .aggregate({field:'y', method: 'percentage', as:'percentage'})
//     .group('country')
//     .execute(function(err, data){
//       console.log(data);
//       var row = _.findWhere(data, {country: 'US'});
//       expect(row.percentage).to.be(0.2);
//       expect(data).to.be.an('array');
//       expect(data).to.have.length(4);
//       done();
//     });
//   });
// });


// // Count
// describe('Aggregate count', function(){
//   it('should compute the collection count grouped by country without errors', function(done){ // jshint ignore:line
//     select('country')
//     .from({
//       records: fixed_dataset, // jshint ignore:line
//       backend:'inline'
//     })
//     .order(function(row){
//       return -row.id;
//     })
//     .aggregate({field:'y', method: 'count', as:'count'})
//     .group('country')
//     .execute(function(err, data){
//       var row = _.findWhere(data, {country: 'DE'});
//       expect(row.count).to.be(3);
//       expect(data).to.be.an('array');
//       expect(data).to.have.length(4);
//       done();
//     });
//   });
// });

