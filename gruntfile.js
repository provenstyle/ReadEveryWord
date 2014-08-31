/// <reference path="web/scripts/jquery-1.10.2.min.js" />
module.exports = function (grunt) {

    var shell = require('./util/shell');
    var wait = require('./util/wait');

    grunt.initConfig({
        jasmine: {
            src: ['JavaScriptTests/src/scripts/**/*.js'],   //don't include the requirejs modules
            options: {
                specs: 'JavaScriptTests/spec/**/*Spec.js',
                helpers: ['JavaScriptTests/helpers/*Helper.js', 'http://localhost:35729/livereload.js?snipver=1'],
                vendor: [
                    'Web/Scripts/jquery-1.10.2.min.js',
                    'Web/Scripts/knockout-3.1.0.js',
                    'Web/Scripts/underscore-min.js',
                    'Web/Scripts/toastr.min.js',

                    //sinon has to load before requirejs
                    'Web/Scripts/sinon-server-1.10.3.js',
                    'JavaScriptTests/vendor/require.js'

                ],
                keepRunner: true
            }
        },
        jshint: {
            files: [
                './Web/App/**/*.js',
                './JavaScriptTests/spec/**/*.js',
                './JavaScriptTests/helpers/**/*.js'
            ],
            options: {

            }
        },
        cssmin: {
            combine: {
                files: {
                    'build/min.css': [
                        'Web/Content/bootstrap.min.css',
                        'Web/Content/font-awesome.min.css',
                        'Web/Content/bootstrap-theme.min.css',
                        'Web/Content/durandal.css',
                        'Web/Content/starterkit.css',
                        'Web/Content/toastr.min.css',
                        'Web/Content/books.css'
                    ]
                }
            }
        },
        copy: {
            cordova: {
                files: [
                    //expand:true and flatten:true keep it from pasting the full path
                    { expand: true, src: 'build/min.css', dest: 'cordova/www/css/', flatten: true}
                ]
            }
        }
    });

    grunt.registerTask('default', ['jshint', 'jasmine']);

    grunt.registerTask('web', 'Starts IISExpress', function () {
        var done = this.async();
        shell.run('C:/Program Files/IIS Express/iisexpress.exe', ['/site:web']).
			then(done);
    });

    grunt.registerTask('ux', 'Starts IISExpress', function () {
        var done = this.async();
        shell.run('C:/Program Files/IIS Express/iisexpress.exe', ['/site:UX']).
			then(done);
    });

    grunt.registerTask('test', 'Run mspec tests', function () {
        var done = this.async();
        var mspecPath = "packages/machine.specifications.0.8.3/tools/mspec-clr4.exe"
        var tests = [
			'Web/Tests/bin/Debug/ProvenStyle.ReadEveryWord.Tests.dll'
        ];

        shell.run(mspecPath, tests)
			.done(done);
    });


    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
   
};
