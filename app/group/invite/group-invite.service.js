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

		return 'Hi\n\nI would like to invite you to join my mastermind group. It is free to join and will be a lot of fun as well as a great way to increase your productivity. It is limited to only '
			+ group.maxMembers + ' members so if you are interested join now:\n\napp.themastermind.nz' + linkToGroup + '\n\nThanks\n\n' + userName;
	}

	function sendInvite(groupId, emails, message, cb) {
		Group.prototype$inviteNewMembers({
			id: groupId,
			emails: emails,
			request: message
		}, cb);
	}
}