'use strict';

angular
	.module('app.basic')
	.controller('basicHomeController', basicHomeController);

function basicHomeController(Customer, layoutLoader, basicHomeService, loadAppData, groups) {
	var vm = this;

	/*groups[0].NextSession.startAt = '2016-02-24T13:57:00.000Z'
	groups[1].NextSession.startAt = '2016-02-24T13:57:00.000Z'
	console.log(groups);*/

	vm.curCustomer = Customer.getCachedCurrent();
	vm.groups = groups;

	vm.onSessionStart = onSessionStart;
	vm.showExcuseModal = showExcuseModal;

	function onSessionStart(groupId) {
		vm.groups.forEach(function(group) {
			if (group._id === groupId) {
				delete group._nextSessionId;
				delete group.NextSession;
			}
		});
	}

	function showExcuseModal(groupId) {
		basicHomeService.excuseModalOpen(groupId, function() {
			$.smallBox({
				title: 'Send excuse...',
				content: 'Excuse was sent successfully!',
				color: '#296191',
				timeout: 3000,
				icon: 'fa fa-bell swing animated'
			});
		});
	}
}