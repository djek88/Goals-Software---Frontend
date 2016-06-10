'use strict';

angular
	.module('app.profile')
	.controller('profileDetailController', profileDetailController);

function profileDetailController(APP_CONFIG, profileDetailService, customer) {
	var vm = this;

	vm.customer = customer;
	vm.urlBase = APP_CONFIG.apiRootUrl;
}