'use strict';

angular
	.module('app.basic')
	.factory('basicHomeService', basicHomeService);

function basicHomeService($uibModal) {
	var service = {
		excuseModalOpen: excuseModalOpen
	};
	return service;

	function excuseModalOpen(groupId, cb) {
		$uibModal.open({
			animation: true,
			templateUrl: 'app/shared/modal-components/modal.view.html',
			controller: 'excuseModalController',
			controllerAs: 'vm',
			resolve: {
				modalTitle: function() { return 'Send Your Excuse'; },
				groupId: function() { return groupId; }
			}
		}).result.then(cb);
	}
}