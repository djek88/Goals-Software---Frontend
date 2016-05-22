'use strict';

angular
	.module('app.group')
	.controller('reviewGroupController', reviewGroupController);

function reviewGroupController(reviewGroupService, group, sessionsPassed, frequencyTypes, sessionDayTypes, sessionTimeTypes) {
	var vm = this;

	vm.group = reviewGroupService.prepareGroup(
		group,
		sessionsPassed,
		frequencyTypes,
		sessionDayTypes,
		sessionTimeTypes
	);
}