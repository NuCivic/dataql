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

var t1 = {
  url: 'https://docs.google.com/spreadsheet/ccc?key=1UW1uOa7uoLZTC5M7NspVSWZeCUJJJUspY75GAIKzhAw#gid=0', // jshint ignore:line
  backend: 'gdocs',
  as: 'gdocs_example'
};

var t2 = {
  url: 'http://demo.getdkan.com/sites/default/files/us_foreclosures_jan_2012_by_state_0.csv', // jshint ignore:line
  backend: 'csv',
  as: 'csv_example'
};

tables(t1,t2)
.ops([
  {
    method: 'set',
    table: 'gdocs_example'
  },
  {
    method: 'join',
    table: 'csv_example',
    where: {cmp: '=', left:'id', right: 'foreclosure.ratio'}
  },
  // {
  //   method: 'filter',
  //   where: {cmp: '<', left:'id', right: 300}
  // },
  // {
  //   method:'limit',
  //   start: 0,
  //   numRows: 2
  // },
  {
    method:'percentage',
    field: 'x',
    groupBy: 'country'
  },
  {
    method:'rename',
    oldName: 'id',
    newName: 'uid'
  },
  // {
  //   method:'groupBy',
  //   field: 'country'
  // },
  {
    method:'delete',
    field: 'date'
  },
  {
    method:'add',
    field: 'extraido',
    type: 'column',
    from: {
      type: 'row',
      table: 'gdocs_example',
      field: 'country',
      from: 1,
      to: 5
    }
  }
])
.execute(function(data){
  console.log(data);
});
