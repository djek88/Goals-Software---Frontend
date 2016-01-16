'use strict';

angular
	.module('app.profile')
	.controller('ProfileSettingsCtrl', function ($rootScope, $scope, LoopBackAuth, Customer) {
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
			social: customer.social,
			avatar: customer.avatar
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
			var userId =  Customer.getCurrentId();

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
	});