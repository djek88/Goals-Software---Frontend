'use strict';

angular
	.module('app.group')
	.controller('groupUploadGoalEvidenceController', groupUploadGoalEvidenceController);

function groupUploadGoalEvidenceController($scope, APP_CONFIG, LoopBackAuth, notifyAndLeave, layoutLoader, groupUploadGoalEvidenceService, loadAppData, evidenceTypes, goal, group) {
	var vm = this;

	vm.goal = groupUploadGoalEvidenceService.prepareGoal(goal, group);
	vm.feedbackReply = '';
	vm.newFile = null;
	vm.popoverTemplate = 'fileInfoPopover.html';
	vm.token = LoopBackAuth.accessTokenId;
	vm.urlBase = APP_CONFIG.apiRootUrl;

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
				message: 'Removed.'
			});
		});
	}

	function saveGoal() {
		if (goal.comments === vm.goal.comments &&
			angular.equals(goal.evidences, vm.goal.evidences)) {
			return notifyAndLeave({
				title: 'Save evidence...',
				message: 'You are not change comments or evidence files!'
			});
		}

		groupUploadGoalEvidenceService.saveEvidenceBox(function(needNotifyMembers) {
			layoutLoader.on();

			groupUploadGoalEvidenceService.updateCommentsAndNotifyMembers(vm.goal.comments, needNotifyMembers, function() {
				layoutLoader.off();

				notifyAndLeave({
					title: 'Save evidence...',
					message: 'Evidence save successfully!',
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
		var maxFileSize = 10 * 1024 * 1024; // 10 MB

		if (supportTypes.indexOf(newValue.type) < 0) {
			return notifyAndLeave({
				type: 'error',
				title: 'Supports the following types:',
				message: 'This can be: ' + supportExtns.join(', '),
				delay: 8000
			});
		}

		if (newValue.size > maxFileSize) {
			return notifyAndLeave({
				title: 'Upload evidence...',
				message: 'Max file size is 10 MB.',
				delay: 8000
			});
		}

		layoutLoader.on();

		groupUploadGoalEvidenceService.uploadEvidence(vm.newFile, function(freshGoal) {
			layoutLoader.off();

			vm.goal = groupUploadGoalEvidenceService.prepareGoal(freshGoal, group);
			vm.newFile = null;

			notifyAndLeave({
				title: 'Upload evidence...',
				message: 'Uploaded.'
			});
		});
	});
}