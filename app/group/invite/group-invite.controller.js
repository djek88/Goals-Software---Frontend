'use strict';

angular
	.module('app.group')
	.controller('groupInviteController', groupInviteController);

function groupInviteController(Customer, notifyAndLeave, layoutLoader, groupInviteService, loadAppData, group) {
	var vm = this;

	vm.emails = '';
	vm.inviteMessage = groupInviteService.defaultMessage(Customer.getCachedCurrent(), group);

	vm.inviteToGroup = inviteToGroup;

	function inviteToGroup() {
		layoutLoader.on();

		groupInviteService.sendInvite(group._id, vm.emails, vm.inviteMessage, function() {
			layoutLoader.off();

			notifyAndLeave({
				title: 'Send invite...',
				content: 'Invite was sent successfully!',
				leave: {to: 'app.group.myGroups'}
			});
		});
	}
}