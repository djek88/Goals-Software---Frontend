'use strict';

angular
	.module('app.group')
	.controller('groupSearchController', groupSearchController);

function groupSearchController(layoutLoader, groupSearchService, groupTypes, penaltyAmounts) {
	var vm = this;

	vm.groupTypes = groupTypes;
	vm.penaltyAmounts = penaltyAmounts;
	vm.criteria = {
		type: '0',
		penalty: '0'
	};
	vm.groups = [];
	vm.totalGroupsCount = 0;
	vm.groupsPerPage = 10;
	vm.curPageNumber = 1;

	vm.searchGroups = searchGroups;

	function searchGroups() {
		layoutLoader.on();

		groupSearchService.findGroupsByCriteria(vm.criteria, function(groups) {
			layoutLoader.off();

			vm.groups = groupSearchService.preparedGroups(groups);
			vm.totalGroupsCount = vm.groups.length;
		});
	}
}