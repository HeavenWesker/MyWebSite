/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    //banner: 'test banner',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        //dest: 'dist/<%= pkg.name %>.min.js'
        dest: 'public/javascripts/global.min.js'
      },
      home: {
        src: 'lib/home.js',
        dest: 'public/javascripts/home.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        devel: true,
        globals: {
          jQuery: true,
          $: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    watch: {
      options: {
        livereload: true,
        //debounceDelay: 5000,
        nospawn: false
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        options: {
          livereload: false,
          nospawn: false
        },
        files: '<%= jshint.lib_test.src %>',
        //tasks: ['jshint:lib_test', 'qunit']
        tasks: ['jshint:lib_test']
      },
      sass: {
        files: ['sass/*.scss', 'sass/*.css'],
        tasks: ['sass']
      },
      jade: {
        files: ['views/*.jade']
      },
      concat: {
        options: {
          livereload: false,
          nospawn: false
        },
        files: '<%= concat.dist.src %>',
        tasks: ['concat']
      },
      uglify: {
        files: '<%= uglify.dist.src %>',
        tasks: ['uglify']
      }

    },
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'public/stylesheets/custom.css': 'sass/custom.scss'
        }
      }
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-notify');

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

};
