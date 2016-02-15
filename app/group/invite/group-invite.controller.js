'use strict';

angular
	.module('app.group')
	.controller('groupInviteController', groupInviteController);

function groupInviteController($state, Customer, layoutLoader, groupInviteService, loadAppData, group) {
	var vm = this;

	vm.emails = '';
	vm.inviteMessage = groupInviteService.defaultMessage(Customer.getCachedCurrent(), group);

	vm.inviteToGroup = inviteToGroup;

	function inviteToGroup() {
		layoutLoader.on();

		groupInviteService.sendInvite(group._id, vm.emails, vm.inviteMessage, function() {
			layoutLoader.off();

			$state.go('app.group.myGroups');

			$.smallBox({
				title: 'Send invite...',
				content: 'Invite was sent successfully!',
				color: '#296191',
				timeout: 3000,
				icon: 'fa fa-bell swing animated'
			});
		});
	}
}