'use strict';

angular
	.module('app.group')
	.controller('groupCreateController', groupCreateController);

function groupCreateController($state, groupCreateService, groupTypes, penaltyAmounts, sessionFrequencyTypes, sessionDayTypes, sessionTimeTypes) {
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
		groupCreateService.createGroup(vm.group, function(newGroup) {
			$state.go('app.group.detail', {id: newGroup._id});

			$.smallBox({
				title: 'Create group...',
				content: 'Group created successfully!',
				color: '#296191',
				timeout: 3000,
				icon: 'fa fa-bell swing animated'
			});
		});
	}
}