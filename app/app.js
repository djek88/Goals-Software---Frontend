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
		'ngCookies',

		// Smartadmin Angular Common Module
		'SmartAdmin',

		// App
		'app.layout',
		'app.shared',
		'app.basic',
		'app.profile',
		'app.group',
		'app.session'
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

		function notifyError(rejection){
			console.log('app.js rejection', rejection);
			var data = rejection.data || 'Lost connection!';

			if (data.error) {
				data = data.error.message;
			}

			$injector.get('notifyAndLeave')({
				box: 'bigBox',
				title: rejection.status,
				content: data,
				isError: true,
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

					window.location.href = 'http://themastermind.nz/members';
				} else {
					notifyError(rejection);
					return $q.reject(rejection);
				}
			}
		};
	});

	$httpProvider.interceptors.push('ErrorHttpInterceptor');
}

function run($rootScope, $cookies, $state, $stateParams, APP_CONFIG, Language, Customer, LoopBackAuth) {
	//$cookies.put('global_themastermind.nz_member_id', 5);
	//$cookies.put('global_themastermind.nz_session_id', '2cvufcl6ju3o1i0qpm1o1c5mi3');

	$rootScope.urlBase = APP_CONFIG.apiRootUrl;
	$rootScope.socketUrl = APP_CONFIG.socketUrl;
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
		if (toState.name.substr(0, 3) === 'app') {
			if (!checkCookies()) {
				event.preventDefault();

				LoopBackAuth.clearUser();
				LoopBackAuth.clearStorage();

				window.location.href = 'http://themastermind.nz/members';
			} else if (!Customer.isAuthenticated()) {
				event.preventDefault();

				Customer.login({rememberMe: false}, {
					_sessionId: $cookies.get('global_themastermind.nz_session_id')
				}, function() {
					console.log('Client signin success.');
					$state.go(toState, toParams);
				});
			}
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
			window.location.href = 'http://themastermind.nz/members';
		});
	}

	function checkCookies() {
		return $cookies.get('global_themastermind.nz_member_id') &&
			$cookies.get('global_themastermind.nz_session_id');
	}
}