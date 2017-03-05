var scripts = require('./app.scripts');

module.exports = function(config){
	var files = [
		'app.config.js',
		'distTest/vendor.js',
		scripts.paths['angular-mocks'],
		scripts.paths['jstz'],
		scripts.paths['languages'],

		'app/shared/module.js',
		'app/shared/**/*.js',

		//profile module
		'app/profile/module.js',
		'app/profile/**/*.js',

		//basic module
		'app/basic/module.js',
		'app/basic/**/*.js',

		//group module
		'app/group/module.js',
		'app/group/**/*.js'
	];

	config.set({
		basePath: './',

		files: files,

		autoWatch: true,

		frameworks: ['jasmine'],

		browsers: ['Chrome'/*,'PhantomJS', 'Chrome_without_security'*/],

		plugins: [
			'karma-chrome-launcher',
			'karma-phantomjs-launcher',
			'karma-jasmine'
		],

		phantomjsLauncher: {
			exitOnResourceError: true
		},

		customLaunchers: {
			Chrome_without_security: {
				base: 'Chrome',
				flags: ['--disable-web-security']
			}
		}
	});
};
