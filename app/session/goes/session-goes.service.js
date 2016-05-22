'use strict';

angular
	.module('app.session')
	.factory('sessionGoesService', sessionGoesService);

function sessionGoesService($rootScope, Goal) {
	var ROUNDS_DESCRIPTION = [
		'Round 1: Review last goal',
		'Round 2: In the spotlight',
		'Round 3: Specify exact measurable goals'
	];
	var members = {};
	var activeGoals = {};

	var service = {
		saveMembers: saveMembers,
		saveGoals: saveGoals,
		getRoundDesc: getRoundDesc,
		getMemberInfo: getMemberInfo,
		getMemberActiveGoals: getMemberActiveGoals,
		getGoalsInWhichMemberNotVoted: getGoalsInWhichMemberNotVoted,
		sendVote: sendVote,
		selectGoalBox: selectGoalBox
	};
	return service;

	function saveMembers(group) {
		members = {};

		group.Members.concat(group.Owner).forEach(function(member) {
			members[member._id] = member;
		});
	}

	function saveGoals(membersGoals) {
		activeGoals = {};

		membersGoals.forEach(function(goal) {
			if (!activeGoals[goal._ownerId]) {
				activeGoals[goal._ownerId] = [];
			}

			activeGoals[goal._ownerId].push(goal);
		});
	}

	function getRoundDesc(roundNumber) {
		return ROUNDS_DESCRIPTION[roundNumber - 1];
	}

	function getMemberInfo(memberId) {
		var member = members[memberId];

		if (!member) return {
			fullName: null,
			avatar: null
		};

		return {
			fullName: member.firstName + ' ' + member.lastName,
			avatar: $rootScope.urlBase + member.avatar
		};
	}

	function getMemberActiveGoals(memberId) {
		return activeGoals[memberId] ? activeGoals[memberId] : [];
	}

	function getGoalsInWhichMemberNotVoted(goals, memberId) {
		return goals.filter(function(g) {
			return !g.votes.some(function(v) {return v._approverId === memberId});
		});
	}

	function sendVote(goalId, approve, cb) {
		Goal.prototype$leaveVote({
			id: goalId
		}, {
			achieve: approve,
			comment: ''
		}, cb);
	}

	function selectGoalBox(goals, cb) {
		var goalList = prepareOptions(goals);

		var options = {
			title: 'Select goal to which you want vote...',
			buttons: '[Cancel][Select]',
			input: 'select',
			options: goalList
		};

		$.SmartMessageBox(options, function(buttonPressed, selectVal) {
			if (buttonPressed === 'Select') {
				var goalId = getIdFromOption(goals, selectVal);
				cb(goalId);
			}
		});
	}

	function prepareOptions(goals) {
		var result = [];

		goals.forEach(function(goal) {
			result.push('[' + goal.name + ']');
		});

		return result.join('');
	}

	function getIdFromOption(goals, selectedValue) {
		for (var i = goals.length - 1; i >= 0; i--) {
			if (selectedValue === goals[i].name) return goals[i]._id;
		}
	}
}