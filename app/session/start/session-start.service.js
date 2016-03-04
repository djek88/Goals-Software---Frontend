'use strict';

angular
	.module('app.session')
	.factory('sessionStartService', sessionStartService);

function sessionStartService() {
	var service = {
		prepareMembersList: prepareMembersList,
		refreshOnline: refreshOnline,
		changeMemberOnline: changeMemberOnline
	};
	return service;

	function prepareMembersList(group) {
		var members = group.Members.concat(group.Owner);
		var excuses = group.NextSession.excuses;
		var result = {};

		members.forEach(function(member) {
			var id = member._id;
			var isValidExcuse = excuses[id] && excuses[id].valid;

			result[id] = {
				fullName: member.firstName + ' ' + member.lastName,
				online: isValidExcuse ? 0 : -1
			};
		});

		return result;
	}

	function refreshOnline(members, onlineUserIds) {
		onlineUserIds.forEach(function(id) {
			members[id].online = 1;
		})
	}

	function changeMemberOnline(members, userId, online) {
		members[userId].online = online ? 1 : -1;
	}
}