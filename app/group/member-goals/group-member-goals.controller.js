'use strict';

angular
	.module('app.group')
	.controller('groupMemberGoalsController', groupMemberGoalsController);

function groupMemberGoalsController($state, $stateParams, Customer, notifyAndLeave, layoutLoader, groupMemberGoalsService, loadAppData, goals, member) {
	var vm = this;

	vm.memberName = member.firstName + ' ' + member.lastName;
	vm.goals = goals;
	vm.isOwner = Customer.getCachedCurrent()._id === $stateParams.memberId;
}