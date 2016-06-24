'use strict';

angular
	.module('app.group')
	.controller('groupSearchController', groupSearchController);

function groupSearchController(notifyAndLeave, layoutLoader, groupSearchService, groupTypes, penaltyAmounts) {
	var vm = this;

	vm.groupTypes = groupTypes;
	vm.penaltyAmounts = penaltyAmounts;
	vm.criteria = {
		type: '-1',
		penalty: '-1'
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

			if (!groups.length) {
				notifyAndLeave({
					title: 'Search Groups...',
					message: 'Currently No Results Found That Match Your Request.'
				});
			}

			vm.groups = groupSearchService.preparedGroups(groups);
			vm.totalGroupsCount = vm.groups.length;
		});
	}
}