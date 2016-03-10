'use strict';

angular
	.module('app.group')
	.controller('groupSessionExcusesController', groupSessionExcusesController);

function groupSessionExcusesController(notifyAndLeave, layoutLoader, groupSessionExcusesService, group) {
	var vm = this;

	vm.excuses = groupSessionExcusesService.prepareExcuses(group);

	vm.excuseReject = excuseReject;

	function excuseReject(excuseId) {
		layoutLoader.on();

		groupSessionExcusesService.rejectExcuse(excuseId, function() {
			layoutLoader.off();

			groupSessionExcusesService.removeExcuse(excuseId, vm.excuses);

			notifyAndLeave({
				title: 'Send responce...',
				content: 'Excuse rejected seccessfully.',
				leave: vm.excuses.length ? null : {to: 'app.group.myGroups'}
			});
		});
	}
}