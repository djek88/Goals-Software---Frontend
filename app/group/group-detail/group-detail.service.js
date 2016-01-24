'use strict';

angular
	.module('app.group')
	.factory('groupDetailService', groupDetailService);

function groupDetailService(Group) {
	var service = {
		getMembers: getMembers,
		removeMember: removeMember,
		changeOwner: changeOwner
	};
	return service;

	function getMembers(group) {
		return [group.Owner].concat(group.Members);
	}

	function removeMember(group, memberId, cb) {
		Group.Members.unlink({id: group._id, fk: memberId}, function() {
			// Delete member form group model
			for (var i = group._memberIds.length - 1; i >= 0; i--) {
				if (group._memberIds[i] == memberId) {
					group._memberIds.splice(i, 1);
					group.Members.splice(i, 1);
					break;
				}
			}

			cb(group);
		});
	}

	function changeOwner(group, newOwnerId, cb) {
		/*Group.prototype$changeGroupOwner({
			id: group._id, ownerId: newOwnerId
		}, function() {
			console.log(arguments);
			cb();
		});*/
	}
}