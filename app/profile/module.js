'use strict';

angular
	.module('app.profile', [
		'ui.router',
		'backendApi',
		'file-model'
	])
	.config(config);

function config($stateProvider) {
	$stateProvider
		.state('app.profile', {
			abstract: true,
			url: '/profile',
			template: '<ui-view/>'
		})
		.state('app.profile.view', {
			url: '/view',
			views: {
				'content@app': {
					templateUrl: 'app/profile/views/profile-view.html'
				}
			}
		})
		.state('app.profile.settings', {
			url: '/settings',
			data: {
				title: 'Settings page'
			},
			views: {
				'content@app': {
					controller: 'ProfileSettingsCtrl',
					templateUrl: 'app/profile/views/profile-settings.html'
				}
			},
			resolve: {
				scripts: function(lazyScript){
					return lazyScript.register(['select2', 'jstz']);
				}
			}
		});
}