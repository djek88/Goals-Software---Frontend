'use strict';

angular
	.module('app.group')
	.factory('groupInviteService', groupInviteService);

function groupInviteService($state, Group) {
	var service = {
		defaultMessage: defaultMessage,
		sendInvite: sendInvite
	};
	return service;

	function defaultMessage(customer, group) {
		var linkToGroup = $state.href("reviewGroup", { id: group._id });
		var userName = customer.firstName + ' ' + customer.lastName;

		return 'Hi\n\n'
			+ 'I would like to invite you to join my mastermind group. It is free to join and will be a lot of fun as well as a great way to increase your productivity. It is limited to only '
			+ group.maxMembers + ' members so if you are interested apply to join now.\n\n'
			+ 'Step 1) Create your free account at www.themastermind.nz\n\n'
			+ 'Step 2) Go to app.themastermind.nz' + linkToGroup + ' and apply to join\n\n'
			+ 'Step 3) Wait for me to approve your request (approval is a manual process, but I will try to process it as soon as possible)\n\n'
			+ 'Thanks\n\n'
			+ userName;
	}

	function sendInvite(groupId, emails, message, cb) {
		Group.prototype$inviteNewMembers({
			id: groupId,
			emails: emails,
			request: message
		}, cb);
	}
}