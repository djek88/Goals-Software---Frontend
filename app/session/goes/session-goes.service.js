'use strict';

angular
	.module('app.session')
	.factory('sessionGoesService', sessionGoesService);

function sessionGoesService($rootScope) {
	var ROUNDS_DESCRIPTION = [
		'Round 1: Review last goal',
		'Round 2: Focus on objective and challenges',
		'Round 3: Specify exact measurable goals'
	];
	var members = {};

	var service = {
		saveMembers: saveMembers,
		getRoundDesc: getRoundDesc,
		getUserInfo: getUserInfo
	};
	return service;

	function saveMembers(group) {
		group.Members.concat(group.Owner).forEach(function(member) {
			members[member._id] = member;
		});
	}

	function getRoundDesc(roundNumber) {
		return ROUNDS_DESCRIPTION[roundNumber - 1];
	}

	function getUserInfo(userId) {
		var member = members[userId];

		if (!member) return {
			fullName: null,
			avatar: null
		};

		return {
			fullName: member.firstName + ' ' + member.lastName,
			avatar: $rootScope.urlBase + member.avatar
		};
	}
}