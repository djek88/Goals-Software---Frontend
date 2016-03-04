'use strict';

angular
	.module('app.group')
	.controller('groupJoinController', groupJoinController);

function groupJoinController($state, $stateParams, Customer, notifyAndLeave, layoutLoader, groupJoinService, loadAppData) {
	var vm = this;

	vm.requestMessage = groupJoinService.defaultMessage(Customer.getCachedCurrent());

	vm.requestToGroup = requestToGroup;

	function requestToGroup() {
		var groupId = $stateParams.id;
		layoutLoader.on();

		groupJoinService.sendRequest(groupId, vm.requestMessage, function() {
			layoutLoader.off();

			notifyAndLeave({
				title: 'Send request...',
				content: 'Request was sent successfully!',
				leave: {to: 'app.group.detail', params: {id: groupId}}
			});
		});
	}
}