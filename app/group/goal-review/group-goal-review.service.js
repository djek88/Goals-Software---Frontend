'use strict';

angular
	.module('app.group')
	.factory('groupGoalReviewService', groupGoalReviewService);

function groupGoalReviewService($http, $stateParams, $uibModal, Goal, APP_CONFIG) {
	var service = {
		prepareGoal: prepareGoal,
		leaveFeedback: leaveFeedback,
		sendVote: sendVote,
		voteModalOpen: voteModalOpen
	};
	return service;

	function prepareGoal(goal, group) {
		var members = group.Members ? group.Members.concat(group.Owner) : [group.Owner];
		var result = angular.copy(goal);

		result.feedbacks.forEach(function(feedback) {
			members.forEach(function(member) {
				if (member._id === feedback._id) {
					feedback.fullName = member.firstName + ' ' + member.lastName;
				}
			});

			feedback.fullName = feedback.fullName || 'Unknown member';
		});

		return result;
	}

	function leaveFeedback(feedback, cb) {
		Goal.prototype$leaveFeedback({
			id: $stateParams.goalId
		}, {
			feedback: feedback
		}, cb);
	}

	function sendVote(approve, comment, cb) {
		Goal.prototype$leaveVote({
			id: $stateParams.goalId
		}, {
			achieve: approve,
			comment: comment
		}, cb);
	}

	function voteModalOpen(cb) {
		$uibModal.open({
			animation: true,
			templateUrl: 'app/shared/modal-components/shared-modal.view.html',
			controller: 'voteModalController',
			controllerAs: 'vm',
			resolve: {
				modalTitle: function() { return 'Leave comment for goal owner'; }
			}
		}).result.then(cb);
	}
}