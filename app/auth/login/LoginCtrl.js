"use strict";

angular
	.module('app.auth')
	.controller('LoginCtrl', loginCtrl);

function loginCtrl($scope, $location, Customer) {
	$scope.credentials = {
		email: '',
		password: ''
	};
	$scope.rememberMe = false;
	$scope.login = login;

	function login() {
		Customer.login({rememberMe: $scope.rememberMe}, $scope.credentials,
			function() {
				var next = $location.nextAfterLogin || '/';
				$location.nextAfterLogin = null;
				$location.path(next);
			}
		);
	}

	/*$scope.$on('event:google-plus-signin-success', function (event, authResult) {
		if (authResult.status.method == 'PROMPT') {
			GooglePlus.getUser().then(function (user) {
				User.username = user.name;
				User.picture = user.picture;
				$state.go('app.dashboard');
			});
		}
	});

	$scope.$on('event:facebook-signin-success', function (event, authResult) {
		ezfb.api('/me', function (res) {
			User.username = res.name;
			User.picture = 'https://graph.facebook.com/' + res.id + '/picture';
			$state.go('app.dashboard');
		});
	});*/
}
