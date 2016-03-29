'use strict';

angular
	.module('app.group')
	.factory('groupUploadGoalEvidenceService', groupUploadGoalEvidenceService);

function groupUploadGoalEvidenceService($stateParams, Goal) {
	var service = {
		prepareGoal: prepareGoal,
		leaveFeedback: leaveFeedback
	};
	return service;

	function prepareGoal(goal, group) {
		var members = group.Members ? group.Members.concat(group.Owner) : [group.Owner];

		goal.feedbacks.forEach(function(feedback) {
			members.forEach(function(member) {
				if (member._id === feedback._id) {
					feedback.fullName = member.firstName + ' ' + member.lastName;
				}
			});

			feedback.fullName = feedback.fullName || 'Unknown member';
		});

		return goal;
	}

	function leaveFeedback(feedback, cb) {
		Goal.prototype$leaveFeedback({
			id: $stateParams.goalId
		}, {
			feedback: feedback
		}, cb);
	}
}