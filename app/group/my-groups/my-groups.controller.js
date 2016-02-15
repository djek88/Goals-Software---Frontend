'use strict';

angular
	.module('app.group')
	.controller('myGroupsController', myGroupsController);

function myGroupsController(Customer, layoutLoader, myGroupsService, loadAppData, groups) {
	var vm = this;

	vm.curCustomer = Customer.getCachedCurrent();
	vm.groups = groups;
	vm.totalGroupsCount = groups.length;
	vm.groupsPerPage = 10;
	vm.curPageNumber = 1;

	vm.showEmailModal = showEmailModal;
	vm.leaveGroup = leaveGroup;

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

	function leaveGroup(groupId) {
		myGroupsService.leaveGroupBox(function() {
			layoutLoader.on();

			myGroupsService.leaveGroup(groupId, vm.curCustomer._id, function() {
				layoutLoader.off();

				myGroupsService.updateGroups(groupId, vm.groups);

				$.smallBox({
					title: 'Leave group...',
					content: 'Leave group success',
					color: '#296191',
					timeout: 3000,
					icon: 'fa fa-bell swing animated'
				});
			});
		});
	}
}