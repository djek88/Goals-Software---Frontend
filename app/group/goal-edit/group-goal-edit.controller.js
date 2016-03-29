'use strict';

angular
	.module('app.group')
	.controller('groupGoalEditController', groupGoalEditController);

function groupGoalEditController(notifyAndLeave, layoutLoader, groupGoalEditService, loadAppData, goal) {
	var vm = this;

	vm.goal = goal;

	vm.edit = edit;

	function edit() {
		layoutLoader.on();

		groupGoalEditService.editGoal(vm.goal, function() {
			layoutLoader.off();

			notifyAndLeave({
				title: 'Changing goal...',
				content: 'Goal was change successfully!',
				leave: {to: 'app.home'}
			});
		});
	}
}