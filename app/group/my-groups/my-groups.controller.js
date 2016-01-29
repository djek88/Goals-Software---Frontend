'use strict';

angular
	.module('app.group')
	.controller('myGroupsController', myGroupsController);

function myGroupsController(myGroupsService, customer, groups) {
	var vm = this;

	vm.curCustomer = customer;
	vm.groups = groups;

	vm.showEmailModal = showEmailModal;

	function showEmailModal(groupId) {
		myGroupsService.emailModalOpen(groupId, function() {
			$.smallBox({
				title: 'Send email...',
				content: 'Message sent success',
				color: '#296191',
				timeout: 3000,
				icon: 'fa fa-bell swing animated'
			});
		});
	}
}