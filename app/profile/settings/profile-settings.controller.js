'use strict';

angular
	.module('app.profile')
	.controller('profileSettingsController', profileSettingsController);

function profileSettingsController($scope, $cookies, APP_CONFIG, notifyAndLeave, layoutLoader, transformTimeTypes, readFileAsDataUrl, profileSettingsService, loadAppData, groupTypes, sessionTimeTypes, penaltyAmounts) {
	var vm = this;

	vm.customer = profileSettingsService.getCustomer();
	vm.imgData = profileSettingsService.getDefaultImgData();

	vm.groupTypesMap = profileSettingsService.buidTypesMap(groupTypes);
	vm.languagesMap = profileSettingsService.languagesMap;
	vm.timezoneMap = profileSettingsService.timeZoneMap;
	vm.times = transformTimeTypes(sessionTimeTypes);
	vm.penaltyAmounts = penaltyAmounts;

	vm.save = save;

	function save() {
		if(angular.equals(vm.customer, profileSettingsService.getCustomer())) return;

		layoutLoader.on();

		profileSettingsService.saveCustomer(vm.customer, function(customer) {
			layoutLoader.off();

			vm.customer = profileSettingsService.getCustomer();

			if ($cookies.get(APP_CONFIG.firstLoginCookie)) {
				$cookies.remove(APP_CONFIG.firstLoginCookie);

				return notifyAndLeave({
					title: 'Saving info...',
					message: 'Saved.',
					leave: {to: 'app.group.myGroups'}
				});
			}

			notifyAndLeave({
				title: 'Saving info...',
				message: 'Saved.'
			});
		});
	}

	$scope.$watch('vm.imgData.newPicture', function(newValue, oldValue) {
		if (newValue === oldValue || !newValue) {
			vm.imgData = profileSettingsService.getDefaultImgData();
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

			updateCustomerPicture();
		});
	});

	function updateCustomerPicture() {
		layoutLoader.on();

		profileSettingsService.uploadPicture(vm.imgData.newPicture, function() {
			layoutLoader.off();

			vm.imgData = profileSettingsService.getDefaultImgData();

			notifyAndLeave({
				title: 'Updating picture...',
				message: 'Updated.'
			});
		});
	}
}