'use strict';

angular
	.module('app.group')
	.factory('groupMyGroupsService', groupMyGroupsService);

function groupMyGroupsService($uibModal, Group) {
	var service = {
		emailModalOpen: emailModalOpen,
		leaveGroupBox: leaveGroupBox,
		leaveGroup: leaveGroup,
		updateGroups: updateGroups
	};
	return service;

	function emailModalOpen(groupId, cb) {
		$uibModal.open({
			animation: true,
			templateUrl: 'app/shared/modal-components/shared-modal.view.html',
			controller: 'emailModalController',
			controllerAs: 'vm',
			resolve: {
				modalTitle: function() { return 'Send Email To Group'; },
				groupId: function() { return groupId; },
				receiverId: function() { return null; }
			}
		}).result.then(cb);
	}

	function leaveGroupBox(cb) {
		$.SmartMessageBox({
			title: "You are about to leave this group...",
			content: "Are you sure? (This option cannot be undone)",
			buttons: '[No][Yes]'
		}, function (buttonPressed) {
			if (buttonPressed === 'Yes') cb();
		});
	}

	function leaveGroup(groupId, customerId, cb) {
		Group.Members.unlink({id: groupId, fk: customerId}, cb);
	}

	function updateGroups(groupId, groups) {
		for (var i = groups.length - 1; i >= 0; i--) {
			if (groups[i]._id == groupId) {
				groups.splice(i, 1);
				break;
			}
		}
	}
}