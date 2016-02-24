'use strict';

angular
	.module('app.shared')
	.controller('excuseModalController', excuseModalController);

function excuseModalController($uibModalInstance, layoutLoader, Group, modalTitle, groupId) {
	var vm = this;

	vm.message = '';
	vm.modalTitle = modalTitle;

	vm.send = send;
	vm.cancel = $uibModalInstance.dismiss;

	function send() {
		if (!vm.message) return $uibModalInstance.dismiss();

		layoutLoader.on();

		Group.prototype$provideExcuse(
			{id: groupId},
			{excuse: vm.message},
			close,
			dismiss
		);
	}

	function close() {
		layoutLoader.off();
		$uibModalInstance.close();
	}

	function dismiss() {
		layoutLoader.off();
		$uibModalInstance.dismiss();
	}
}