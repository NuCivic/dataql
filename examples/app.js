// Returns accesors
'use strict';
var dataset;

/* jshint ignore:start */
dataset = [
  {id: 0, date: '2011-01-01', x: 1, y: 210, z: 1, country: 'DE', title: 'first', lat:52.56, lon:13.40},
  {id: 1, date: '2011-02-02', x: 2, y: 312, z: 1, country: 'UK', title: 'second', lat:54.97, lon:-1.60},
  {id: 2, date: '2011-03-03', x: 3, y: 645, z: 1, country: 'US', title: 'third', lat:40.00, lon:-75.5},
  {id: 3, date: '2011-04-04', x: 4, y: 123, z: 2, country: 'DE', title: 'fourth', lat:57.27, lon:-6.20},
  {id: 4, date: '2011-05-04', x: 5, y: 756, z: 2, country: 'UK', title: 'fifth', lat:51.58, lon:0},
  {id: 6, date: '2011-06-02', x: 6, y: 132, z: 2, country: 'US', title: 'sixth', lat:51.04, lon:7.9},
  {id: 7, date: '2011-06-02', x: 6, y: 345, z: 2, country: 'UB', title: 'sixth', lat:51.04, lon:7.9},
  {id: 9, date: '2011-06-02', x: 6, y: 384, z: 2, country: 'UC', title: 'sixth', lat:51.04, lon:7.9},
  {id: 10, date: '2011-05-02', x: 6, y: 549, z: 2, country: 'UD', title: 'sixth', lat:51.04, lon:7.9},
  {id: 11, date: '2011-07-02', x: 6, y: 490, z: 2, country: 'UE', title: 'sixth', lat:51.04, lon:7.9},
  {id: 12, date: '2011-05-02', x: 6, y: 423, z: 2, country: 'UF', title: 'sixth', lat:51.04, lon:7.9},
  {id: 13, date: '2011-03-03', x: 6, y: 567, z: 2, country: 'UG', title: 'sixth', lat:51.04, lon:7.9},
  {id: 14, date: '2011-02-02', x: 6, y: 876, z: 2, country: 'UH', title: 'sixth', lat:51.04, lon:7.9},
  {id: 15, date: '2011-01-01', x: 6, y: 341, z: 2, country: 'UI', title: 'sixth', lat:51.04, lon:7.9},
  {id: 16, date: '2011-05-04', x: 6, y: 965, z: 2, country: 'UJ', title: 'sixth', lat:51.04, lon:7.9},
  {id: 17, date: '2011-06-02', x: 6, y: 342, z: 2, country: 'UK', title: 'sixth', lat:51.04, lon:7.9},
  {id: 18, date: '2011-07-02', x: 6, y: 876, z: 2, country: 'UL', title: 'sixth', lat:51.04, lon:7.9},
  {id: 19, date: '2011-06-02', x: 6, y: 765, z: 2, country: 'US', title: 'sixth', lat:51.04, lon:7.9}
];
/* jshint ignore:end */

// Get UK order by id.
var r = select('country', 'title', 'date', 'id')
  .from(dataset)
  .order(function(row){
    return -row.id;
  })
  .where(function(row){
    return row.country === 'UK';
  })
  .limit(0,6)
  .execute();

console.log(r);

// Get count by country.
var p = select()
  .from(dataset)
  .where(function(row){
    return row.country === 'DE';
  })
  .aggregate({method: 'count'})
  .execute();

console.log(p);

// Get percentage of y by country.
var k = select('country')
  .from(dataset)
  .order(function(row){
    return -row.id;
  })
  .aggregate({field:'y', method: 'percentage', as:'percentage'})
  .group('country')
  .execute();

console.log(k);


// Get total of y.
var k = select('country')
  .from(dataset)
  .aggregate({field:'y', method: 'sum', as:'total'})
  .execute();

// Get max y
var k = select('country')
  .from(dataset)
  .aggregate({field:'y', method: 'max'})
  .execute();

console.log(k);

// Get min y
var k = select('country')
  .from(dataset)
  .aggregate({field:'y', method: 'min'})
  .execute();

console.log(k);

// Get average y by country.
var k = select('country')
  .from(dataset)
  .aggregate({field:'y', method: 'avg'})
  .group('country')
  .execute();

console.log(k);

// Get average y by country.
var k = select('country', 'date')
  .from(dataset)
  .group('country')
  .rename({country: 'pais'})
  .execute();

console.log(k);
