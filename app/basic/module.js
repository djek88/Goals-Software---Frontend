'use strict';

angular
	.module('app.basic', [
		'ui.router',
		'backendApi',
		'ui.bootstrap.datetimepicker'
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
					templateUrl: 'app/basic/home/basic-home.view.html',
					controller: 'basicHomeController',
					controllerAs: 'vm'
				}
			},
			resolve: {
				groups: function($q, Group, Customer, loadAppData) {
					var deferred = $q.defer();
					var id = Customer.getCachedCurrent()._id;

					Group.find({
							filter: {
								where: {or: [{_ownerId: id}, {_memberIds: id}]},
								include: 'NextSession'
							}
						},
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				goals: function($q, Goal) {
					var deferred = $q.defer();

					Goal.find({
							filter: {
								where: {
									dueDate: {gt: Date.now()}
								}
							}
						},
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				}
			}
		})
		.state('app.myGoals', {
			url: '/my-goals',
			data: {
				title: 'My goals'
			},
			views: {
				'content@app': {
					templateUrl: 'app/basic/my-goals/basic-my-goals.view.html',
					controller: 'basicMyGoalsController',
					controllerAs: 'vm'
				}
			},
			resolve: {
				groups: function($q, Group, Customer, loadAppData) {
					var deferred = $q.defer();
					var id = Customer.getCachedCurrent()._id;

					Group.find({
							filter: {
								where: {or: [{_ownerId: id}, {_memberIds: id}]}
							}
						},
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				goals: function($q, Goal) {
					var deferred = $q.defer();

					Goal.find(
						{},
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				}
			}
		});
}