'use strict';

angular
	.module('app.profile')
	.controller('profileSettingsController', profileSettingsController);

function profileSettingsController($scope, $rootScope, profileSettingsService, loadAppData) {
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

				return $.smallBox({
					title: 'Confirm password',
					content: 'Don\'t you know your own password?',
					color: '#C46A69',
					iconSmall: 'fa fa-thumbs-down bounce animated',
					timeout: 3000
				});
			}
		}

		profileSettingsService.saveCustomer(vm.customer, function(customer) {
			vm.customer = profileSettingsService.getCustomer();
			setTimeout(function() { isChange = false; }, 50);

			$.smallBox({
				title: 'Ding Dong!',
				content: 'Saved',
				color: '#296191',
				timeout: 3000,
				icon: 'fa fa-bell swing animated'
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

				$.smallBox({
					title: 'Ding Dong!',
					content: 'Saved',
					color: '#296191',
					timeout: 3000,
					icon: 'fa fa-bell swing animated'
				});
			});
	}
}