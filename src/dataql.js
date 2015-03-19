/*jshint -W030 */

;(function(global){
  'use strict';

  /**
   * DataQL constructor
   */
  _.mixin({
    rename: function(obj, newNames){
      return _.reduce(newNames, function(o, nu, old){
        if(_.has(obj, old)){
          o[nu] = obj[old];
          return o;
        } else {
          return o;
        }
      },
      _.omit.apply(null, _.construct(obj, _.keys(newNames)) ));
    },
    cat: function(){
      var head = _.first(arguments);
      if(head)
        return head.concat.apply(head,
          _.rest(arguments));
      else
        return [];
    },
    construct: function(head, tail){
      return _.cat([head], _.toArray(tail));
    },
    trim: function(str){
      var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
      return str.replace(rtrim, '');
    },
    fdefaults: function(){
      return _.defaults.apply(_, _.construct({}, _.toArray(arguments)));
    }
  });


  /**
   * DataQL constructor
   */
  function DataQL(){
    var self = this;

    self._select = [];
    self._aggregate = [];
    self._join = [];
  }

  DataQL.fn = {};


  /**
   * Aggregate functions
   */

  // Sum aggregate function.
  DataQL.fn.sum = function(aggregate, dataset, query){
    var groupBy = query.groupStament;
    var field = aggregate.field;
    var as = aggregate.as || aggregate.field;

    return _.reduce(dataset, function(memo, item){
      if(groupBy){
        var groupByField = item[groupBy];
        memo[groupByField] = memo[groupByField] || {};
        memo[groupByField][as] = (memo[groupByField][as] || 0) + item[field];
        return memo;
      } else {
        memo[as] = (memo[as] || 0) + item[field];
        return memo;
      }
    }, {});
  };

  // Count aggregate function.
  DataQL.fn.count = function(aggregate, dataset, query){
    var groupBy = query.groupStament;
    var as = aggregate.as || 'count';

    return _.reduce(dataset, function(memo, item){
      if(groupBy){
        var groupByField = item[groupBy];
        memo[groupByField] = memo[groupByField] || {};
        memo[groupByField][as] = (memo[groupByField][as] || 0) + 1;
        return memo;
      } else {
        memo[as] = (memo[as] || 0) + 1;
        return memo;
      }
    }, {});
  };

  // Avg aggregate function.
  DataQL.fn.avg = function(aggregate, dataset, query){
    var groupBy = query.groupStament;
    var field = aggregate.field;
    var as = aggregate.as || 'avg';

    var result = _.reduce(dataset, function(memo, item){
      if(groupBy){
        var gbField = item[groupBy];
        memo[gbField] = memo[gbField] || {};
        memo[gbField].__total = (memo[gbField].__total || 0) + item[field];
        memo[gbField].__count = (memo[gbField].__count || 0) + 1;
        if(memo[gbField].__count && memo[gbField].__total){
          memo[gbField][as] = memo[gbField].__total / memo[gbField].__count;
        }
        return memo;
      } else {

        memo.__total = (memo.__total || 0) + item[field];
        memo.__count = (memo.__count || 0) + 1;
        if(memo.__count && memo.__total){
          memo[as] = memo.__total / memo.__count;
        }
        return memo;
      }
    }, {});
    if(groupBy){
      // Removing computed fields.
      return _.object(_.map(result, function(item, key){
        return [key, _.omit(item, '__total', '__count')];
      }));
    } else {
      return _.omit(result, '__total', '__count');
    }
  };

  // Max aggregate function
  DataQL.fn.max = function(aggregate, dataset, query){
    var groupBy = query.groupStament;
    var as = aggregate.as || 'max';
    var field = aggregate.field;

    return _.reduce(dataset, function(memo, item){
      if(groupBy){
        var groupByField = item[groupBy];
        memo[groupByField] = memo[groupByField] || {};
        memo[groupByField][as] = memo[groupByField][as] || item[field];
        if(item[field] > memo[groupByField][as]){
          memo[groupByField][as] = item[field];
        }
        return memo;
      } else {
        memo[as] = memo[as] || item[field];
        if(item[field] > memo[as]){
          memo[as] = item[field];
        }
        return memo;
      }
    }, {});
  };

  // Min aggregate function
  DataQL.fn.min = function(aggregate, dataset, query){
    var groupBy = query.groupStament;
    var as = aggregate.as || 'min';
    var field = aggregate.field;

    return _.reduce(dataset, function(memo, item){
      if(groupBy){
        var groupByField = item[groupBy];
        memo[groupByField] = memo[groupByField] || {};
        memo[groupByField][as] = memo[groupByField][as] || item[field];
        if(item[field] < memo[groupByField][as]){
          memo[groupByField][as] = item[field];
        }
        return memo;
      } else {
        memo[as] = memo[as] || item[field];
        if(item[field] < memo[as]){
          memo[as] = item[field];
        }
        return memo;
      }
    }, {});
  };

  // Percentage aggregate function.
  DataQL.fn.percentage = function(aggregate, dataset, query){
    var groupBy = query.groupStament;
    var field = aggregate.field;
    var as = aggregate.as || 'percentage';
    var total = 0;
    var result = _.reduce(dataset, function(memo, item){
      if(groupBy){
        var gbField = item[groupBy];
        memo[gbField] = memo[gbField] || {};
        memo[gbField].__total = (memo[gbField].__total || 0) + item[field];
        total += item[field];
        return memo;
      }
    }, {});

    return _.object(_.map(result, function(item, key){
      if(total && item.__total){
        item[as] = item.__total / total;
      } else {
        item[as] = 0;
      }
      item = _.omit(item, '__total', '__count');
      return [key, item];
    }));

  };

  global.select = DataQL.prototype.select = function(){
    var self = this;
    var args = [].slice.call(arguments, 0);
    var op;

    if(self instanceof DataQL){

      self._select = _.map(args, function(item){
        if(_.isString(item)) {
            op = {};
            op[item] = _.iteratee(item);
            return op;
        }
      });
      return self;
    } else {
      var query = new DataQL();
      return query.select.apply(query, args);
    }
  };

  DataQL.prototype.join = function(backend) {
    var self = this;
    var jn = backend;
    self._join.push(jn);
    return self;
  };

  DataQL.prototype.group = function(fieldName) {
    var self = this;
    self.groupStament = fieldName;
    return self;
  };

  DataQL.prototype.from = function(data) {
    var self = this;
    self.dataset = data;
    return self;
  };

  DataQL.prototype.order = function(predicate) {
    var self = this;
    self.orderStament = predicate;
    return self;
  };

  DataQL.prototype.limit = function(start, rowCount) {
    var self = this;
    self.limitStament = [start, rowCount];
    return self;
  };

  DataQL.prototype.where = function(predicate) {
    var self = this;
    self.whereStament = predicate;
    return self;
  };

  DataQL.prototype.rename = function(mappings) {
    var self = this;
    self.renameStament = (_.isArray(mappings))? mappings: [mappings];
    return self;
  };

  DataQL.prototype.aggregate = function(aggregation) {
    var self = this;
    self._aggregate.push(aggregation);
    return self;
  };

  DataQL.prototype.execute = function(cb){
    var self = this;
    self.result = (self.groupStament)? {} : [];
    self.scalar = self._aggregate.length && !self.groupStament;

    // self.dataset = (_.isArray(self.dataset)) ?
    //   {records: self.dataset}
    //   : self.dataset;

    // Fetching resources.
    return self._fetchResources(function(err, data){

      // Filter results by where predicate.
      self._filteredDataset = (self.whereStament)?
        _.filter(data, self.whereStament)
        : data;

      // If not an scalar.
      if(!self.scalar){
        _.each(self._filteredDataset, function(row, index){
          var key = (self.groupStament)? row[self.groupStament] : index;

          _.each(self._select, function(select){
            var getValue = _.values(select)[0];
            var fieldName = _.keys(select)[0];

            // Create slot if not exists.
            self.result[key] = self.result[key] || {};

            // Applying function to get value.
            self.result[key][fieldName] = getValue(row);
          });
        });
      }

      // Renaming fields
      _.each(self.result, function(item, key){
        _.each(self.renameStament, function(mappings){
          self.result[key] = _.rename(item, mappings);
        });
      });

      // Run aggregations here. Side effects?
      var aggData = {};

      _.each(self._aggregate, function(aggregation){
        var data = self._runAggregation(data, aggregation);
        _.merge(aggData, data);
      });

      if(self.scalar){
        self.result = aggData;
        self.result = aggData;
         return cb && cb(err, self.result);
      } else {
        _.merge(self.result, aggData);
        self.result =_.values(self.result);
      }

      // Order results by orderStament.
      self.result = (self.orderStament)?
        _.sortBy(self.result, self.orderStament)
        : self.result;

      // Limit result accordingly limitStament.
      self.result = (self.limitStament)?
        self.result.slice.apply(self.result, self.limitStament)
        : self.result;

      cb && cb(err, self.result);
    });


  };

  DataQL.prototype._fetchResources = function(cb){
    var self = this;
    var promises = [];
    var backend;

    backend = _.findWhere(recline.Backend, {__type__:self.dataset.backend});

    if(!backend) throw new Error('Backend not found');

    promises.push(backend.fetch(self.dataset));

    _.each(self._join, function(options){
      var backend = _.findWhere(recline.Backend, {__type__:options.backend});
      promises.push(backend.fetch(options));
    });

    return $.when.apply($, promises)
      .fail(function(err){
        cb(err, null);
      })
      .done(function(){
        cb(null, self._joinResources(_.toArray(arguments)));
      });
  };

  DataQL.prototype._joinResources = function(resources){
    var self = this;
    var result = [];

    self._normalizeRecordsAndFields(resources);

    var from = _.first(_.reject(resources, self._isJoin));
    var joins = _.filter(resources, self._isJoin);
    result = from.records;

    // for each join function.
    _.each(joins, function(dataset){

      // for each record in the B table.
      _.each(dataset.records, function(rowb){

        // for each record in the A table.
        _.each(result, function(rowa){

          // Filter with join where function.
          if(dataset.where(rowa, rowb)){
            _.extend(rowa, rowb);
          }
        });
      });
    });
    return result;
  };

  DataQL.prototype._isJoin = function(dataset){
    return _.has(dataset, 'where');
  };

  // Returns an array of objects.
  DataQL.prototype._runAggregation = function(dataset, aggregate){
    var self = this;
    return DataQL.fn[aggregate.method](aggregate, self._filteredDataset, self);
  };

  // Plenty of side effects but optimized for big files.
  DataQL.prototype._normalizeRecordsAndFields = function(resources){
    for (var i = resources.length - 1; i >= 0; i--) {
      for (var j = resources[i].records.length - 1; j >= 0; j--) {
        if(resources[i].records[j] instanceof Array){
          resources[i].records[j] = _.object(
            _.invoke(resources[i].fields, 'trim'),
            resources[i].records[j]
          );
        }
      }
    }
  };


})(window);