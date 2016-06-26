'use strict';

angular
	.module('app.group')
	.controller('groupCreateController', groupCreateController);

function groupCreateController($scope, notifyAndLeave, layoutLoader, transformTimeTypes, groupCreateService, groupTypes, penaltyAmounts, sessionFrequencyTypes, sessionDayTypes, sessionTimeTypes, countriesData) {
	var vm = this;

	vm.group = groupCreateService.prepareGroup(groupTypes, penaltyAmounts, sessionDayTypes, sessionTimeTypes, sessionFrequencyTypes);

	vm.groupTypes = groupTypes;
	vm.penaltyAmounts = penaltyAmounts;
	vm.countriesMap = groupCreateService.countriesMap(countriesData);
	vm.statesMap = groupCreateService.uploadStatesOrCitiesMap();
	vm.citiesMap = groupCreateService.uploadStatesOrCitiesMap();
	vm.days = sessionDayTypes;
	vm.times = transformTimeTypes(sessionTimeTypes);
	vm.timezoneMap = groupCreateService.timeZoneMap;
	vm.languagesMap = groupCreateService.languagesMap;
	vm.frequency = sessionFrequencyTypes;

	vm.create = create;

	$scope.$watch('vm.group.sessionConf.country', function(newValue, oldValue) {
		if (newValue === oldValue) return;

		vm.group.sessionConf.state = '';

		if (newValue) {
			layoutLoader.on();

			groupCreateService.uploadStatesOrCitiesMap(newValue, null, function(states) {
				layoutLoader.off();
				vm.statesMap = states;
			});
		} else {
			vm.statesMap = groupCreateService.uploadStatesOrCitiesMap();
		}
	});

	$scope.$watch('vm.group.sessionConf.state', function(newValue, oldValue) {
		if (newValue === oldValue) return;

		vm.group.sessionConf.city = '';

		if (newValue) {
			layoutLoader.on();

			groupCreateService.uploadStatesOrCitiesMap(
				vm.group.sessionConf.country,
				newValue,
				function(cities) {
					layoutLoader.off();
					vm.citiesMap = cities;
				});
		} else {
			vm.citiesMap = groupCreateService.uploadStatesOrCitiesMap();
		}
	});

	function create() {
		layoutLoader.on();

		groupCreateService.createGroup(vm.group, function(newGroup) {
			layoutLoader.off();

			notifyAndLeave({
				title: 'Create group...',
				message: 'Group created successfully!',
				leave: {to: 'app.group.detail', params: {id: newGroup._id}}
			});
		});
	}
}