'use strict';

angular
	.module('app.group')
	.controller('groupCreateController', groupCreateController);

function groupCreateController(notifyAndLeave, layoutLoader, groupCreateService, groupTypes, penaltyAmounts, sessionFrequencyTypes, sessionDayTypes, sessionTimeTypes) {
	var vm = this;

	vm.groupTypes = groupTypes;
	vm.penaltyAmounts = penaltyAmounts;
	vm.days = sessionDayTypes;
	vm.times = groupCreateService.prepareTimeTypes(sessionTimeTypes);
	vm.timezoneMap = groupCreateService.timeZoneMap;
	vm.frequency = sessionFrequencyTypes;
	vm.group = groupCreateService.prepareGroup(groupTypes, penaltyAmounts, sessionDayTypes, sessionTimeTypes, sessionFrequencyTypes);

	vm.create = create;

	function create() {
		layoutLoader.on();

		groupCreateService.createGroup(vm.group, function(newGroup) {
			layoutLoader.off();

			notifyAndLeave({
				title: 'Create group...',
				content: 'Group created successfully!',
				leave: {to: 'app.group.detail', params: {id: newGroup._id}}
			});
		});
	}
}