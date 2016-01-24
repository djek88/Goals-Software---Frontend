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
				group: function($q, $stateParams, Group, customer) {
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
				scripts: function(lazyScript){
					return lazyScript.register([]);
				}
			}
		});
}