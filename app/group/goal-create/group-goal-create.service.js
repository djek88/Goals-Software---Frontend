'use strict';

angular
	.module('app.group')
	.factory('groupGoalCreateService', groupGoalCreateService);

function groupGoalCreateService(Goal) {
	var service = {
		createGoal: Goal.create,
		getDefaultDate: getDefaultDate
	};
	return service;

	function getDefaultDate(group) {
		if (group.NextSession) return new Date(group.NextSession.startAt);

		var now = new Date();
		now.setDate(now.getDate() + 7);

		return now;
	}
}