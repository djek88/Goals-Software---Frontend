'use strict';

angular
	.module('app.profile', [
		'ui.router',
		'backendApi',
		'file-model',
		'angularjs-dropdown-multiselect',
		'ng-currency'
	])
	.config(config);

function config($stateProvider) {
	$stateProvider
		.state('app.profile', {
			abstract: true,
			url: '/profile',
			template: '<ui-view/>'
		})
		.state('app.profile.detail', {
			url: '/:id/detail',
			data: {
				title: 'Detail profile'
			},
			views: {
				'content@app': {
					templateUrl: 'app/profile/detail/profile-detail.view.html',
					controller: 'profileDetailController',
					controllerAs: 'vm'
				}
			},
			resolve: {
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
			}
		})
		.state('app.profile.settings', {
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
				groupTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.groupTypes(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				sessionTimeTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.sessionTimeTypes(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				penaltyAmounts: function($q, Additional) {
					var deferred = $q.defer();

					Additional.penaltyAmounts(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				scripts: function(lazyScript){
					return lazyScript.register(['jstz', 'languages']);
				}
			}
		});
}