'use strict';
module.exports = function(grunt) {

  grunt.initConfig({
    wiredep: {
      default: {
        src: ['app/templates/index.html'],
        ignorePath: '..'
      }
    },
    compass: {
      default: {
        options: {
          sassDir: 'app/static/scss',
          cssDir: 'app/static/css'
        }
      }
    },
    watch: {
      sass: {
        files: ['app/static/scss/**/*.scss'],
        tasks: ['compass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.registerTask('build', ['wiredep', 'compass']);
};
