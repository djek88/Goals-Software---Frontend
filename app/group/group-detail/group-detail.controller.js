'use strict';

angular
	.module('app.group')
	.controller('groupDetailController', groupDetailController);

function groupDetailController($rootScope, groupDetailService, customer, group) {
	var vm = this;

	vm.urlBase = $rootScope.urlBase;
	vm.curCustomer = customer;
	vm.group = group;
	vm.listMembersWithOwner = groupDetailService.getMembersWithOwner(group);
	//vm.isCurCustomerGroupMember = groupDetailService.customerIsMember(vm.curCustomer._id, vm.group);

	vm.removeOwner = removeOwner;
	vm.removeMember = removeMember;

	function removeOwner() {
		groupDetailService.deleteOwnerBox(group, function(buttonPressed, newOwnerId) {
			switch (buttonPressed) {
				case 'Delete group':
					groupDetailService.deleteGroup(vm.group._id, function() {
						groupDetailService.notifyAndLeavePage({
							title: 'Remove group...',
							message: 'Group removed success!',
							toState: 'app.group.myGroups'
						});
					});
					break;

				case 'Select new owner' && newOwnerId:
					groupDetailService.changeOwner(vm.group, newOwnerId, function() {
						groupDetailService.notifyAndLeavePage({
							title: 'Change owner...',
							message: 'Owner changed success!',
							toState: 'app.group.myGroups'
						});
					});
					break;
			}
		});
	}

	function removeMember(memberId) {
		groupDetailService.deleteMemberBox(function() {
			groupDetailService.removeMemberFromGroup(group, memberId, function(group) {
				vm.group = group;
				vm.listMembersWithOwner = groupDetailService.getMembersWithOwner(group);

				groupDetailService.notifyAndLeavePage({
					title: 'Remove member...',
					message: 'Group member removed success!'
				});
			});
		});
	}
}