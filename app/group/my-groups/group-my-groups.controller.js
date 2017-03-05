'use strict';

angular
	.module('app.group')
	.controller('groupMyGroupsController', groupMyGroupsController);

function groupMyGroupsController(Customer, notifyAndLeave, layoutLoader, groupMyGroupsService, loadAppData, groups) {
	var vm = this;

	vm.curCustomer = Customer.getCachedCurrent();
	vm.groups = groups;
	vm.totalGroupsCount = groups.length;
	vm.groupsPerPage = 10;
	vm.curPageNumber = 1;

	vm.showEmailModal = showEmailModal;
	vm.leaveGroup = leaveGroup;

	function showEmailModal(groupId) {
		groupMyGroupsService.emailModalOpen(groupId, function() {
			notifyAndLeave({
				title: 'Send email...',
				message: 'Message sent success'
			});
		});
	}

	function leaveGroup(groupId) {
		groupMyGroupsService.leaveGroupBox(function() {
			layoutLoader.on();

			groupMyGroupsService.leaveGroup(groupId, vm.curCustomer._id, function() {
				layoutLoader.off();

				groupMyGroupsService.updateGroups(groupId, vm.groups);

				notifyAndLeave({
					title: 'Leave group...',
					message: 'Leave group success'
				});
			});
		});
	}
}