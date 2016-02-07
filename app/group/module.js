'use strict';

angular
	.module('app.group', [
		'ui.router',
		'backendApi'
	])
	.config(config);

function config($stateProvider) {
	$stateProvider
		.state('app.group', {
			abstract: true,
			url: '/group',
			template: '<ui-view/>'
		})
		.state('app.group.myGroups', {
			url: '/my-groups',
			data: {
				title: 'My groups'
			},
			views: {
				'content@app': {
					templateUrl: 'app/group/my-groups/my-groups.view.html',
					controller: 'myGroupsController',
					controllerAs: 'vm',
				}
			},
			resolve: {
				groups: function($q, Group, customer) {
					var deferred = $q.defer();
					var id = customer._id;

					Group.find(
						{filter: {where: {or: [{_ownerId: id}, {_memberIds: id}]}}},
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
		.state('app.group.search', {
			url: '/search',
			data: {
				title: 'Search groups'
			},
			views: {
				'content@app': {
					templateUrl: 'app/group/group-search/group-search.view.html',
					controller: 'groupSearchController',
					controllerAs: 'vm',
				}
			},
			resolve: {
				groupTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.groupTypes(
						function(result) { deferred.resolve(result.types); },
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				penaltyAmounts: function($q, Additional) {
					var deferred = $q.defer();

					Additional.penaltyAmounts(
						function(result) { deferred.resolve(result.types); },
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				scripts: function(lazyScript){
					return lazyScript.register([]);
				}
			}
		})
		.state('app.group.detail', {
			url: '/:id/detail',
			data: {
				title: 'Your group'
			},
			views: {
				'content@app': {
					templateUrl: 'app/group/group-detail/group-detail.view.html',
					controller: 'groupDetailController',
					controllerAs: 'vm',
				}
			},
			resolve: {
				group: function($q, $stateParams, Group) {
					var deferred = $q.defer();

					Group.findById({
							id: $stateParams.id,
							filter: {include: ['Members', 'Owner']}
						},
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				sessionsPassed: function($q, $stateParams, Session) {
					var deferred = $q.defer();

					Session.find({
							filter: {
								where: {
									_groupId: $stateParams.id,
									startAt: {lt: new Date()}
								}
							}
						}, function() {
							deferred.resolve(arguments[0].length);
						},
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				frequencyTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.sessionFrequencyTypes(
						function(result) { deferred.resolve(result.types); },
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				sessionDayTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.sessionDayTypes(
						function(result) { deferred.resolve(result.types); },
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				sessionTimeTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.sessionTimeTypes(
						function(result) { deferred.resolve(result.types); },
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				scripts: function(lazyScript){
					return lazyScript.register(['jstz']);
				}
			}
		})
		.state('app.group.join', {
			url: '/:id/join',
			data: {
				title: 'Join to group'
			},
			views: {
				'content@app': {
					templateUrl: 'app/group/group-join/group-join.view.html',
					controller: 'groupJoinController',
					controllerAs: 'vm',
				}
			},
			resolve: {
				scripts: function(lazyScript){
					return lazyScript.register([]);
				}
			}
		})
		.state('app.group.invite', {
			url: '/:id/invite',
			data: {
				title: 'Invite to group'
			},
			views: {
				'content@app': {
					templateUrl: 'app/group/group-invite/group-invite.view.html',
					controller: 'groupInviteController',
					controllerAs: 'vm',
				}
			},
			resolve: {
				scripts: function(lazyScript){
					return lazyScript.register([]);
				}
			}
		})
		.state('app.group.create', {
			url: '/create',
			data: {
				title: 'Create new group'
			},
			views: {
				'content@app': {
					templateUrl: 'app/group/group-create/group-create.view.html',
					controller: 'groupCreateController',
					controllerAs: 'vm',
				}
			},
			resolve: {
				groupTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.groupTypes(
						function(result) { deferred.resolve(result.types); },
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				penaltyAmounts: function($q, Additional) {
					var deferred = $q.defer();

					Additional.penaltyAmounts(
						function(result) { deferred.resolve(result.types); },
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				sessionFrequencyTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.sessionFrequencyTypes(
						function(result) { deferred.resolve(result.types); },
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				sessionDayTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.sessionDayTypes(
						function(result) { deferred.resolve(result.types); },
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				sessionTimeTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.sessionTimeTypes(
						function(result) { deferred.resolve(result.types); },
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				scripts: function(lazyScript){
					return lazyScript.register(['jstz']);
				}
			}
		});
}