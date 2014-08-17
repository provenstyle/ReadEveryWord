module.exports = function(grunt){

	var shell = require('./util/shell');
	var wait = require('./util/wait');

	grunt.initConfig({
	    jshint: {
	        files: ['./Web/App/**/*.js'],
	        options: {

	        }
	    },
	});

	grunt.registerTask('default', ['jshint']);
    
	grunt.registerTask('web', 'Starts IISExpress', function(){
		var done = this.async();
		shell.run('C:/Program Files/IIS Express/iisexpress.exe', ['/site:web']).
			then(done);
	});

	grunt.registerTask('ux', 'Starts IISExpress', function(){
		var done = this.async();
		shell.run('C:/Program Files/IIS Express/iisexpress.exe', ['/site:UX']).
			then(done);
	});

	grunt.registerTask('test', 'Run mspec tests', function(){
		var done = this.async();
		var mspecPath = "packages/machine.specifications.0.8.3/tools/mspec-clr4.exe"
		var tests = [
			'Web/Tests/bin/Debug/ProvenStyle.ReadEveryWord.Tests.dll'
		];

		shell.run(mspecPath, tests)
			.done(done);
	});


	grunt.loadNpmTasks('grunt-contrib-jshint');
};
 