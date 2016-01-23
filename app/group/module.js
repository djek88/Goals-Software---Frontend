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
				groups: function($q, customer, Group) {
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
		});
}