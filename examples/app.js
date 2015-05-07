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
    lon:lon,
    extra:'mariano'
  });
}

var ql = new DataQL();
var t1 = {
  url: 'https://docs.google.com/spreadsheet/ccc?key=1UW1uOa7uoLZTC5M7NspVSWZeCUJJJUspY75GAIKzhAw#gid=0', // jshint ignore:line
  backend: 'gdocs',
  as: 'gdocs_example'
};
var t2 = {
  url: 'https://docs.google.com/spreadsheet/ccc?key=0Aon3JiuouxLUdGZPaUZsMjBxeGhfOWRlWm85MmV0UUE#gid=0', // jshint ignore:line
  backend: 'gdocs',
  as: 'gdocs_extra_example'
};

ql
.tables(t1,t2)
.op({method:'set', table: 'gdocs_example'})
.op({
  method:'join',
  table: 'gdocs_extra_example',
  where: {cmp: '=', left:'id', right: 'id'}
})
.op({
  method:'filter',
  where: {cmp: '=', left:'id', right: 1}
})
.execute();
