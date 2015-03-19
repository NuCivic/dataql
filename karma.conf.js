// karma.conf.js
module.exports = function(config) {
  'use strict';

  config.set({
    frameworks: ['mocha', 'expect'],
    files: [
      'vendor/jquery/dist/jquery.js',
      'vendor/lodash/lodash.js',
      'lib/csv.js',
      'lib/elasticsearch.js',
      'lib/gdocs.js',
      'lib/inline.js',
      'vendor/papaparse/papaparse.min.js',
      'lib/papaparse.js',
      'src/dataql.js',
      'test/test.js'
    ],
    client: {
      mocha: {
        timeout: 5000
      }
    }
  });
};