'use strict';

angular
	.module('app.group')
	.controller('emailModalController', emailModalController);

function emailModalController($http, $uibModalInstance, layoutLoader, Group, modalTitle, groupId, receiverId) {
	var vm = this;

	vm.message = '';
	vm.modalTitle = modalTitle;

	vm.sendEmail = sendEmail;
	vm.cancel = $uibModalInstance.dismiss;

	function sendEmail() {
		if (!vm.message) return $uibModalInstance.dismiss();

		layoutLoader.on();

		if (receiverId) {
			// send email to member
			Group.prototype$sendEmailToMember(
				{id: groupId, memberId: receiverId},
				{message: vm.message},
				close,
				dismiss
			);
		} else {
			// send email to group
			Group.prototype$sendEmailToGroup(
				{id: groupId},
				{message: vm.message},
				close,
				dismiss
			);
		}
	}

	function close() {
		layoutLoader.off();
		$uibModalInstance.close();
	}

	function dismiss() {
		layoutLoader.off();
		$uibModalInstance.close();
	}
}