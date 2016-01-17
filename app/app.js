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

		// 'app.chat',
		// 'app.dashboard',
		// 'app.calendar',
		// 'app.inbox',
		// 'app.graphs',
		// 'app.tables',
		// 'app.forms',
		// 'app.ui',
		// 'app.widgets',
		// 'app.maps',
		// 'app.appViews',
		// 'app.misc',
		// 'app.smartAdmin',
		'app.profile'
	])
	.config(config)
	.constant('APP_CONFIG', window.appConfig)
	.run(run);

function config($provide, $httpProvider, $locationProvider, LoopBackResourceProvider) {
	// Enable HTML5
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});

	// LoopBack config
	LoopBackResourceProvider.setUrlBase(window.appConfig.apiRootUrl);

	// Intercept http calls.
	$provide.factory('ErrorHttpInterceptor', function($q, $location, LoopBackAuth) {
		var errorCounter = 0;

		function notifyError(rejection){
			console.log('app.js rejection', rejection);
			var data = rejection.data || 'Lost connection!';

			if (data.error) {
				data = data.error.message;
			}

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

function run($rootScope, $state, $stateParams, Language, Customer, APP_CONFIG) {
	$rootScope.urlBase = APP_CONFIG.apiRootUrl;
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
	$rootScope.logout = logout;
	// editableOptions.theme = 'bs3';

	// Set current language
	$rootScope.lang = {};
	$rootScope.getWord = getWord;

	Language.getLanguages(function(data){
		Language.getLang(data[0].key, function(data){
			$rootScope.lang = data;
		});
	});

	// UnAuthenticated redirect to login page
	$rootScope.$on('$stateChangeStart', function (e, toState) {
		if (toState.name.substr(0, 3) === 'app' && !Customer.isAuthenticated()) {
			console.log('UnAuthenticated: redirect to login.');
			$state.go('login');
			e.preventDefault();
		}
	});

	function getWord(key){
		if(angular.isDefined($rootScope.lang[key])){
			return $rootScope.lang[key];
		}
		else {
			return key;
		}
	}

	function logout() {
		console.log('Client logout...');

		Customer.logout(null, null, function() {
			$state.go('login');
		});
	}
}