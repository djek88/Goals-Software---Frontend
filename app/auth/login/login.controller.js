'use strict';

angular
	.module('app.auth')
	.controller('loginController', loginController);

function loginController($scope, $state, Customer) {
	var vm = this;

	vm.rememberMe = false;
	vm.credentials = {
		email: '',
		password: ''
	};

	vm.login = login;

	function login() {
		if ($scope.loginForm.$valid) {
			Customer.login({ rememberMe: vm.rememberMe }, vm.credentials, function() {
				var next = $state.nextAfterLogin || 'app.home';
				var nextParams = $state.nextAfterLoginParams || null;

				$state.nextAfterLogin = null;
				$state.nextAfterLoginParams = null;

				$state.go(next, nextParams);
			});
		}
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
