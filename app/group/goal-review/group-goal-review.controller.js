'use strict';

angular
	.module('app.group')
	.controller('groupGoalReviewController', groupGoalReviewController);

function groupGoalReviewController(APP_CONFIG, LoopBackAuth, notifyAndLeave, layoutLoader, groupGoalReviewService, loadAppData, goal, group) {
	var vm = this;

	vm.goal = groupGoalReviewService.prepareGoal(goal, group);
	vm.feedback = '';
	vm.popoverTemplate = 'fileInfoPopover.html';
	vm.token = LoopBackAuth.accessTokenId;
	vm.urlBase = APP_CONFIG.apiRootUrl;

	vm.leaveFeedback = leaveFeedback;
	vm.leaveVote = leaveVote;

	function leaveFeedback() {
		layoutLoader.on();

		groupGoalReviewService.leaveFeedback(vm.feedback, function(freshGoal) {
			layoutLoader.off();

			vm.feedback = '';
			vm.goal = groupGoalReviewService.prepareGoal(freshGoal, group);
		});
	}

	function leaveVote(approve) {
		if (approve) {
			layoutLoader.on();

			groupGoalReviewService.sendVote(approve, '', updateGoalModel);
		} else {
			groupGoalReviewService.voteModalOpen(function(comment) {
				layoutLoader.on();

				groupGoalReviewService.sendVote(approve, comment, updateGoalModel);
			});
		}

		function updateGoalModel(freshGoal) {
			layoutLoader.off();

			vm.goal = groupGoalReviewService.prepareGoal(goal, group);

			notifyAndLeave({
				title: 'Leave vote...',
				message: 'Leave vote success'
			});
		}
	}
}