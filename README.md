<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents** 

- [DataQL](#dataql)
    - [Create a dataset](#create-a-dataset)
    - [select](#select)
    - [from](#from)
    - [order](#order)
    - [where](#where)
    - [limit](#limit)
    - [rename](#rename)
    - [aggregate](#aggregate)
      - [sum](#sum)
      - [avg](#avg)
      - [percentage](#percentage)
      - [count](#count)
      - [max](#max)
      - [min](#min)
    - [Remote queries](#remote-queries)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

DataQL
===============================================================================
DataQL bring most useful sql features to javascript in order to manipulate data. 

Often working with visualization involves manipulate data somehow. DataQL provide some useful function to transform using what you know about SQL.

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
```

### select
To select what fields you want to list in your results you just have to pass it as arguments to select function. 

```javascript
var q = select('country', 'title', 'date')
    .from(dataset)
    .execute();
```

### from
Remember that you need a dataset to select field from. In order to do that you need to pass a dataset as parameter to the from function.

### order
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

### where
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

### limit
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

### rename
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

### aggregate
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
#### avg
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

#### percentage
Retrive the percentage of a field grouped by the argument of the group function. This function does not return scalar values.

```javascript
// Return the percentage of the y field by country. 
var q = select('country')
  .from(dataset)
  .aggregate({field:'y', method: 'percentage'})
  .group('country')
  .execute();  
```

#### count
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

#### max
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

#### min
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


