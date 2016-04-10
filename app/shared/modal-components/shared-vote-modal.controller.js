'use strict';

angular
	.module('app.shared')
	.controller('voteModalController', voteModalController);

function voteModalController($uibModalInstance, modalTitle) {
	var vm = this;

	vm.message = '';
	vm.modalTitle = modalTitle;

	vm.send = send;
	vm.cancel = $uibModalInstance.dismiss;

	function send() {
		$uibModalInstance.close(vm.message);
	}
}