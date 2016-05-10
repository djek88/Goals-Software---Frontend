'use strict';

angular
	.module('app.group')
	.controller('groupEditController', groupEditController);

function groupEditController(notifyAndLeave, layoutLoader, groupEditService, group, groupTypes, penaltyAmounts, sessionFrequencyTypes, sessionDayTypes, sessionTimeTypes) {
	var vm = this;

	vm.groupTypes = groupTypes;
	vm.penaltyAmounts = penaltyAmounts;
	vm.days = sessionDayTypes;
	vm.times = groupEditService.prepareTimeTypes(sessionTimeTypes);
	vm.timezoneMap = groupEditService.timeZoneMap;
	vm.frequency = sessionFrequencyTypes;
	vm.group = angular.copy(group);

	vm.edit = edit;

	function edit() {
		if(angular.equals(vm.group, group)) return;
		layoutLoader.on();

		groupEditService.updateGroup(vm.group, function(freshGroup) {
			layoutLoader.off();

			group = freshGroup;
			vm.group = angular.copy(group);

			notifyAndLeave({
				title: 'Update group...',
				content: 'Group updated successfully!'
			});
		});
	}
}