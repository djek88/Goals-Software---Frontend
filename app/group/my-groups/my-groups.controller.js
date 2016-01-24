'use strict';

angular
	.module('app.group')
	.controller('myGroupsController', myGroupsController);

function myGroupsController(customer, groups) {
	var vm = this;

	vm.curCustomer = customer;
	vm.groups = groups;
}