'use strict';

angular
	.module('app.basic')
	.controller('basicHomeController', basicHomeController);

function basicHomeController(Customer, notifyAndLeave, layoutLoader, basicHomeService, loadAppData, groups, goals) {
	var vm = this;

	//groups[0].NextSession.startAt = '2016-04-09T10:09:00.000Z';
	//groups[1].NextSession.startAt = '2016-02-26T12:10:00.000Z';

	vm.curCustomer = Customer.getCachedCurrent();
	vm.groups = basicHomeService.sortedGoals(groups, goals);
	vm.popoverTemplate = 'shedulePopover.html';
	vm.scheduledTime = '';

	vm.onSessionStart = onSessionStart;
	vm.showExcuseModal = showExcuseModal;
	vm.scheduleSession = scheduleSession;
	vm.closePopover = function(id) { vm[id] = false; };

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

	function scheduleSession(groupId) {
		if (!(vm.scheduledTime instanceof Date)) return;

		vm.closePopover(groupId);
		layoutLoader.on();

		var minStartAt = Date.now() + 7 * 60 * 1000;
		var startAt = vm.scheduledTime < minStartAt ? minStartAt : vm.scheduledTime.getTime();

		basicHomeService.scheduleNextSession(groupId, startAt, function(session) {
			layoutLoader.off();

			vm.groups.forEach(function(group) {
				if (group._id === groupId) {
					group._nextSessionId = session._id;
					group.NextSession = session;
				}
			});

			notifyAndLeave({
				title: 'Scheduled next session...',
				content: 'Next session start at date scheduled success!'
			});
		});

		vm.scheduledTime = '';
	}
}