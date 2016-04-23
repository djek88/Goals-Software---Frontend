'use strict';

angular
	.module('app.basic')
	.factory('basicMyGoalsService', basicMyGoalsService);

function basicMyGoalsService($uibModal, Group) {
	var service = {
		prepareGroupsWithGoals: prepareGroupsWithGoals
	};
	return service;

	function prepareGroupsWithGoals(groups, goals) {
		groups.forEach(function(group) {
			group.goals = goals.filter(function(goal) {
				return goal._groupId.toString() === group._id.toString();
			});
		});

		return groups;
	}
}