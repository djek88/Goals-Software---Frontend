'use strict';

angular
	.module('app.group')
	.controller('groupUploadGoalEvidenceController', groupUploadGoalEvidenceController);

function groupUploadGoalEvidenceController(notifyAndLeave, layoutLoader, groupUploadGoalEvidenceService, loadAppData, goal, group) {
	var vm = this;

	vm.goal = groupUploadGoalEvidenceService.prepareGoal(goal, group);
	vm.feedbackReply = '';

	vm.leaveFeedback = leaveFeedback;

	function leaveFeedback() {
		layoutLoader.on();

		groupUploadGoalEvidenceService.leaveFeedback(vm.feedbackReply, function(freshGoal) {
			layoutLoader.off();

			vm.feedbackReply = '';
			vm.goal = groupUploadGoalEvidenceService.prepareGoal(freshGoal, group);
		});
	}

	console.log(goal);
	console.log();
	console.log(group);
}