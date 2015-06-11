/*jshint -W030 */

;(function(global){
  'use strict';

  /**
   * DataQL constructor
   */
  function DQ(){
    var self = this;

    self._tables = [];
    self._operations = [];
    self._result = [];
  }

  /**
   * Comparators
   */
  DQ.operators = {};

  // Equal
  DQ.operators['='] = function(operand1, operand2) {
    return operand1 == operand2; // jshint ignore:line
  };

  // Greater than
  DQ.operators['>'] = function(operand1, operand2) {
    return operand1 > operand2;
  };

  // Lower than
  DQ.operators['<'] = function(operand1, operand2) {
    return operand1 < operand2;
  };

  // Greater or equal than
  DQ.operators['>='] = function(operand1, operand2) {
    return operand1 >= operand2;
  };

  // Lower or equal than
  DQ.operators['<='] = function(operand1, operand2) {
    return operand1 <= operand2;
  };

  /**
   * Get operator from string
   */
  DQ.prototype._getCmp = function(cmp) {
    if(!_.isFunction(DQ.operators[cmp]))
      throw new Error('Operator not supported');
    return DQ.operators[cmp];
  };

  /**
   * Join tables
   */
  DQ.prototype._join = function(resources, result, params){
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
          resultRecord[params.where.left],
          joinRecord[params.where.right]
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
  DQ.prototype._set = function(resources, result, params){
    if(!_.has(resources, params.table))
      throw new Error('Table not fetched. Fetch and name the table before set.');
    return resources[params.table].records;
  };

  /**
   * Filter rows (aka. sql where)
   */
  DQ.prototype._filter = function(resources, result, params){
    var self = this;
    var cmp = self._getCmp(params.where.cmp);

    return _.filter(result, function(record){
      return cmp(record[params.where.left], params.where.right);
    });
  };

  /**
   * Limit
   */
  DQ.prototype._limit = function(resources, result, params){
    return result.slice(params.start, params.start + params.numRows);
  };

  /**
   * Sort by order
   */
  DQ.prototype._sort = function(resources, result, params){
    var order = (params.order === 'desc') ? false : true;
    var field = params.field;
    return _.sortByOrder(result, field, order);
  };

  /**
   * Rename a column
   */
  DQ.prototype._rename = function(resources, result, params){
    return _.map(result, function(record){
      record[params.newName] = record[params.oldName];
      return _.omit(record, params.oldName);
    });
  };

  /**
   * Delete a column
   */
  DQ.prototype._delete = function(resources, result, params){
    return _.map(result, function(record){
      return _.omit(record, params.field);
    });
  };

  /**
   * Add columns or rows
   */
  DQ.prototype._add = function(resources, result, params){
    var self = this;
    var method = (params.type === 'column')
      ? 'addColumn'
      : 'addRow';

    return self['_' + method](resources, result, params);
  };

  /**
   * Add column
   */
  DQ.prototype._addColumn = function(resources, result, params){
    var self = this;
    var values = self._range(resources, result, params.from);

    return _.map(result, function(record, index){
      record[params.field] = values[index];
      return record;
    });
  };

  /**
   * Add row
   */
  DQ.prototype._addRow = function(resources, result, params){
    var self = this;
    var values = self._range(resources, result, params.from);
    var fields = _.first(result).keys();

    result.push(self.toMap(Array.from(fields), values));

    return result;
  };

  /**
   * Group by field
   */
  DQ.prototype._groupBy = function(resources, result, params){
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
  DQ.prototype._range = function(resources, result, params){
    var self = this;
    var method = (params.type === 'column')
      ? 'vectorFromColumns'
      : 'vectorFromRows';

    return self['_' + method](resources, params);
  };

  /**
   * Create a vector from a columns
   */
  DQ.prototype._vectorFromColumns = function(resources, params){
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
  DQ.prototype._vectorFromRows = function(resources, params){
    var records = resources[params.table].records;

    return _.reduce(records, function(acum, record, index) {
      if(index >= params.from && index <= params.to)
        acum.push(record[params.field]);
      return acum;
    }, []);
  };

  /**
   * Run operations
   */
  DQ.prototype._runOps = function(){
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
  DQ.prototype._backendFromString = function(backend) {
    return _.findWhere(DQ.backends, {__type__: backend});
  };

  /**
   * Fetch all the tables and place them into sources
   */
  DQ.prototype._fetchResources = function(){
    var self = this;
    var promises = [];

    _.each(self._tables, function(table){
      var backend = self._backendFromString(table.backend);

      if(!backend) throw new Error('Backend not found');

      promises.push(backend.fetch(table));
    });

    return Promise.all(promises);
  };


  /****************************
  *                           *
  *     Field transforms      *
  *                           *
  ****************************/

  /**
   * Trim
   */
  DQ.prototype._trim = function(resources, result, params){
    var self = this;
    var fields = params.fields;
    return _.map(result, function(record){
      return _.mapValues(record, function(value, key){
        return _.includes(fields, key) ?
          DQ.trim(value) :
          value;
      });
    });
  };

  /**
   * Cast
   */
  DQ.prototype._cast = function(resources, result, params){
    var self = this;
    var fields = _.pluck(params.fields, 'field');

    return _.map(result, function(record){
      return _.mapValues(record, function(value, key){
        if( _.contains(fields, key)) {
          var field = _.findWhere(params.fields, {field: key});
          var type = field.type;
          var args = field.args;
          return DQ.cast.apply(null, [value, type].concat(args))
        }
        return value;
      });
    });
  };

  /**
   * Substring
   */
  DQ.prototype._substr = function(resources, result, params){
    var self = this;
    var field = params.field;
    var start = params.start;
    var end = params.end;

    return _.map(result, function(record){
      record[field] = String(record[field]).substring(start, end);
      return record;
    });
  };

  /**********************
  *                     *
  *     PUBLIC API      *
  *                     *
  **********************/

  /**
   * Define the tables do you want to use.
   */
  DQ.prototype.tables = function(){
    var self = this;

    if(self instanceof DQ){

      // Fetched resources indexed by name
      self._resources = {};

      // Tables to retrieve
      self._tables = _.toArray(arguments);
      return self;
    } else {
      var ql = new DQ();
      return ql.tables.apply(ql, _.toArray(arguments));
    }

    return self;
  };

  /**
   * Add an operation to the queue.
   */
  DQ.prototype.ops = function(ops){
    var self = this;
    self._operations = ops;
    return self;
  };

  /**
   * Perform the query.
   */
  DQ.prototype.execute = function(cb){
    var self = this;
    var tableNames = _.pluck(self._tables, 'as');

    self._fetchResources()
    .then(function(data){
      self._resources = _.zipObject(tableNames, data);
      self._runOps();
      cb(self._result);
    });
  };

  // Expose dataql constructor
  global.DQ = global.DQ = DQ;
  global.tables = DQ.prototype.tables;
})(window);