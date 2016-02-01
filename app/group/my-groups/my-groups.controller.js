'use strict';

angular
	.module('app.group')
	.controller('myGroupsController', myGroupsController);

function myGroupsController(myGroupsService, Group, customer, groups) {
	var vm = this;

	vm.curCustomer = customer;
	vm.groups = groups;

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
			Group.Members.unlink({id: groupId, fk: vm.curCustomer._id}, function() {
				// update group list
				for (var i = vm.groups.length - 1; i >= 0; i--) {
					if (vm.groups[i]._id == groupId) {
						vm.groups.splice(i, 1);
						break;
					}
				}

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