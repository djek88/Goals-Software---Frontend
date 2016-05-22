'use strict';

angular
	.module('app.profile')
	.controller('profileDetailController', profileDetailController);

function profileDetailController($rootScope, profileDetailService, customer) {
	var vm = this;

	vm.customer = customer;
	vm.urlBase = $rootScope.urlBase;
}