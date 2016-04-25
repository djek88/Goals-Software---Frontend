'use strict';

angular
	.module('app.profile')
	.controller('profileSettingsController', profileSettingsController);

function profileSettingsController($scope, notifyAndLeave, layoutLoader, profileSettingsService, loadAppData) {
	var vm = this;

	vm.customer = profileSettingsService.getCustomer();
	vm.timezoneMap = profileSettingsService.timeZoneMap;
	vm.imgData = profileSettingsService.getDefaultImgData();

	vm.save = save;

	function save() {
		if(angular.equals(vm.customer, profileSettingsService.getCustomer())) return;

		layoutLoader.on();

		profileSettingsService.saveCustomer(vm.customer, function(customer) {
			layoutLoader.off();

			vm.customer = profileSettingsService.getCustomer();

			notifyAndLeave({
				title: 'Saving info...',
				content: 'Saved.'
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
				title: 'Updating picture...',
				content: 'File is not image!',
				isError: true,
				timeout: 8000
			});
		}

		if (file.size > maxFileSize) {
			return notifyAndLeave({
				title: 'Updating picture...',
				content: 'Max file size is 10 MB.',
				isError: true,
				timeout: 8000
			});
		}

		// Update image display
		profileSettingsService.readFileAsDataUrl(file, function(result) {
			vm.imgData.selectedPicture = result;

			updateCustomerPicture();
		});
	});

	function updateCustomerPicture() {
		layoutLoader.on();

		profileSettingsService.uploadPicture(
			vm.customer._id,
			vm.imgData.newPicture,
			function() {
				layoutLoader.off();

				vm.imgData = profileSettingsService.getDefaultImgData();

				notifyAndLeave({
					title: 'Updating picture...',
					content: 'Updated.'
				});
			});
	}
}