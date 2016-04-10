'use strict';

angular
	.module('app.group')
	.factory('groupMemberGoalsService', groupMemberGoalsService);

function groupMemberGoalsService(Goal) {
	var service = {
		prepareGoals: prepareGoals
	};
	return service;

	function prepareGoals(goals) {
		return goals.map(function(goal) {
			var dueDate = moment(goal.dueDate).format('YY/MM/DD [at] ha');

			if (goal.state === 5) {
				goal.dueDate = 'Given up on: ' + dueDate;
			} else if (goal.state === 3) {
				goal.dueDate = 'Completed: ' + dueDate;
			} else {
				goal.dueDate = 'Due: ' + dueDate;
			}

			return goal;
		});
	}
}