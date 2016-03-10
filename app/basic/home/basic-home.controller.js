'use strict';

angular
	.module('app.basic')
	.controller('basicHomeController', basicHomeController);

function basicHomeController(Customer, notifyAndLeave, basicHomeService, loadAppData, groups) {
	var vm = this;

	//groups[0].NextSession.startAt = '2016-03-06T19:55:00.000Z';
	//groups[1].NextSession.startAt = '2016-02-26T12:10:00.000Z';

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
		basicHomeService.excuseModalOpen(groupId, function(freshSess) {
			vm.groups.forEach(function(group) {
				if (group._id === groupId) {
					group.NextSession = freshSess;
				}
			});

			notifyAndLeave({
				title: 'Send excuse...',
				content: 'Excuse was sent successfully!',
			});
		});
	}
}