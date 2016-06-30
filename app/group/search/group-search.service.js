'use strict';

angular
	.module('app.group')
	.factory('groupSearchService', groupSearchService);

function groupSearchService(Group, APP_CONFIG) {
	var service = {
		findGroupsByCriteria: findGroupsByCriteria,
		preparedGroups: preparedGroups
	};
	return service;

	function findGroupsByCriteria(criteria, cb) {
		var filter = {
			where: {
				type: criteria.type,
				penalty: criteria.penalty
			}
		};

		if (filter.where.type === '-1') delete filter.where.type;
		if (filter.where.penalty === '-1') delete filter.where.penalty;

		Group.find({filter: filter}, cb);
	}

	function preparedGroups(groups, groupTypes) {
		var result = [];

		groups.forEach(function(group) {
			result.push({
				_id: group._id,
				avatar: APP_CONFIG.apiRootUrl + group.avatar,
				name: group.name,
				description: group.description,
				maxMembers: group.maxMembers,
				type: groupTypes[group.type]
			});
		});

		return result;
	}
}