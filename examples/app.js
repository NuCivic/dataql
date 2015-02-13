// Returns accesors
'use strict';

var dataset = [];
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

for(var i = 0; i < 10000; i++ ){
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
    country:
    country,
    lat:lat,
    lon:lon
  });
}




// // Get UK order by id.
// var r = select('country', 'title', 'date', 'id')
//   .from(dataset)
//   .order(function(row){
//     return -row.id;
//   })
//   .where(function(row){
//     return row.country === 'UK';
//   })
//   .limit(0,6)
//   .execute(function(err, data){
//     console.log(data, err);
//   });

// Get count by country.
// var p = select()
//   .from(dataset)
//   .where(function(row){
//     return row.country === 'DE';
//   })
//   .aggregate({method: 'count'})
//   .execute(function(err, data){
//     console.log(data, err);
//   });


// // Get percentage of y by country.
// var k = select('country')
//   .from(dataset)
//   .order(function(row){
//     return -row.id;
//   })
//   .aggregate({field:'y', method: 'percentage', as:'percentage'})
//   .group('country')
//   .execute(function(err, data){
//     console.log(data, err);
//   });

// // Get total of y.
// var k = select('country')
//   .from(dataset)
//   .aggregate({field:'y', method: 'sum', as:'total'})
//   .execute(function(err, data){
//     console.log(data, err);
//   });

// // Get max y
// var k = select('country')
//   .from(dataset)
//   .aggregate({field:'y', method: 'max'})
//   .execute(function(err, data){
//     console.log(data, err);
//   });


// // Get min y
// var k = select('country')
//   .from(dataset)
//   .aggregate({field:'y', method: 'min'})
//   .execute(function(err, data){
//     console.log(data, err);
//   });


// // Get average y by country.
// var k = select('country')
//   .from(dataset)
//   .aggregate({field:'y', method: 'avg'})
//   .group('country')
//   .execute(function(err, data){
//     console.log(data, err);
//   });


// // Get average y by country.
// var k = select('country', 'date')
//   .from(dataset)
//   .group('country')
//   .rename({country: 'pais'})
//   .execute(function(err, data){
//     console.log(data, err);
//   });


var k = select('country', 'date')
  .from({
    url: 'https://docs.google.com/spreadsheet/ccc?key=0Aon3JiuouxLUdGZPaUZsMjBxeGhfOWRlWm85MmV0UUE#gid=0',
    backend:'gdocs'
  })
  .join({
    records:dataset,
    where: function(rowa, rowb){
      console.log(rowa.country, rowb.country, rowa.country === rowb.country);
      console.log(typeof rowa.country);
      console.log(typeof rowb.country);
      return rowa.country === rowb.country;
    }
  })
  .group('country')
  .rename({country: 'pais'})
  .execute(function(err, data){
    console.log(data, err);
  });