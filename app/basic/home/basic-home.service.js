'use strict';

angular
	.module('app.basic')
	.factory('basicHomeService', basicHomeService);

function basicHomeService($uibModal, Group) {
	var service = {
		excuseModalOpen: excuseModalOpen,
		sortedGoals: sortedGoals,
		scheduleNextSession: scheduleNextSession
	};
	return service;

	function excuseModalOpen(groupId, cb) {
		$uibModal.open({
			animation: true,
			templateUrl: 'app/shared/modal-components/shared-modal.view.html',
			controller: 'excuseModalController',
			controllerAs: 'vm',
			resolve: {
				modalTitle: function() { return 'Send Your Excuse'; },
				groupId: function() { return groupId; }
			}
		}).result.then(cb);
	}

	function sortedGoals(groups, goals) {
		var results = angular.copy(groups);

		results.forEach(function(group) {
			group.goals = [];

			goals.forEach(function(goal) {
				var curGoal = angular.copy(goal);
				curGoal.dueDate = moment(curGoal.dueDate).format('YY/MM/DD [at] ha');

				var start = moment(goal.createdAt);
				var end = moment(goal.dueDate);
				var cur = moment();
				curGoal.percentDate = (((end - cur) / (end - start)) * 100).toFixed();

				if (group._id === curGoal._groupId) group.goals.push(curGoal);
			});
		});

		return results;
	}

	function scheduleNextSession(groupId, startAt, cb) {
		Group.prototype$manuallyScheduleSession({
			id: groupId
		}, {
			startAt: startAt
		}, cb);
	}
}