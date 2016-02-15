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
		'app.profile',
		'app.group'
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

	$provide.factory('ErrorHttpInterceptor', function($q, $injector, LoopBackAuth, layoutLoader) {
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
			requestError: function(rejection) {
				layoutLoader.off();

				notifyError(rejection);
				return $q.reject(rejection);
			},

			responseError: function(rejection) {
				layoutLoader.off();

				// safe clear session and redirect to login page
				if (rejection.status == 401) {
					LoopBackAuth.clearUser();
					LoopBackAuth.clearStorage();

					$injector.get('$state').go('login');
				}

				notifyError(rejection);
				return $q.reject(rejection);
			}
		};
	});

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
	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		if (toState.name.substr(0, 3) === 'app' && !Customer.isAuthenticated()) {
			console.log('UnAuthenticated: redirect to login.');
			$state.nextAfterLogin = toState.name;
			$state.nextAfterLoginParams = fromParams

			$state.go('login');
			event.preventDefault();
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