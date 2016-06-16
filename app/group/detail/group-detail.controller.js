'use strict';

angular
	.module('app.group')
	.controller('groupDetailController', groupDetailController);

function groupDetailController(notifyAndLeave, layoutLoader, groupDetailService, APP_CONFIG, Customer, loadAppData, group, sessionsPassed, frequencyTypes, sessionDayTypes, sessionTimeTypes) {
	var vm = this;

	vm.urlBase = APP_CONFIG.apiRootUrl;
	vm.curCustomer = Customer.getCachedCurrent();
	vm.sessionsPassed = sessionsPassed;
	vm.group = null;
	vm.listMembersWithOwner = null;
	vm.isCurCustomerGroupMember = null;

	refreshData(group);

	vm.showEmailModal = showEmailModal;
	vm.removeOwner = removeOwner;
	vm.removeMember = removeMember;

	function refreshData(freshGroup) {
		group = freshGroup;
		vm.group = groupDetailService.prepareGroup(
			freshGroup,
			frequencyTypes,
			sessionDayTypes,
			sessionTimeTypes
		);
		vm.listMembersWithOwner = groupDetailService.getMembersWithOwner(freshGroup);
		vm.isCurCustomerGroupMember = groupDetailService.customerIsMember(vm.curCustomer._id, freshGroup);
	}

	function showEmailModal(memberId) {
		groupDetailService.emailModalOpen(group._id, memberId, function() {
			notifyAndLeave({
				title: 'Send Email...',
				message: 'Message sent success'
			});
		});
	}

	function removeOwner() {
		groupDetailService.deleteOwnerBox(group, function(buttonPressed, newOwnerId) {
			switch (buttonPressed) {
				case 'Delete group':
					layoutLoader.on();

					groupDetailService.deleteGroup(group._id, function() {
						notifyAndLeave({
							title: 'Remove group...',
							message: 'Group removed success!',
							leave: {to: 'app.group.myGroups'}
						});
					});
					break;

				case newOwnerId && 'Select new owner':
					layoutLoader.on();

					groupDetailService.changeOwner(group._id, newOwnerId, function() {
						notifyAndLeave({
							title: 'Change owner...',
							message: 'Owner changed success!',
							leave: {to: 'app.group.myGroups'}
						});
					});
					break;
			}
		});
	}

	function removeMember(memberId) {
		groupDetailService.deleteMemberBox(function() {
			layoutLoader.on();

			groupDetailService.removeMemberFromGroup(group, memberId, function(freshGroup) {
				layoutLoader.off();
				refreshData(freshGroup);

				notifyAndLeave({
					title: 'Remove member...',
					message: 'Group member removed success!'
				});
			});
		});
	}
}