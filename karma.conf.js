// karma.conf.js
module.exports = function(config) {
  'use strict';

  config.set({
    logLevel: config.LOG_DEBUG,
    browsers: ['PhantomJS', 'PhantomJS_custom'],
    customLaunchers: {
      'PhantomJS_custom': {
        base: 'PhantomJS',
        options: {
          windowName: 'my-window',
          settings: {
            webSecurityEnabled: false
          }
        }
      }
    },
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
      captureConsole: true,
      mocha: {
        timeout: 5000
      }
    }
  });
};