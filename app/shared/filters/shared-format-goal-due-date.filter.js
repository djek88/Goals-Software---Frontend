'use strict';

angular
	.module('app.shared')
	.filter('formatGoalDueDate', formatGoalDueDate);

function formatGoalDueDate() {
	return function(dueDate, goalState) {
		var result = '';
		dueDate = moment(dueDate).format('YY/MM/DD [at] ha');

		if (goalState === 5) {
			result = 'Given up on: ' + dueDate;
		} else if (goalState === 3) {
			result = 'Completed: ' + dueDate;
		} else {
			result = 'Due: ' + dueDate;
		}

		return result;
	}
}