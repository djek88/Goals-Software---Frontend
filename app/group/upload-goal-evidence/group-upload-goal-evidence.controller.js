'use strict';

angular
	.module('app.group')
	.controller('groupUploadGoalEvidenceController', groupUploadGoalEvidenceController);

function groupUploadGoalEvidenceController($scope, $rootScope, LoopBackAuth, notifyAndLeave, layoutLoader, groupUploadGoalEvidenceService, loadAppData, evidenceTypes, goal, group) {
	var vm = this;

	vm.goal = groupUploadGoalEvidenceService.prepareGoal(goal, group);
	vm.feedbackReply = '';
	vm.newFile = null;
	vm.popoverTemplate = 'fileInfoPopover.html';
	vm.token = LoopBackAuth.accessTokenId;

	vm.leaveFeedback = leaveFeedback;
	vm.deleteEvidence = deleteEvidence;
	vm.saveGoal = saveGoal;

	function leaveFeedback() {
		layoutLoader.on();

		groupUploadGoalEvidenceService.leaveFeedback(vm.feedbackReply, function(freshGoal) {
			layoutLoader.off();

			vm.feedbackReply = '';
			vm.goal = groupUploadGoalEvidenceService.prepareGoal(freshGoal, group);
		});
	}

	function deleteEvidence(file) {
		layoutLoader.on();

		groupUploadGoalEvidenceService.deleteEvidence(file, function(freshGoal) {
			layoutLoader.off();

			vm.goal = groupUploadGoalEvidenceService.prepareGoal(freshGoal, group);

			notifyAndLeave({
				title: 'Remove evidence...',
				content: 'Removed.'
			});
		});
	}

	function saveGoal() {
		if (goal.comments === vm.goal.comments &&
			angular.equals(goal.evidences, vm.goal.evidences)) {
			return notifyAndLeave({
				title: 'Save evidence...',
				content: 'You are not change comments or evidence files!'
			});
		}

		groupUploadGoalEvidenceService.saveEvidenceBox(function(needNotifyMembers) {
			layoutLoader.on();

			groupUploadGoalEvidenceService.updateCommentsAndNotifyMembers(vm.goal.comments, needNotifyMembers, function() {
				layoutLoader.off();

				notifyAndLeave({
					title: 'Save evidence...',
					content: 'Evidence save successfully!',
					leave: {
						to: 'app.group.memberGoals',
						params: {id: goal._groupId, memberId: goal._ownerId}
					}
				});
			});
		});
	}

	$scope.$watch('vm.newFile', function(newValue, oldValue) {
		if (newValue === oldValue || !newValue) return;

		var supportTypes = groupUploadGoalEvidenceService.supportEvidenceTypes(evidenceTypes);
		var supportExtns = groupUploadGoalEvidenceService.supportEvidenceExtens(evidenceTypes);

		if (supportTypes.indexOf(newValue.type) < 0) {
			return notifyAndLeave({
				box: 'bigBox',
				title: 'Supports the following types:',
				content: 'This can be: ' + supportExtns.join(', '),
				isError: true,
				timeout: 8000
			});
		}

		layoutLoader.on();

		groupUploadGoalEvidenceService.uploadEvidence(vm.newFile, function(freshGoal) {
			layoutLoader.off();

			vm.goal = groupUploadGoalEvidenceService.prepareGoal(freshGoal, group);
			vm.newFile = null;

			notifyAndLeave({
				title: 'Upload evidence...',
				content: 'Uploaded.'
			});
		});
	});
}