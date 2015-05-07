/*jshint -W030 */

;(function(global){
  'use strict';

  /**
   * Comparators
   */
  DataQL.operators = {};
  // Equal
  DataQL.operators['='] = function(operand1, operand2) {
    return operand1 === operand2;
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
   * DataQL constructor
   */
  function DataQL(){
    var self = this;

    self._tables = [];
    self._operations = [];
    self._result = [];
  }

  /**
   * Define the tables do you want to use.
   * Use the recline format to define backends.
   */
  DataQL.prototype.tables = function(){
    var self = this;

    // Tables to retrieve
    self._tables = _.toArray(arguments);

    // Fetched resources indexed by name
    self._resources = {};

    return self;
  };

  DataQL.prototype._buildCondition = function(condition){
    return function(record1, record2) {
      var cmp = DataQL.comparators[condition.cmp];
      var left = _.iteratee(condition.left);
      var right = _.iteratee(condition.right);
      return cpm(left(record), right(record2));
    }
  };

  /**
   * Join tables
   */
  DataQL.prototype._join = function(resources, result, params){
    var self = this;
    var toJoin = [];

    if(_.has(resources, params.table)){
      toJoin = resources[params.table].records;
    }
    return _.map(result, function(record){
      var matched = _.filter(toJoin, _.partial(self._buildCondition, record));
      return _.extend(record, _.first(matched));
    });
  };

  /**
   * Set table
   */
  DataQL.prototype._set = function(resources, result, params){
    var self = this;
    result = resources[params.table].records;
    return result;
  };

  /**
   * Add an operation to the queue.
   */
  DataQL.prototype.op = function(op){
    var self = this;
    self._operations.push(op);
    return self;
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
   * Perform the query.
   */
  DataQL.prototype.execute = function(){
    var self = this;
    var tableNames = _.pluck(self._tables, 'as');

    self._fetchResources().done(function(){
     self._resources = _.zipObject(tableNames, _.toArray(arguments));
     self._runOps();
     console.table(self._result);
    });
  };

  /**
   * Get a backend from its string representation.
   * @param  {String} backend  Backend string representation.
   */
  DataQL.prototype._backendFromString = function(backend) {
    return _.findWhere(recline.Backend, {__type__: backend})
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

  // Expose dataql constructor
  global.DataQL = DataQL;
})(window);