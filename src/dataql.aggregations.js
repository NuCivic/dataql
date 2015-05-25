/*jshint -W030 */

;(function(global){
  'use strict';

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
    var f = params.field;
    var as = params.as || 'percentage';
    var previous;
    var total = 0;

    var precomputed = _.values(_.reduce(result, function(acum, record, index) {
      var gb = record.get(params.groupBy);
      var current = Number(record.get(f));

      if (gb in acum) {
        acum[gb].set('__total', Number(acum[gb].get('__total')) + current);
      } else {
        acum[gb] = record;
        acum[gb].set('__total', current);
      }
      total += current;
      return acum;
    }, {}));

    return _.map(precomputed, function(record, index) {
      record.set(as, record.get('__total') / total);
      record.delete('__total');
      return record;
    });
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
   * Count of a field grouped by any field.
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

})(window);