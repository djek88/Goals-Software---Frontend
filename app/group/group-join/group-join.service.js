'use strict';

angular
	.module('app.group')
	.factory('groupJoinService', groupJoinService);

function groupJoinService(Group) {
	var service = {
		defaultMessage: defaultMessage,
		sendRequest: sendRequest
	};
	return service;

	function defaultMessage(customer) {
		var userName = customer.firstName + ' ' + customer.lastName;
		return 'Hi\n\nI would like to be added to your group if you will have me. \n\nThanks\n\n' + userName;
	}

	function sendRequest(groupId, message, cb) {
		Group.prototype$requestToJoin({
			id: groupId,
			request: message
		}, cb);
	}
}