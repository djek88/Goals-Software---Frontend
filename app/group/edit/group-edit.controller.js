'use strict';

angular
	.module('app.group')
	.controller('groupEditController', groupEditController);

function groupEditController($scope, $state, groupEditService, group, groupTypes, penaltyAmounts, sessionFrequencyTypes, sessionDayTypes, sessionTimeTypes) {
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

		groupEditService.updateGroup(vm.group, function(freshGroup) {
			vm.group = freshGroup;
			isChange = false;

			$.smallBox({
				title: 'Update group...',
				content: 'Group updated successfully!',
				color: '#296191',
				timeout: 3000,
				icon: 'fa fa-bell swing animated'
			});
		});
	}
}