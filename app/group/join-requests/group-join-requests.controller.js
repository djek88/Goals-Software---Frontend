'use strict';

angular
	.module('app.group')
	.controller('groupJoinRequestsController', groupJoinRequestsController);

function groupJoinRequestsController(notifyAndLeave, layoutLoader, groupJoinRequestsService, activeRequests) {
	var vm = this;

	vm.requests = activeRequests;
	vm.totalRequestsCount = activeRequests.length;
	vm.requestsPerPage = 10;
	vm.curPageNumber = 1;

	vm.reqManage = reqManage;

	function reqManage(requestId, approve) {
		layoutLoader.on();

		groupJoinRequestsService.manageRequest(requestId, approve, function() {
			layoutLoader.off();

			groupJoinRequestsService.removeRequest(requestId, vm.requests);

			var content = 'Request was ' + (approve ? 'approved' : 'rejected') + ' successfully!';

			notifyAndLeave({
				title: 'Send responce...',
				content: content
			});
		});
	}
}