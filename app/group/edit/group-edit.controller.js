'use strict';

angular
	.module('app.group')
	.controller('groupEditController', groupEditController);

function groupEditController($scope, notifyAndLeave, layoutLoader, groupEditService, group, groupTypes, penaltyAmounts, sessionFrequencyTypes, sessionDayTypes, sessionTimeTypes) {
	var vm = this;

	var isChange = false;
	vm.groupTypes = groupTypes;
	vm.penaltyAmounts = penaltyAmounts;
	vm.days = sessionDayTypes;
	vm.times = groupEditService.prepareTimeTypes(sessionTimeTypes);
	vm.timezoneMap = groupEditService.timeZoneMap;
	vm.frequency = sessionFrequencyTypes;
	vm.group = group;

	vm.edit = edit;

	$scope.$watch('vm.group', function(newValue, oldValue) {
		isChange = newValue !== oldValue;
	}, true);

	function edit() {
		if (!isChange) return;
		layoutLoader.on();

		groupEditService.updateGroup(vm.group, function(freshGroup) {
			layoutLoader.off();

			vm.group = freshGroup;
			isChange = false;

			notifyAndLeave({
				title: 'Update group...',
				content: 'Group updated successfully!'
			});
		});
	}
}