"use strict";

angular
	.module('app.auth', [
		'ui.router',
		'backendApi'
		//'ezfb',
		//'googleplus'
	])
	.config(config)
	.constant('authKeys', {
		googleClientId: '',
		facebookAppId: ''
	});


function config($stateProvider
	//, ezfbProvider, GooglePlusProvider
	) {
	// GooglePlusProvider.init({
	// 	clientId: authKeys.googleClientId
	// });

	// ezfbProvider.setInitParams({
	// 	appId: authKeys.facebookAppId
	// });

	$stateProvider
		.state('login', {
			url: '/login',
			views: {
				root: {
					templateUrl: 'app/auth/login/login.view.html',
					controller: 'loginController',
					controllerAs: 'vm'
				}
			},
			data: {
				title: 'Login',
				htmlId: 'extr-page'
			},
			resolve: {
				srcipts: function(lazyScript){
					return lazyScript.register([
						'jquery-validation'
					]);
				}
			}
		});

		// .state('realLogin', {
		// 	url: '/real-login',
		// 	views: {
		// 		root: {
		// 			templateUrl: "app/auth/login/login.html",
		// 			controller: 'LoginCtrl'
		// 		}
		// 	},
		// 	data: {
		// 		title: 'Login',
		// 		rootId: 'extra-page'
		// 	}

		// })

		// .state('login', {
		// 	url: '/login',
		// 	views: {
		// 		root: {
		// 			templateUrl: 'app/auth/views/login.html'
		// 		}
		// 	},
		// 	data: {
		// 		title: 'Login',
		// 		htmlId: 'extr-page'
		// 	},
		// 	resolve: {
		// 		srcipts: function(lazyScript){
		// 			return lazyScript.register([
		// 				'jquery-validation'
		// 				])
		// 		}
		// 	}
		// })

		// .state('register', {
		// 	url: '/register',
		// 	views: {
		// 		root: {
		// 			templateUrl: 'app/auth/views/register.html'
		// 		}
		// 	},
		// 	data: {
		// 		title: 'Register',
		// 		htmlId: 'extr-page'
		// 	}
		// })

		// .state('forgotPassword', {
		// 	url: '/forgot-password',
		// 	views: {
		// 		root: {
		// 			templateUrl: 'app/auth/views/forgot-password.html'
		// 		}
		// 	},
		// 	data: {
		// 		title: 'Forgot Password',
		// 		htmlId: 'extr-page'
		// 	}
		// })

		// .state('lock', {
		// 	url: '/lock',
		// 	views: {
		// 		root: {
		// 			templateUrl: 'app/auth/views/lock.html'
		// 		}
		// 	},
		// 	data: {
		// 		title: 'Locked Screen',
		// 		htmlId: 'lock-page'
		// 	}
		// })
}
