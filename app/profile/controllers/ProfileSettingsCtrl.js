'use strict';

angular
	.module('app.profile')
	.controller('ProfileSettingsCtrl', ProfileSettingsCtrl);

function ProfileSettingsCtrl($rootScope, $scope, LoopBackAuth, $http, Customer, APP_CONFIG) {
	var customer = Customer.getCachedCurrent();
	var tz = jstz.determine();

	$scope.timezoneMap = [];
	$scope.profile = {
		firstName: customer.firstName,
		lastName: customer.lastName,
		email: customer.email,
		username: customer.username,
		timeZone: customer.timeZone,
		description: customer.description,
		social: customer.social
	};

	$scope.save = save;

	// Init profile timezone
	if ($scope.profile.timeZone === '') {
		$scope.profile.timeZone = tz.name();
	}

	// Build timezone map
	_.forEach(moment.tz.names(), function(zoneName) {
		var tz = moment.tz(zoneName);
		$scope.timezoneMap.push({
			id: zoneName,
			name: zoneName.replace(/_/g, ' '),
			offset: 'UTC' + tz.format('Z'),
			nOffset: tz.utcOffset()
		});
	});

	function save() {
		var userId = Customer.getCurrentId();

		// Check password
		if ($scope.profile.password || $scope.profile.passwordConfirm) {
			if ($scope.profile.password !== $scope.profile.passwordConfirm) {
				delete $scope.profile.password;
				delete $scope.profile.passwordConfirm;

				$.smallBox({
					title: 'Confirm password',
					content: 'Don\'t you know your own password?',
					color: '#C46A69',
					iconSmall: 'fa fa-thumbs-down bounce animated',
					timeout: 3000
				});

				return false;
			}
		}

		// Send update
		Customer.prototype$updateAttributes({id: userId}, $scope.profile, function(result) {
			var attrs = Object.keys($scope.profile);

			for (var i = attrs.length - 1; i >= 0; i--) {
				LoopBackAuth.currentUserData[attrs[i]] = result[attrs[i]];
			}

			$rootScope.$applyAsync();
			$.smallBox({
				title: 'Ding Dong!',
				content: 'Saved',
				color: '#296191',
				timeout: 3000,
				icon: 'fa fa-bell swing animated'
			});
		});
	}


	$scope.currentPicture = $rootScope.urlBase + customer.avatar;
	$scope.picture = {
		selectedPicture: null,
		newProviderPicture: null
	};

	$scope.$watch('picture.newProviderPicture', function(newValue, oldValue) {
		if (newValue === oldValue || !newValue) {
			return setDefValue();
		}

		var file = newValue;

		/*var errorHandler = function (error) {
			setDefValue();
			document.getElementById('picture').value = null;
			$scope.errors.provider = [error];
		};

		if (!file.type.includes('image/')) {
			return errorHandler('File must be picture.');
		}

		if (file.size / 1024 > 200) {
			return errorHandler('Only files of 200 KB or less can be uploaded.');
		}*/

		var fileReader = new FileReader();

		fileReader.onload = function() {
			$scope.$apply(function () {
				$scope.picture.selectedPicture = fileReader.result;
			});

			updateCustomerPicture();
		};

		fileReader.readAsDataURL(file);
	});

	var setDefValue = function () {
		$scope.picture.selectedPicture = $scope.currentPicture;
		$scope.picture.newProviderPicture = null;
	};

	function updateCustomerPicture() {
		var url = APP_CONFIG.apiRootUrl + '/Customers/' + customer._id + '/upload-avatar';

		var fd = new FormData();
		fd.append('file', $scope.picture.newProviderPicture);

		$http.post(url, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}).success(function(result){
			$scope.currentPicture = $rootScope.urlBase + result.link;

			$.smallBox({
				title: 'Ding Dong!',
				content: 'Saved',
				color: '#296191',
				timeout: 3000,
				icon: 'fa fa-bell swing animated'
			});

			setDefValue();
		});
	}
}