'use strict';

angular
	.module('app.group')
	.controller('groupJoinController', groupJoinController);

function groupJoinController($state, $stateParams, Customer, groupJoinService, loadAppData) {
	var vm = this;

	vm.requestMessage = groupJoinService.defaultMessage(Customer.getCachedCurrent());

	vm.requestToGroup = requestToGroup;

	function requestToGroup() {
		var groupId = $stateParams.id;

		groupJoinService.sendRequest(groupId, vm.requestMessage, function() {
			$state.go('app.group.detail', {id: groupId});

			$.smallBox({
				title: 'Send request...',
				content: 'Request was sent successfully!',
				color: '#296191',
				timeout: 3000,
				icon: 'fa fa-bell swing animated'
			});
		});
	}
}