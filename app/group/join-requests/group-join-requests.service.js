'use strict';

angular
	.module('app.group')
	.factory('groupJoinRequestsService', groupJoinRequestsService);

function groupJoinRequestsService($stateParams, Group) {
	var service = {
		manageRequest: manageRequest,
		removeRequest: removeRequest
	};
	return service;

	function manageRequest(requestId, approve, cb) {
		var groupId = $stateParams.id;
		var method = approve ? 'prototype$approveRequest' : 'prototype$rejectRequest';

		Group[method]({id: groupId, requestId: requestId}, null, cb);
	}

	function removeRequest(requestId, requests) {
		for (var i = requests.length - 1; i >= 0; i--) {
			if (requests[i]._id == requestId) {
				requests.splice(i, 1);
				break;
			}
		}
	}
}