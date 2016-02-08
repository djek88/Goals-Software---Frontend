'use strict';

angular
	.module('app.group')
	.controller('groupInviteController', groupInviteController);

function groupInviteController(groupInviteService, customer, group) {
	var vm = this;

	vm.emails = '';
	vm.inviteMessage = groupInviteService.defaultMessage(customer, group);

	vm.sendInvite = sendInvite;

	function sendInvite() {
		alert('send');
	}
}