'use strict';

angular
	.module('app.group')
	.controller('groupSearchController', groupSearchController);

function groupSearchController(groupSearchService, customer, groupTypes, penaltyAmounts) {
	var vm = this;

	vm.groupTypes = groupSearchService.prepareGroupTypes(groupTypes);
	vm.penaltyAmounts = penaltyAmounts;
	vm.criteria = {
		type: '0',
		penalty: penaltyAmounts[4]
	};
	vm.groups = [];

	vm.searchGroups = searchGroups;

	function searchGroups() {
		groupSearchService.findGroupsByCriteria(vm.criteria, function(groups) {
			vm.groups = groupSearchService.preparedGroups(groups);
		});
	}
}