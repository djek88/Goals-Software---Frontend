'use strict';

angular
	.module('app.profile')
	.controller('settingsController', settingsController);

function settingsController($scope, $rootScope, settingsService) {
	var vm = this;

	vm.customer = settingsService.getCustomer();
	vm.timezoneMap = settingsService.timeZoneMap;
	vm.imgData = settingsService.getDefaultImgData();

	vm.save = save;

	function save() {
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

		settingsService.saveCustomer(vm.customer, function(result) {
			vm.customer = settingsService.getCustomer();

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
			vm.imgData = settingsService.getDefaultImgData();
			return;
		}

		var file = newValue;

		// If will need validate file: ext, size
		// if (!file.type.includes('image/'))
		// if (file.size / 1024 > 200)

		// Update image display
		settingsService.readFileAsDataUrl(file, function(result) {
			vm.imgData.selectedPicture = result;

			updateCustomerPicture();
		});
	});

	function updateCustomerPicture() {
		settingsService.uploadPicture(
			vm.customer._id,
			vm.imgData.newPicture,
			function() {
				vm.imgData = settingsService.getDefaultImgData();

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