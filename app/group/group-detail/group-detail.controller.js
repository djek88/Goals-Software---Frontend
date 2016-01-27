'use strict';

angular
	.module('app.group')
	.controller('groupDetailController', groupDetailController);

function groupDetailController($rootScope, groupDetailService, customer, group, sessionsPassed, frequencyTypes) {
	var vm = this;

	console.log(group);

	vm.urlBase = $rootScope.urlBase;
	vm.curCustomer = customer;
	vm.sessionsPassed = sessionsPassed;
	vm.group = null;
	vm.listMembersWithOwner = null;
	vm.isCurCustomerGroupMember = null;

	refreshData(group);

	vm.removeOwner = removeOwner;
	vm.removeMember = removeMember;

	function refreshData(freshGroup) {
		group = freshGroup;
		vm.group = groupDetailService.prepareGroup(freshGroup, frequencyTypes);
		vm.listMembersWithOwner = groupDetailService.getMembersWithOwner(freshGroup);
		vm.isCurCustomerGroupMember = groupDetailService.customerIsMember(customer._id, freshGroup);
	}

	function removeOwner() {
		groupDetailService.deleteOwnerBox(group, function(buttonPressed, newOwnerId) {
			switch (buttonPressed) {
				case 'Delete group':
					groupDetailService.deleteGroup(group._id, function() {
						groupDetailService.notifyAndLeavePage({
							title: 'Remove group...',
							message: 'Group removed success!',
							toState: 'app.group.myGroups'
						});
					});
					break;

				case 'Select new owner' && newOwnerId:
					groupDetailService.changeOwner(group._id, newOwnerId, function() {
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
			groupDetailService.removeMemberFromGroup(group, memberId, function(freshGroup) {
				refreshData(freshGroup);

				groupDetailService.notifyAndLeavePage({
					title: 'Remove member...',
					message: 'Group member removed success!'
				});
			});
		});
	}
}