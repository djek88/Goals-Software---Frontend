'use strict';

angular
	.module('app.group')
	.controller('groupJoinRequestsController', groupJoinRequestsController);

function groupJoinRequestsController(groupJoinRequestsService, activeRequests) {
	var vm = this;

	vm.requests = activeRequests;
	vm.totalRequestsCount = activeRequests.length;
	vm.requestsPerPage = 10;
	vm.curPageNumber = 1;

	vm.reqManage = reqManage;

	function reqManage(requestId, approve) {
		groupJoinRequestsService.manageRequest(requestId, approve, function() {
			groupJoinRequestsService.removeRequest(requestId, vm.requests);

			var content = 'Request was ' + (approve ? 'approved' : 'rejected') + ' successfully!';

			$.smallBox({
				title: 'Send responce...',
				content: content,
				color: '#296191',
				timeout: 3000,
				icon: 'fa fa-bell swing animated'
			});
		});
	}
}