'use strict';

angular
	.module('app.group')
	.factory('groupSearchService', groupSearchService);

function groupSearchService(Group) {
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

	function preparedGroups(groups) {
		var result = [];

		groups.forEach(function(group) {
			var created = new Date(group.createdAt).toLocaleString("en-US", {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});

			result.push({
				_id: group._id,
				name: group.name,
				members: group._memberIds.length,
				created: created
			});
		});

		return result;
	}
}