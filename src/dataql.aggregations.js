/*jshint -W030 */

;(function(global, DQ){
  'use strict';

  /**********************
  *                     *
  *     AGGREGATIONS    *
  *                     *
  **********************/

  /**
   * Sum a field grouped by any field.
   */
  DQ.prototype._sum = function(resources, result, params){
    var self = this;

    return _.values(_.reduce(result, function(acum, record, index) {
      var gb = record[params.groupBy];
      var f = params.field;
      var as = params.as || f;
      var current = Number(record[f]);

      if (gb in acum) {
        acum[gb][as] = Number(acum[gb][as]) + current;
      } else {
        acum[gb] = record;
        acum[gb][as] = current;
      }
      return acum;
    }, {}));
  };

  /**
   * Avg of a field grouped by any field.
   */
  DQ.prototype._avg = function(resources, result, params){
    var self = this;
    var f = params.field;
    var as = params.as || 'avg';
    var previous;

    var precomputed = _.values(_.reduce(result, function(acum, record, index) {
      var gb = record[params.groupBy];
      var current = Number(record[f]);

      if (gb in acum) {
        previous = Number(acum[gb][f]);
        acum[gb].__total = Number(acum[gb].__total) + current;
        acum[gb].__count = previous + 1;
      } else {
        acum[gb] = record;
        acum[gb].__total = current;
        acum[gb].__count = 1;
      }
      return acum;
    }, {}));

    return _.map(precomputed, function(record, index) {
      record[as] = record.__total / record.__count;
      return _.omit(record, '__total', '__count');
    });
  };

  /**
   * Percentage of a field grouped by any field.
   */
  DQ.prototype._percentage = function(resources, result, params){
    var self = this;
    var f = params.field;
    var as = params.as || 'percentage';
    var previous;
    var total = 0;

    var precomputed = _.values(_.reduce(result, function(acum, record, index) {
      var gb = record[params.groupBy];
      var current = Number(record[f]);

      if (gb in acum) {
        acum[gb].__total = Number(acum[gb].__total) + current;
      } else {
        acum[gb] = record;
        acum[gb].__total = current;
      }
      total += current;
      return acum;
    }, {}));

    return _.map(precomputed, function(record, index) {
      record[as] = record.__total / total;
      return _.omit(record, '__total');
    });
  };

  /**
   * Max of a field grouped by any field.
   */
  DQ.prototype._max = function(resources, result, params){
    var self = this;

    return _.values(_.reduce(result, function(acum, record, index) {
      var gb = record[params.groupBy];
      var f = params.field;
      var as = params.as || f;
      var current = Number(record[f]);
      var previous;

      if (gb in acum) {
        previous = Number(acum[gb][as]);
        if (current > previous) {
          acum[gb][as] = current;
        }
      } else {
        acum[gb] = record;
        acum[gb][as] = current;
      }
      return acum;
    }, {}));
  };

  /**
   * Min of a field grouped by any field.
   */
  DQ.prototype._min = function(resources, result, params){
    var self = this;

    return _.values(_.reduce(result, function(acum, record, index) {
      var gb = record[params.groupBy];
      var f = params.field;
      var as = params.as || f;
      var current = Number(record[f]);
      var previous;

      if (gb in acum) {
        previous = Number(acum[gb][as]);
        if (current < previous) {
          acum[gb][as] = current;
        }
      } else {
        acum[gb] = record;
        acum[gb][as] = current;
      }
      return acum;
    }, {}));
  };

  /**
   * Count of a field grouped by any field.
   */
  DQ.prototype._count = function(resources, result, params){
    var self = this;

    return _.values(_.reduce(result, function(acum, record, index) {
      var gb = record[params.groupBy];
      var as = params.as || 'count';
      var previous;

      if (gb in acum) {
        previous = Number(acum[gb][as]);
        acum[gb][as] = previous + 1;
      } else {
        acum[gb] = record;
        acum[gb][as] = 1;
      }
      return acum;
    }, {}));
  };

})(window, DQ);