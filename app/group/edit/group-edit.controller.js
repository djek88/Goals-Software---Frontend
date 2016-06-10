'use strict';

angular
	.module('app.group')
	.controller('groupEditController', groupEditController);

function groupEditController($scope, notifyAndLeave, layoutLoader, transformTimeTypes, readFileAsDataUrl, groupEditService, group, groupTypes, penaltyAmounts, sessionFrequencyTypes, sessionDayTypes, sessionTimeTypes) {
	var vm = this;

	vm.group = angular.copy(group);
	vm.imgData = groupEditService.getDefaultImgData(group);
	vm.groupAttachment = null;

	vm.groupTypes = groupTypes;
	vm.penaltyAmounts = penaltyAmounts;
	vm.days = sessionDayTypes;
	vm.times = transformTimeTypes(sessionTimeTypes);
	vm.timezoneMap = groupEditService.timeZoneMap;
	vm.languagesMap = groupEditService.languagesMap;
	vm.frequency = sessionFrequencyTypes;

	vm.edit = edit;

	function edit() {
		if(angular.equals(vm.group, group)) return;
		layoutLoader.on();

		groupEditService.updateGroup(vm.group, function(freshGroup) {
			layoutLoader.off();

			group = freshGroup;
			vm.group = angular.copy(group);

			notifyAndLeave({
				title: 'Update group...',
				message: 'Group updated successfully!'
			});
		});
	}

	$scope.$watch('vm.imgData.newPicture', function(newValue, oldValue) {
		if (newValue === oldValue || !newValue) {
			vm.imgData = groupEditService.getDefaultImgData(group);
			return;
		}

		var file = newValue;
		var maxFileSize = 10 * 1024 * 1024; // 10 MB

		if (!file.type.includes('image/')) {
			return notifyAndLeave({
				type: 'error',
				title: 'Updating picture...',
				message: 'File is not image!',
				delay: 8000
			});
		}

		if (file.size > maxFileSize) {
			return notifyAndLeave({
				type: 'error',
				title: 'Updating picture...',
				message: 'Max file size is 10 MB.',
				delay: 8000
			});
		}

		// Update image display
		readFileAsDataUrl(file, function(result) {
			vm.imgData.selectedPicture = result;

			updateGroupPicture();
		});
	});

	$scope.$watch('vm.groupAttachment', function(newValue, oldValue) {
		if (newValue === oldValue || !newValue) {
			vm.groupAttachment = null;
			return;
		}

		var file = newValue;
		var maxFileSize = 10 * 1024 * 1024; // 10 MB

		if (file.type !== 'application/pdf') {
			vm.groupAttachment = null;

			return notifyAndLeave({
				type: 'error',
				title: 'Upload attachment...',
				message: 'Is not pdf file!',
				delay: 8000
			});
		}

		if (file.size > maxFileSize) {
			vm.groupAttachment = null;

			return notifyAndLeave({
				type: 'error',
				title: 'Upload attachment...',
				content: 'Max file size is 10 MB.',
				delay: 8000
			});
		}

		// Upload attachment
		layoutLoader.on();

		groupEditService.uploadAttachment(vm.groupAttachment, function(freshGroup) {
			layoutLoader.off();

			group = freshGroup;
			vm.group = angular.copy(group);
			vm.groupAttachment = null;

			notifyAndLeave({
				title: 'Updating attachment...',
				message: 'Updated.'
			});
		});
	});

	function updateGroupPicture() {
		layoutLoader.on();

		groupEditService.uploadPicture(vm.imgData.newPicture, function(freshGroup) {
			layoutLoader.off();

			group = freshGroup;
			vm.group = angular.copy(group);
			vm.imgData = groupEditService.getDefaultImgData(group);

			notifyAndLeave({
				title: 'Updating picture...',
				message: 'Updated.'
			});
		});
	}
}