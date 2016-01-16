'use strict';

angular
	.module('app.layout', [
		'ui.router'
	])
	.config(config);

function config($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('app', {
			abstract: true,
			views: {
				root: {
					templateUrl: 'app/layout/layout.tpl.html'
				}
			},
			resolve: {
				customer: function($q, Customer) {
					var deferred = $q.defer();

					Customer.getCurrent(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				scripts: function(lazyScript) {
					return lazyScript.register([
						'sparkline',
						'easy-pie'
					]);
				}
			}
		});

	$urlRouterProvider.otherwise('/dashboard');
}