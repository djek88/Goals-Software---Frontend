'use strict';

angular
	.module('app.group')
	.factory('myGroupsService', myGroupsService);

function myGroupsService($uibModal) {
	var service = {
		emailModalOpen: emailModalOpen
	};
	return service;

	function emailModalOpen(groupId, cb) {
		$uibModal.open({
			animation: true,
			templateUrl: 'app/group/email-modal/email-modal.html',
			controller: 'emailModalController',
			controllerAs: 'vm',
			resolve: {
				modalTitle: function() { return 'Send Email To Group'; },
				groupId: function() { return groupId; },
				receiverId: function() { return null; }
			}
		}).result.then(cb);
	}
}