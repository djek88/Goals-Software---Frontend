'use strict';

angular
	.module('app.profile')
	.controller('profileSettingsController', profileSettingsController);

function profileSettingsController($scope, notifyAndLeave, layoutLoader, profileSettingsService, loadAppData) {
	var vm = this;

	var isChange = false;
	vm.customer = profileSettingsService.getCustomer();
	vm.timezoneMap = profileSettingsService.timeZoneMap;
	vm.imgData = profileSettingsService.getDefaultImgData();

	vm.save = save;

	$scope.$watch('vm.customer', function(newValue, oldValue) {
		isChange = newValue !== oldValue;
	}, true);

	function save() {
		if (!isChange) return;

		// Check password
		if (vm.customer.password || vm.customer.passwordConfirm) {
			if (vm.customer.password !== vm.customer.passwordConfirm) {
				vm.customer.password = vm.customer.passwordConfirm = '';

				return notifyAndLeave({
					title: 'Confirm password',
					content: 'Don\'t you know your own password?'
				});
			}
		}

		layoutLoader.on();

		profileSettingsService.saveCustomer(vm.customer, function(customer) {
			layoutLoader.off();

			vm.customer = profileSettingsService.getCustomer();
			setTimeout(function() { isChange = false; }, 50);

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

		// If will need validate file: ext, size
		// if (!file.type.includes('image/'))
		// if (file.size / 1024 > 200)

		// Update image display
		profileSettingsService.readFileAsDataUrl(file, function(result) {
			vm.imgData.selectedPicture = result;

			updateCustomerPicture();
		});
	});

	function updateCustomerPicture() {
		profileSettingsService.uploadPicture(
			vm.customer._id,
			vm.imgData.newPicture,
			function() {
				vm.imgData = profileSettingsService.getDefaultImgData();

				notifyAndLeave({
					title: 'Updating picture...',
					content: 'Updated.'
				});
			});
	}
}