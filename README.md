[![Build Status](https://travis-ci.org/NuCivic/dataql.svg?branch=master)](https://travis-ci.org/NuCivic/dataql)
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

DataQL
===============================================================================
DataQL is a library to transform data using a storable format.

### Quick start

Just add this dependencies:

```html
<script src="
https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.1.0/lodash.js"></script>
<script src="http://rawgit.com/NuCivic/dataql/master/dist/dataql.min.js"></script>
```


### Create a dataset
```javascript
// Returns accesors
'use strict';
var dataset;

/* jshint ignore:start */
dataset = [
  {id: 0, date: '2011-01-01', x: 1, y: 210, z: 1, country: 'DE', title: 'first', lat:52.56, lon:13.40},
  {id: 1, date: '2011-02-02', x: 2, y: 312, z: 1, country: 'UK', title: 'second', lat:54.97, lon:-1.60},
  {id: 2, date: '2011-03-03', x: 3, y: 645, z: 1, country: 'US', title: 'third', lat:40.00, lon:-75.5},
  {id: 3, date: '2011-04-04', x: 4, y: 123, z: 2, country: 'DE', title: 'fourth', lat:57.27, lon:-6.20}
];
/* jshint ignore:end */
```


### Query format

```javascript
  tables({...}, {...}, ...)
    .ops([...])
    .commit(function(data){
      ...
    });
```

### Tables
DataQL provides several backends to consume data. Most of them and heavly based on recline.js backends. 

All the backends requires at least two parameters:

- backend: backend id string
- as: a name that dataql will use to store this resource. This param allow you to reference that table in the operations
- Depends on which backend you need to use, more parameters would be needed.

```javascript
var query = tables({
  url: 'http://demo.getdkan.com/sites/default/files/us_foreclosures_jan_2012_by_state_0.csv', // jshint ignore:line
  backend:'csv',
  as: 'us_foreclosure',
});
```

### Transforms
An array of transforms to be run over the data. 

```javascript
var query = tables({
  url: 'http://demo.getdkan.com/sites/default/files/us_foreclosures_jan_2012_by_state_0.csv', // jshint ignore:line
  backend:'csv',
  as: 'us_foreclosure',
}).transform([

]);
```


