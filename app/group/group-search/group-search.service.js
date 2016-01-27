'use strict';

angular
	.module('app.group')
	.factory('groupSearchService', groupSearchService);

function groupSearchService(Group) {
	var service = {
		prepareGroupTypes: prepareGroupTypes,
		findGroupsByCriteria: findGroupsByCriteria,
		preparedGroups: preparedGroups
	};
	return service;

	function prepareGroupTypes(types) {
		types[0] = 'Please Choose';
		return types;
	}

	function findGroupsByCriteria(criteria, cb) {
		var filter = {
			where: {
				type: criteria.type,
				penalty: criteria.penalty
			}
		};

		if (filter.where.type === '0') delete filter.where.type;

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