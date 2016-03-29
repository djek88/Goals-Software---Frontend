'use strict';

angular
	.module('app.group')
	.controller('groupGoalCreateController', groupGoalCreateController);

function groupGoalCreateController($stateParams, notifyAndLeave, layoutLoader, groupGoalCreateService, loadAppData, group) {
	var vm = this;

	vm.goal = {
		name: '',
		description: '',
		dueDate: groupGoalCreateService.getDefaultDate(group),
		_groupId: $stateParams.id
	};

	vm.create = create;

	function create() {
		layoutLoader.on();

		groupGoalCreateService.createGoal(vm.goal, function() {
			layoutLoader.off();

			notifyAndLeave({
				title: 'Creating goal...',
				content: 'Goal was create successfully!',
				leave: {to: 'app.home'}
			});
		});
	}
}