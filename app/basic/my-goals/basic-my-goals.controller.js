'use strict';

angular
	.module('app.basic')
	.controller('basicMyGoalsController', basicMyGoalsController);

function basicMyGoalsController(notifyAndLeave, layoutLoader, basicMyGoalsService, loadAppData, groups, goals) {
	var vm = this;

	vm.groups = basicMyGoalsService.prepareGroupsWithGoals(groups, goals);
}