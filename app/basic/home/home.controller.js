'use strict';

angular
	.module('app.basic')
	.controller('homeController', homeController);

function homeController(layoutLoader, homeService, loadAppData) {
	var vm = this;

	console.log('home');
}