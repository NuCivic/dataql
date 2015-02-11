<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [DataQL](#dataql)
    - [Quick start](#quick-start)
    - [Create a dataset](#create-a-dataset)
    - [Select fields (select)](#select-fields-select)
    - [Configure dataset (from)](#configure-dataset-from)
    - [Ordering results (order)](#ordering-results-order)
    - [Filter results (where)](#filter-results-where)
    - [Limiting results (limit)](#limiting-results-limit)
    - [Renaming fields (rename)](#renaming-fields-rename)
    - [Statistics! (aggregate)](#statistics-aggregate)
      - [sum](#sum)
      - [Average (avg)](#average-avg)
      - [Percentage (percentage)](#percentage-percentage)
      - [Count things (count)](#count-things-count)
      - [Getting max field value (max)](#getting-max-field-value-max)
      - [Getting max field value (min)](#getting-max-field-value-min)
    - [Remote queries](#remote-queries)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

DataQL
===============================================================================
DataQL bring most useful sql features to javascript in order to manipulate data. 

Often working with visualization involves manipulate data somehow. DataQL provide some useful function to transform using what you know about SQL.

### Quick start

Just add this dependencies:

```html
<script src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
<script src="
https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.1.0/lodash.js"></script>
<script src="
https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min.js"></script>
<script src="https://raw.githubusercontent.com/NuCivic/dataql/master/dist/dataql.min.js"></script>
```

Backbone and jquery dependencies will be removed in the future. However lodash / underscore will be preserved.


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

### Select fields (select)
To select what fields you want to list in your results you just have to pass it as arguments to select function. 

```javascript
var q = select('country', 'title', 'date')
    .from(dataset)
    .execute();
```

### Configure dataset (from)
Remember that you need a dataset to select field from. In order to do that you need to pass a dataset as parameter to the from function.

### Ordering results (order)
Order function allow you pass a predicate as argument to order the dataset. In the following example we order the dataset by id descendent.

```javascript
// Get UK order by id.
var q = select('country', 'title', 'date', 'id')
  .from(dataset)
  .order(function(row){
    return -row.id;
  })
  .execute();
```

### Filter results (where)
Where function is intended to filter those rows we don't want in the result.
In this case we are only getting all the rows where country is equal to `UK`.

```javascript
// Get UK order by id.
var q = select('country', 'title', 'date', 'id')
  .from(dataset)
  .where(function(row){
    return row.country === 'UK';
  })  
  .order(function(row){
    return -row.id;
  })
  .execute();
```

### Limiting results (limit)
You can limit the amount of results usign the limit function. It receive two params: the index where start and the number of rows to retrieve.

``` 
limit(start, numberOfRows);
```

```javascript
// Get UK order by id.
var q = select('country', 'title', 'date', 'id')
  .from(dataset)
  .where(function(row){
    return row.country === 'UK';
  })  
  .order(function(row){
    return -row.id;
  })
  .limit(0, 10)
  .execute();
```

### Renaming fields (rename)
Sometimes we need to change the name's field of each row. To achive that you can invoke the rename function passing a mapping object as argument.

```javascript
// Get UK order by id.
var q = select('country', 'title', 'date', 'id')
  .from(dataset)
  .where(function(row){
    return row.country === 'UK';
  })
  .rename({country:'pais'})
  .order(function(row){
    return -row.id;
  })
  .limit(0, 10)
  .execute();
```

### Statistics! (aggregate)
Aggregate functions perform a calculation on the set of values and returns either an scalar (if you don't use group function) or a result dataset (using group function).

#### sum
Retrive a sum of a field. 

```javascript
// Returns an scalar
var q = select('country')
  .from(dataset)
  .aggregate({field:'y', method: 'sum', as:'total'})
  .execute();

// Returns a dataset grouped by country
var q = select('country')
  .from(dataset)
  .aggregate({field:'y', method: 'sum', as:'total'})
  .group('country')
  .execute();  
```
#### Average (avg)
Retrive the average of a field.

```javascript
// Returns an scalar
var q = select('country')
  .from(dataset)
  .aggregate({field:'y', method: 'avg'})
  .execute();

// Returns a dataset grouped by country
var q = select('country')
  .from(dataset)
  .aggregate({field:'y', method: 'avg'})
  .group('country')
  .execute();  
```

#### Percentage (percentage)
Retrive the percentage of a field grouped by the argument of the group function. This function does not return scalar values.

```javascript
// Return the percentage of the y field by country. 
var q = select('country')
  .from(dataset)
  .aggregate({field:'y', method: 'percentage'})
  .group('country')
  .execute();  
```

#### Count things (count)
Count the number of results.

```javascript
// Returns the number of rows per country.
var q = select('country')
  .from(dataset)
  .aggregate({field:'y', method: 'count'})
  .group('country')
  .execute();  

// Returns the number of rows.
var q = select('country')
  .from(dataset)
  .aggregate({field:'y', method: 'count'})
  .execute();    
```

#### Getting max field value (max)
Get the max of a field.
```javascript
// Returns max y for each country.
var q = select('country')
  .from(dataset)
  .aggregate({field:'y', method: 'max'})
  .group('country')
  .execute();  

// Returns absoulute max y.
var q = select('country')
  .from(dataset)
  .aggregate({field:'y', method: 'max'})
  .execute();    
```

####  Getting max field value (min)
Get the min of a field.

```javascript
// Returns min y for each country.
var q = select('country')
  .from(dataset)
  .aggregate({field:'y', method: 'min'})
  .group('country')
  .execute();  

// Returns absoulute min y.
var q = select('country')
  .from(dataset)
  .aggregate({field:'y', method: 'min'})
  .execute();    
```


### Remote queries
You could run queries against remote backends using recline backends. Currently we support this backends:
- CSV
- GDocs
- CKAN
- ElasticSearch

```javascript
select('country')
  .from({
    url: 'https://docs.google.com/spreadsheet/ccc?key=0Aon3JiuouxLUdGZPaUZsMjBxeGhfOWRlWm85MmV0UUE#gid=0',
    backend: 'gdocs'
  })
  .aggregate({field:'y', method: 'avg'})
  .group('country')
  .execute(function(data){ 
    console.log(data)
  });
```

To run a query against a remote datasource you have to pass and object as argument to the from function and set a callback in the execute function.


