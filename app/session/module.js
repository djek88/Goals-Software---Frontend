'use strict';

angular
	.module('app.session', [
		'ui.router',
		'backendApi'
	])
	.config(config);

function config($stateProvider) {
	$stateProvider
		.state('app.session', {
			abstract: true,
			url: '/session',
			template: '<ui-view/>'
		})
		.state('app.session.start', {
			url: '/:id/start',
			data: {
				title: 'Start'
			},
			views: {
				'content@app': {
					templateUrl: 'app/session/start/session-start.view.html',
					controller: 'sessionStartController',
					controllerAs: 'vm'
				}
			},
			resolve: {
				group: function($q, $state, $stateParams, Group) {
					var deferred = $q.defer();

					Group.findById({
							id: $stateParams.id,
							filter: {include: ['Members', 'Owner', 'NextSession']}
						},
						function(group) {
							if (!group.NextSession) {
								return $state.go('app.home');
							}

							deferred.resolve(group);
						},
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				socket: function($q, socketIO) {
					var deferred = $q.defer();
					var socket = socketIO.toStart();

					socket.onSuccessAuth = function() {
						deferred.resolve(socket);
					};

					socket.onFailAuth = function() {
						deferred.reject();
					};

					return deferred.promise;
				}
			}
		})
		.state('app.session.goes', {
			url: '/:id/goes',
			data: {
				title: 'Goes'
			},
			views: {
				'content@app': {
					templateUrl: 'app/session/goes/session-goes.view.html',
					controller: 'sessionGoesController',
					controllerAs: 'vm'
				}
			},
			resolve: {
				group: function($q, $stateParams, Group) {
					var deferred = $q.defer();

					Group.findById({
							id: $stateParams.id,
							filter: {include: ['Members', 'Owner', 'NextSession']}
						},
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				goals: function($q, $stateParams, Group) {
					var deferred = $q.defer();

					Group.prototype$relatedActiveGoals({
							id: $stateParams.id
						},
						function() {
							var goals = arguments[0].filter(function(goal) {
								return goal.state !== 1;
							});

							deferred.resolve(goals);
						},
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				socket: function($q, socketIO) {
					var deferred = $q.defer();
					var socket = socketIO.toGoes();

					socket.onSuccessAuth = function() {
						deferred.resolve(socket);
					};

					socket.onFailAuth = function() {
						deferred.reject();
					};

					return deferred.promise;
				}
			}
		});
}