// karma.conf.js
module.exports = function(config) {
  'use strict';

  config.set({
    logLevel: config.LOG_DEBUG,
    browsers: ['PhantomJS_custom'],
    customLaunchers: {
      'PhantomJS_custom': {
        base: 'PhantomJS2',
        flags: ['--web-security=no'],
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
      'vendor/promise-polyfill/Promise.min.js',
      'vendor/lodash/lodash.js',
      'vendor/papaparse/papaparse.js',
      'src/lib/csv.js',
      'src/lib/gdocs.js',
      'src/lib/inline.js',
      'src/lib/json.js',
      'src/lib/papaparse.js',
      'src/lib/xlsx.js',
      'dist/dataql.min.js',
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