'use strict';

/**
 * @ngdoc overview
 * @name app [smartadminApp]
 * @description
 * # app [smartadminApp]
 *
 * Main module of the application.
 */

angular
	.module('app', [
		//'ngSanitize',
		'ngAnimate',
		'restangular',
		'ui.router',
		'ui.bootstrap',
		'backendApi',

		// Smartadmin Angular Common Module
		'SmartAdmin',

		// App
		'app.auth',
		'app.layout',
		'app.chat',
		'app.dashboard',
		'app.calendar',
		'app.inbox',
		'app.graphs',
		'app.tables',
		'app.forms',
		'app.ui',
		'app.widgets',
		'app.maps',
		'app.appViews',
		'app.misc',
		'app.smartAdmin'
	])
	.config(config)
	.constant('APP_CONFIG', window.appConfig)
	.run(run);

function config($provide, $httpProvider, $locationProvider, LoopBackResourceProvider) {
	// Enable HTML5
	$locationProvider.html5Mode(true);

	// LoopBack config
	LoopBackResourceProvider.setUrlBase('http://localhost:3443/api');

	// Intercept http calls.
	$provide.factory('ErrorHttpInterceptor', function($q, $location, LoopBackAuth) {
		var errorCounter = 0;

		function notifyError(rejection) {
			var data = rejection.data;

			if (data.error) {
				data = data.error.message;
			}

			console.log(rejection);

			$.bigBox({
				title: rejection.status + ' ' + rejection.statusText,
				content: data,
				color: '#C46A69',
				icon: 'fa fa-warning shake animated',
				number: ++errorCounter,
				timeout: 6000
			});
		}

		return {
			// On request failure
			requestError: function(rejection) {
				// show notification
				notifyError(rejection);
				// Return the promise rejection.
				return $q.reject(rejection);
			},

			// On response failure
			responseError: function(rejection) {
				// safe clear session and redirect to login page
				if (rejection.status == 401) {
					LoopBackAuth.clearUser();
					LoopBackAuth.clearStorage();
					$location.nextAfterLogin = $location.path();
					$location.path('/login');
				}

				// show notification
				notifyError(rejection);
				// Return the promise rejection.
				return $q.reject(rejection);
			}
		};
	});

	// Add the interceptor to the $httpProvider.
	$httpProvider.interceptors.push('ErrorHttpInterceptor');
}

function run($rootScope, $state, $stateParams, Customer, LoopBackAuth) {
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	$rootScope.logout = function() {
		console.log('Client logout...');

		Customer.logout(null, null, function() {
			LoopBackAuth.clearUser();
			LoopBackAuth.clearStorage();
			$state.go('login');
		});
	};
	// editableOptions.theme = 'bs3';

	// UnAuthenticated redirect to login page
	$rootScope.$on('$stateChangeStart', function (e, toState) {
		if (toState.name.substr(0, 3) === 'app' && !Customer.isAuthenticated()) {
			console.log('UnAuthenticated: redirect to login.');
			$state.go('login');
			e.preventDefault();
		}
	});
}