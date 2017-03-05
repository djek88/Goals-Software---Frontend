'use strict';

angular
	.module('app.group')
	.controller('groupCreateController', groupCreateController);

function groupCreateController($scope, notifyAndLeave, layoutLoader, transformTimeTypes, readFileAsDataUrl, groupCreateService, groupTypes, penaltyAmounts, sessionFrequencyTypes, sessionDayTypes, sessionTimeTypes, countriesData) {
	var vm = this;

	vm.group = groupCreateService.prepareGroup(groupTypes, penaltyAmounts, sessionDayTypes, sessionTimeTypes, sessionFrequencyTypes);
	vm.imgData = groupCreateService.getDefaultImgData(vm.group);
	vm.groupAttachment = null;

	vm.groupTypes = groupTypes;
	vm.penaltyAmounts = penaltyAmounts;
	vm.countriesMap = groupCreateService.countriesMap(countriesData);
	vm.statesMap = groupCreateService.uploadStatesOrCitiesMap();
	vm.days = sessionDayTypes;
	vm.times = transformTimeTypes(sessionTimeTypes);
	vm.timezoneMap = groupCreateService.timeZoneMap;
	vm.languagesMap = groupCreateService.languagesMap;
	vm.frequency = sessionFrequencyTypes;

	vm.create = create;

	$scope.$watch('vm.imgData.newPicture', function(newValue, oldValue) {
		if (newValue === oldValue || !newValue) {
			vm.imgData = groupCreateService.getDefaultImgData(vm.group);
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
	});

	$scope.$watch('vm.group.sessionConf.country', function(newValue, oldValue) {
		if (newValue === oldValue) return;

		vm.group.sessionConf.state = '';

		if (newValue) {
			layoutLoader.on();

			groupCreateService.uploadStatesOrCitiesMap(newValue, null, function(states) {
				layoutLoader.off();
				vm.statesMap = states;
			});
		} else {
			vm.statesMap = groupCreateService.uploadStatesOrCitiesMap();
		}
	});

	$scope.$watch('vm.group.sessionConf.state', function(newValue, oldValue) {
		vm.group.sessionConf.city = '';
	});

	function create() {
		layoutLoader.on();

		groupCreateService.createGroup(vm.group, function(newGroup) {
			var reqsAlreadyDone = 0;
			var reqsNeedPerform = 0;

			if (!vm.groupAttachment && !vm.imgData.newPicture) {
				leavePage();
				return;
			}

			if (vm.groupAttachment) {
				reqsNeedPerform++;
				groupCreateService.uploadAttachment(vm.groupAttachment, newGroup._id, confirmComplete);
			}

			if (vm.imgData.newPicture) {
				reqsNeedPerform++;
				groupCreateService.uploadPicture(vm.imgData.newPicture, newGroup._id, confirmComplete);
			}

			function confirmComplete() {
				reqsAlreadyDone++;
				if (reqsAlreadyDone !== reqsNeedPerform) return;

				leavePage();
			}

			function leavePage() {
				layoutLoader.off();

				notifyAndLeave({
					title: 'Create group...',
					message: 'Group created successfully!',
					leave: {to: 'app.group.detail', params: {id: newGroup._id}}
				});
			}
		});
	}
}