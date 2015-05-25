module.exports = function(grunt) {
  'use strict';
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/dataql.js', 'src/dataql.aggregations.js'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v0.1 */\n'
      },
      build: {
        src: ['src/dataql.js', 'src/dataql.aggregations.js'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    livereload: {

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
        files: 'examples/*.html',
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
        '!**/node_modules/**'],
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
    'concat'
  ]);

  grunt.registerTask('lint', ['jshint']);
};