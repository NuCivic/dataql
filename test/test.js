'use strict';

var dataset = [];
var fixed_dataset = [
  {y: 1, country: 'DE'},
  {y: 2, country: 'DE'},
  {y: 3, country: 'AR'},
  {y: 4, country: 'DE'},
  {y: 5, country: 'US'},
  {y: 6, country: 'DK'},
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

// CSV.js
describe('CSV backend', function(){
  it('should retrive and parse remote csv without errors', function(done){
    tables({
      url: 'http://demo.getdkan.com/sites/default/files/us_foreclosures_jan_2012_by_state_0.csv', // jshint ignore:line
      backend:'csv',
      as: 'us_foreclosure',
    })
    .ops([
      {
        method: 'set',
        table: 'us_foreclosure'
      }
    ])
    .commit(function(data){
      var row = _.first(data);
      expect(data).to.be.an('array');
      expect(data).to.have.length(51);
      expect(Object.keys(row)).to.have.length(3);
      done();
    });
  });
});

// PapaParse
describe('PapaParse backend', function(){
  it('should retrive and parse remote csv without errors', function(done){
    tables({
      url: 'http://demo.getdkan.com/sites/default/files/us_foreclosures_jan_2012_by_state_0.csv', // jshint ignore:line
      backend:'papacsv',
      as: 'us_foreclosure'
    })
    .ops([
      {
        method: 'set',
        table: 'us_foreclosure'
      }
    ])
    .commit(function(data){
      var row = _.first(data);
      expect(data).to.be.an('array');
      expect(data).to.have.length(52);
      expect(Object.keys(row)).to.have.length(3);
      done();
    });
  });
});


// Rename
describe('Rename field', function(){
  it('foreclosure.ratio should be renamed as ratio', function(done){
    tables({
      url: 'http://demo.getdkan.com/sites/default/files/us_foreclosures_jan_2012_by_state_0.csv', // jshint ignore:line
      backend:'csv',
      as: 'us_foreclosure',
    })
    .ops([
      {
        method: 'set',
        table: 'us_foreclosure'
      },
      {
        method:'rename',
        oldName: 'foreclosure.ratio',
        newName: 'ratio'
      },
    ])
    .commit(function(data){
      var row = _.first(data);
      expect(data).to.be.an('array');
      expect(Object.keys(row)).to.contain('ratio');
      done();
    });
  });
});


// GroupBy
describe('Group by field', function(){
  it('dataset should be grouped by country field', function(done){
    tables({
      records: fixed_dataset,
      backend:'inline',
      as: 'dummy',
    })
    .ops([
      {
        method: 'set',
        table: 'dummy'
      },
      {
        method:'groupBy',
        field: 'country'
      },
    ])
    .commit(function(data){
      expect(data).to.have.length(4);
      done();
    });
  });
});

// GroupBy
describe('Group by field', function(){
  it('dataset should be grouped by country field', function(done){
    tables({
      records: fixed_dataset,
      backend:'inline',
      as: 'dummy',
    })
    .ops([
      {
        method: 'set',
        table: 'dummy'
      },
      {
        method:'groupBy',
        field: 'country'
      },
    ])
    .commit(function(data){
      expect(data).to.have.length(4);
      done();
    });
  });
});

// Sort
describe('Sort by field', function(){
  it('dataset should be sorted by y field', function(done){
    tables({
      records: fixed_dataset,
      backend:'inline',
      as: 'dummy',
    })
    .ops([
      {
        method: 'set',
        table: 'dummy'
      },
      {
        method:'sort',
        field: 'y',
        order:'desc'
      },
    ])
    .commit(function(data){
      var row = _.first(data);
      expect(row.country).to.be('DK');
      done();
    });
  });
});

// Limit
describe('Limit number of rows', function(){
  it('dataset should be truncated at 2', function(done){
    tables({
      records: fixed_dataset,
      backend:'inline',
      as: 'dummy',
    })
    .ops([
      {
        method: 'set',
        table: 'dummy'
      },
      {
        method:'limit',
        start:0,
        numRows: 2
      },
    ])
    .commit(function(data){
      var row = _.first(data);
      console.log(data);
      expect(data).to.have.length(2);
      done();
    });
  });
});

// Filter
describe('Filter rows by a criteria', function(){
  it('dataset should contain only rows whose country is DE', function(done){
    tables({
      records: fixed_dataset,
      backend:'inline',
      as: 'dummy',
    })
    .ops([
      {
        method: 'set',
        table: 'dummy'
      },
      {
        method:'filter',
        where: {cmp: '=', left: 'country', right: 'DE'}
      },
    ])
    .commit(function(data){
      var row = _.first(data);
      expect(data).to.have.length(3);
      expect(row.country).to.be('DE');
      done();
    });
  });
});
