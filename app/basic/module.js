'use strict';

angular
	.module('app.basic', [
		'ui.router',
		'backendApi'
	])
	.config(config);

function config($stateProvider) {
	$stateProvider
		.state('app.home', {
			url: '/home',
			data: {
				title: 'Home'
			},
			views: {
				'content@app': {
					templateUrl: 'app/basic/home/home.view.html',
					controller: 'homeController',
					controllerAs: 'vm'
				}
			},
			/*resolve: {
				customer: function($q, $stateParams, Customer) {
					var deferred = $q.defer();

					Customer.prototype$baseCustomerInfo({
							id: $stateParams.id
						},
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				scripts: function(lazyScript){
					return lazyScript.register([]);
				}
			}*/
		})
		/*.state('app.profile.settings', {
			url: '/settings',
			data: {
				title: 'Settings profile'
			},
			views: {
				'content@app': {
					templateUrl: 'app/profile/settings/profile-settings.view.html',
					controller: 'profileSettingsController',
					controllerAs: 'vm'
				}
			},
			resolve: {
				scripts: function(lazyScript){
					return lazyScript.register(['jstz']);
				}
			}
		})*/;
}