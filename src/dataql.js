/*jshint -W030 */

;(function(global){
  'use strict';

  /**
   * DataQL constructor
   */
  function DataQL(){
    var self = this;

    self._tables = [];
    self._operations = [];
    self._result = [];
  }

  /**
   * Comparators
   */
  DataQL.operators = {};

  // Equal
  DataQL.operators['='] = function(operand1, operand2) {
    return operand1 == operand2; // jshint ignore:line
  };

  // Greater than
  DataQL.operators['>'] = function(operand1, operand2) {
    return operand1 > operand2;
  };

  // Lower than
  DataQL.operators['<'] = function(operand1, operand2) {
    return operand1 < operand2;
  };

  // Greater or equal than
  DataQL.operators['>='] = function(operand1, operand2) {
    return operand1 >= operand2;
  };

  // Lower or equal than
  DataQL.operators['<='] = function(operand1, operand2) {
    return operand1 <= operand2;
  };

  /**
   * Get operator from string
   */
  DataQL.prototype._normalizeTable = function(table) {
    var self = this;

    // Test if records is properly formated as objects.
    if(_.first(table.records) instanceof Map)
      return table;

    // If not, Convert records to object.
    table.records = _.map(table.records, function(record){
      return self.toMap(table.fields, record);
    });

    return table;
  };

  /**
   * Creates a map set
   */
  DataQL.prototype.toMap = function(fields, values) {
    var map = new Map();

    for (var i = 0, length = values.length ; i < length; i++) {
      map.set(fields[i], values[i]);
    };

    return map;
  };

  /**
   * Get operator from string
   */
  DataQL.prototype._getCmp = function(cmp) {
    if(!_.isFunction(DataQL.operators[cmp]))
      throw new Error('Operator not supported');
    return DataQL.operators[cmp];
  };

  /**
   * Join tables
   */
  DataQL.prototype._join = function(resources, result, params){
    var self = this;
    var toJoin = [];
    var cmp = self._getCmp(params.where.cmp);

    if(_.has(resources, params.table)){
      toJoin = resources[params.table].records;
    }

    return _.map(result, function(resultRecord){

      // Get all the matched elements on the join table
      var matched = _.filter(toJoin, function(joinRecord){
        return cmp(
          resultRecord.get(params.where.left),
          joinRecord.get(params.where.right)
        );
      });

      // Extend results with the join table.
      // Like other sql databases we only use the first
      // matched element.
      return _.extend(resultRecord, _.first(matched));
    });
  };

  /**
   * Set table
   */
  DataQL.prototype._set = function(resources, result, params){
    if(!_.has(resources, params.table))
      throw new Error('Table not fetched. Fetch and name the table before set.');
    return resources[params.table].records;
  };

  /**
   * Filter rows (aka. sql where)
   */
  DataQL.prototype._filter = function(resources, result, params){
    var self = this;
    var cmp = self._getCmp(params.where.cmp);

    return _.filter(result, function(record){
      return cmp(record.get(params.where.left), params.where.right);
    });
  };

  /**
   * Limit
   */
  DataQL.prototype._limit = function(resources, result, params){
    return result.slice(params.start, params.start + params.numRows);
  };

  /**
   * Sort by order
   */
  DataQL.prototype._sort = function(resources, result, params){
    var order = (params.order === 'desc') ? false : true;
    var field = params.field;

    return result.sort(function (a, b) {
      if(order) {
        if(a.get(field) < b.get(field)) return -1;
        if(a.get(field) > b.get(field)) return 1;
      } else {
        if(a.get(field) > b.get(field)) return -1;
        if(a.get(field) < b.get(field)) return 1;
      }
      return 0;
    });
  };

  /**
   * Rename a column
   */
  DataQL.prototype._rename = function(resources, result, params){
    return _.map(result, function(record){
      record.set(params.newName, record.get(params.oldName));
      record.delete(params.oldName);
      return record;
    });
  };

  /**
   * Delete a column
   */
  DataQL.prototype._delete = function(resources, result, params){
    return _.map(result, function(record){
      record.delete(params.field);
      return record;
    });
  };

  /**
   * Add columns or rows
   */
  DataQL.prototype._add = function(resources, result, params){
    var self = this;
    var method = (params.type === 'column')
      ? 'addColumn'
      : 'addRow';

    return self['_' + method](resources, result, params);
  };

  /**
   * Add column
   */
  DataQL.prototype._addColumn = function(resources, result, params){
    var self = this;
    var values = self._range(resources, result, params.from);

    return _.map(result, function(record, index){
      record.set(params.field, values[index]);
      return record;
    });
  };

  /**
   * Add row
   */
  DataQL.prototype._addRow = function(resources, result, params){
    var self = this;
    var values = self._range(resources, result, params.from);
    var fields = _.first(result).keys();

    result.push(self.toMap(Array.from(fields), values));

    return result;
  };

  /**
   * Group by field
   */
  DataQL.prototype._groupBy = function(resources, result, params){
    var grouped = _.values(_.groupBy(result, params.field));
    return _.map(grouped, function(record){
      return record[0];
    });
  };

  /**
   * Create a vector either from a row or a column.
   * Unlike other function this recieve only resources
   * and params as parameters because it's a helper
   * function and intended to be piped.
   */
  DataQL.prototype._range = function(resources, result, params){
    var self = this;
    var method = (params.type === 'column')
      ? 'vectorFromColumns'
      : 'vectorFromRows';

    return self['_' + method](resources, params);
  };

  /**
   * Create a vector from a columns
   */
  DataQL.prototype._vectorFromColumns = function(resources, params){
    // TODO: Add match pattern to match column names.
    var record = resources[params.table].records[params.row];
    var result = [];
    var index = 0;

    // Loop over the records and store those
    // satisfy the condition
    record.forEach(function(value, key){
      if(index >= params.from || index <= params.to){
        result.push(value);
      }
      ++index;
    });
    return result;
  };

  /**
   * Create a vector from row
   */
  DataQL.prototype._vectorFromRows = function(resources, params){
    var records = resources[params.table].records;

    return _.reduce(records, function(acum, record, index) {
      if(index >= params.from && index <= params.to)
        acum.push(record.get(params.field));
      return acum;
    }, []);
  };

  /**
   * Run operations
   */
  DataQL.prototype._runOps = function(){
    var self = this;

    _.each(self._operations, function(op){
      self._result = self['_' + op.method](
        self._resources,
        self._result,
        _.omit(op, 'method')
      );
    });

    return self;
  };

  /**
   * Get a backend from its string representation.
   * @param  {String} backend  Backend string representation.
   */
  DataQL.prototype._backendFromString = function(backend) {
    return _.findWhere(recline.Backend, {__type__: backend});
  };

  /**
   * Fetch all the tables and place them into sources
   */
  DataQL.prototype._fetchResources = function(){
    var self = this;
    var promises = [];

    _.each(self._tables, function(table){
      var backend = self._backendFromString(table.backend);

      if(!backend) throw new Error('Backend not found');

      promises.push(backend.fetch(table));
    });

    return $.when.apply($, promises);
  };


  /**********************
  *                     *
  *     AGGREGATIONS    *
  *                     *
  **********************/

  /**
   * Sum a field grouped by any field.
   */
  DataQL.prototype._sum = function(resources, result, params){
    var self = this;

    return _.values(_.reduce(result, function(acum, record, index) {
      var gb = record.get(params.groupBy);
      var f = params.field;
      var as = params.as || f;
      var current = Number(record.get(f));

      if (gb in acum) {
        acum[gb].set(as, Number(acum[gb].get(as)) + current);
      } else {
        acum[gb] = record;
        acum[gb].set(as, current);
      }
      return acum;
    }, {}));
  };

  /**
   * Avg of a field grouped by any field.
   */
  DataQL.prototype._avg = function(resources, result, params){
    var self = this;
    var f = params.field;
    var as = params.as || 'avg';
    var previous;

    var precomputed = _.values(_.reduce(result, function(acum, record, index) {
      var gb = record.get(params.groupBy);
      var current = Number(record.get(f));

      if (gb in acum) {
        previous = Number(acum[gb].get(f));
        acum[gb].set('__total', Number(acum[gb].get('__total')) + current);
        acum[gb].set('__count', previous + 1);
      } else {
        acum[gb] = record;
        acum[gb].set('__total', current);
        acum[gb].set('__count', 1);
      }
      return acum;
    }, {}));

    return _.map(precomputed, function(record, index) {
      record.set(as, record.get('__total') / record.get('__count'));
      record.delete('__total');
      record.delete('__count');
      return record;
    });
  };

  /**
   * Percentage of a field grouped by any field.
   */
  DataQL.prototype._percentage = function(resources, result, params){
    var self = this;
    // IMPLEMENT
  };

  /**
   * Max of a field grouped by any field.
   */
  DataQL.prototype._max = function(resources, result, params){
    var self = this;

    return _.values(_.reduce(result, function(acum, record, index) {
      var gb = record.get(params.groupBy);
      var f = params.field;
      var as = params.as || f;
      var current = Number(record.get(f));
      var previous;

      if (gb in acum) {
        previous = Number(acum[gb].get(as));
        if (current > previous) {
          acum[gb].set(as, current);
        }
      } else {
        acum[gb] = record;
        acum[gb].set(as, current);
      }
      return acum;
    }, {}));
  };

  /**
   * Min of a field grouped by any field.
   */
  DataQL.prototype._min = function(resources, result, params){
    var self = this;

    return _.values(_.reduce(result, function(acum, record, index) {
      var gb = record.get(params.groupBy);
      var f = params.field;
      var as = params.as || f;
      var current = Number(record.get(f));
      var previous;

      if (gb in acum) {
        previous = Number(acum[gb].get(as));
        if (current < previous) {
          acum[gb].set(as, current);
        }
      } else {
        acum[gb] = record;
        acum[gb].set(as, current);
      }
      return acum;
    }, {}));
  };

  /**
   * Min of a field grouped by any field.
   */
  DataQL.prototype._count = function(resources, result, params){
    var self = this;

    return _.values(_.reduce(result, function(acum, record, index) {
      var gb = record.get(params.groupBy);
      var as = params.as || 'count';
      var previous;

      if (gb in acum) {
        previous = Number(acum[gb].get(as));
        acum[gb].set(as, previous + 1);
      } else {
        acum[gb] = record;
        acum[gb].set(as, 1);
      }
      return acum;
    }, {}));
  };


  /**********************
  *                     *
  *     PUBLIC API      *
  *                     *
  **********************/

  /**
   * Define the tables do you want to use.
   * Use the recline format to define backends.
   */
  DataQL.prototype.tables = function(){
    var self = this;

    if(self instanceof DataQL){

      // Fetched resources indexed by name
      self._resources = {};

      // Tables to retrieve
      self._tables = _.toArray(arguments);
      return self;
    } else {
      var ql = new DataQL();
      return ql.tables.apply(ql, _.toArray(arguments));
    }

    return self;
  };

  /**
   * Add an operation to the queue.
   */
  DataQL.prototype.ops = function(ops){
    var self = this;
    self._operations = ops;
    return self;
  };

  /**
   * Perform the query.
   */
  DataQL.prototype.execute = function(cb){
    var self = this;
    var tableNames = _.pluck(self._tables, 'as');

    self._fetchResources().done(function(){

      // FIX ME: this could be removed transforming
      // how csv parser works by returning maps
      // instead of objects.
      var normalized = _.map(
        _.toArray(arguments),
        self._normalizeTable,
        self
      );
      self._resources = _.zipObject(tableNames, normalized);
      self._runOps();
      cb(self._result);
    });
  };

  // Expose dataql constructor
  global.DataQL = DataQL;
  global.tables = DataQL.prototype.tables;
})(window);