module.exports = function(grunt) {
  'use strict';
  // Project configuration.
  var files = [
    'src/dataql.js',
    'src/lib/csv.js',
    'src/lib/gdocs.js',
    'src/lib/inline.js',
    'src/lib/report.js',
    'src/lib/json.js',
    'src/lib/xlsx.js',
    'src/lib/papaparse.js',
    'src/dataql.aggregations.js',
    'src/dataql.utils.js',
    'src/dataql.formatters.js',
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: files,
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v0.1 */\n'
      },
      build: {
        src: files,
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    express: {
      all: {
        options: {
          bases: ['./'],
          port: 8080,
          hostname: '0.0.0.0',
          livereload: true
        }
      }
    },
    watch: {
      all: {
        files: files,
        tasks: ['build'],
        options: {
          livereload: true
        }
      }
    },
    watchDebug: {
      all: {
        files: files.concat('examples/*.js'),
        tasks: ['concat'],
        options: {
          livereload: true
        }
      }
    },
    open: {
      all: {
        path: 'http://localhost:8080/examples/index.html'
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'src/**/*.js',
        'examples/*.js',
        '!**/node_modules/**'
      ],
      options: {
        jshintrc: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-livereload');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  // Default task(s).
  grunt.registerTask('default', [
    'express',
    'jshint',
    'concat',
    'uglify',
    'open',
    'watch'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'concat',
    // 'uglify',
  ]);

  grunt.registerTask('debug', [
    'express',
    'concat',
    'open',
    'watch'
  ]);

  grunt.registerTask('lint', ['jshint']);
};