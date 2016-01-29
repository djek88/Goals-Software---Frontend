'use strict';

angular
	.module('app.group')
	.controller('emailModalController', emailModalController);

function emailModalController($http, $uibModalInstance, Group, modalTitle, groupId, receiverId) {
	var vm = this;

	vm.message = '';
	vm.modalTitle = modalTitle;

	vm.sendEmail = sendEmail;
	vm.cancel = $uibModalInstance.dismiss;

	function sendEmail() {
		if (!vm.message) return $uibModalInstance.dismiss();

		if (receiverId) {
			// send email to member
			Group.prototype$sendEmailToMember({
					id: groupId,
					memberId: receiverId
				}, {
					message: vm.message
				},
				$uibModalInstance.close,
				$uibModalInstance.dismiss
			);
		} else {
			// send email to group
			Group.prototype$sendEmailToGroup({
					id: groupId
				}, {
					message: vm.message
				},
				$uibModalInstance.close,
				$uibModalInstance.dismiss
			);
		}
	};
}