'use strict';

angular
	.module('app.group')
	.factory('groupGoalEditService', groupGoalEditService);

function groupGoalEditService(Goal) {
	var service = {
		editGoal: editGoal
	};
	return service;

	function editGoal(goal, cb) {
		Goal.prototype$updateAttributes({id: goal._id}, goal, cb);
	}
}