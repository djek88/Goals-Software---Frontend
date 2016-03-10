'use strict';

angular
	.module('app.group')
	.factory('groupSessionExcusesService', groupSessionExcusesService);

function groupSessionExcusesService($stateParams, Group) {
	var service = {
		prepareExcuses: prepareExcuses,
		rejectExcuse: rejectExcuse,
		removeExcuse: removeExcuse
	};
	return service;

	function prepareExcuses(group) {
		var excuses = group.NextSession.excuses;
		var members = group.Members.concat(group.Owner);
		var result = [];

		for(var key in excuses) {
			if (!excuses[key].valid) continue;

			var excuse = {
				_id: key,
				excuseMessage: excuses[key].excuse
			};

			members.forEach(function(member) {
				if (member._id === key) {
					excuse.memberName = member.firstName + ' ' + member.lastName;
				}
			});

			result.push(excuse);
		}

		return result;
	}

	function rejectExcuse(excuseId, cb) {
		var groupId = $stateParams.id;

		Group.prototype$rejectExcuse({id: groupId, excuseId: excuseId}, null, cb);
	}

	function removeExcuse(excuseId, excuses) {
		for (var i = excuses.length - 1; i >= 0; i--) {
			if (excuses[i]._id === excuseId) {
				excuses.splice(i, 1);
				break;
			}
		}
	}
}