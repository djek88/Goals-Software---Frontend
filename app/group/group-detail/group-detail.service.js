'use strict';

angular
	.module('app.group')
	.factory('groupDetailService', groupDetailService);

function groupDetailService($state, $uibModal, APP_CONFIG, Group) {
	var service = {
		prepareGroup: prepareGroup,
		customerIsMember: customerIsMember,
		getMembersWithOwner: getMembersWithOwner,
		emailModalOpen: emailModalOpen,
		changeOwner: changeOwner,
		deleteGroup: deleteGroup,
		removeMemberFromGroup: removeMemberFromGroup,
		deleteOwnerBox: deleteOwnerBox,
		deleteMemberBox: deleteMemberBox,
		notifyAndLeavePage: notifyAndLeavePage
	};
	return service;

	function prepareGroup(group, freqTypes, dayTypes, timeTypes) {
		var created = new Date(group.createdAt).toLocaleString("en-US", {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
		var mastermindSessions = formatMastermindSession(group.sessionConf, freqTypes, dayTypes, timeTypes);

		return {
			_id: group._id,
			_ownerId: group._ownerId,
			name: group.name,
			created: created,
			penalty: group.penalty,
			description: group.description,
			mastermindSessions: mastermindSessions,
			isHasFreePlace: group._memberIds.length < group.maxMembers,
			memberCanInvite: group.memberCanInvite
		};
	}

	function customerIsMember(customerId, group) {
		var isOwner = group._ownerId === customerId;
		var isMember = group._memberIds.some(function(mId) {
			return mId === customerId;
		});

		return isOwner || isMember;
	}

	function getMembersWithOwner(group) {
		return [group.Owner].concat(group.Members);
	}

	function emailModalOpen(groupId, receiverId, cb) {
		$uibModal.open({
			animation: true,
			templateUrl: 'app/group/email-modal/email-modal.html',
			controller: 'emailModalController',
			controllerAs: 'vm',
			resolve: {
				modalTitle: function() {
					return receiverId ? 'Send Email To Member' : 'Send Email To Group';
				},
				groupId: function() { return groupId; },
				receiverId: function() { return receiverId; }
			}
		}).result.then(cb);
	}

	function changeOwner(groupId, newOwnerId, cb) {
		Group.prototype$changeGroupOwner({id: groupId, ownerId: newOwnerId}, null, cb);
	}

	function deleteGroup(groupId, cb) {
		Group.deleteById({id: groupId}, cb);
	}

	function removeMemberFromGroup(group, memberId, cb) {
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

	function deleteOwnerBox(group, cb) {
		var membList = prepareOptions(group);

		var options = {
			title: 'Alive the group!',
			content: 'You can delete group',
			buttons: '[Cancel][Delete group]'
		};

		if (membList) {
			options.content += ' or select new owner'
			options.buttons += '[Select new owner]';
			options.input = 'select';
			options.options = membList;
		}

		$.SmartMessageBox(options, function(buttonPressed, selectVal) {
			if (selectVal) {
				arguments[1] = getIdFromOption(group.Members, selectVal);
			}

			cb.apply(null, arguments);
		});
	}

	function deleteMemberBox(cb) {
		$.SmartMessageBox({
			title: "Remove member from group!",
			content: "Are you sure, you want to remove member from a group?",
			buttons: '[No][Yes]'
		}, function (buttonPressed) {
			if (buttonPressed === 'Yes') cb();
		});
	}

	function prepareOptions(group) {
		var result = [];

		group.Members.forEach(function(member) {
			var str = '[' + member.firstName + ' ' + member.lastName + ']';
			result.push(str);
		});

		return result.join('');
	}

	function getIdFromOption(members, initialsSelectedMember) {
		for (var i = members.length - 1; i >= 0; i--) {
			var initials = members[i].firstName + ' ' + members[i].lastName;

			if (initialsSelectedMember === initials) return members[i]._id;
		}
	}

	function notifyAndLeavePage(options) {
		$.smallBox({
			title: options.title || '',
			content: options.message || '',
			color: '#296191',
			timeout: 3000,
			icon: 'fa fa-bell swing animated'
		});

		if (options.toState) $state.go(options.toState);
	}

	function formatMastermindSession(sessionConf, freqTypes, dayTypes, timeTypes) {
		if (!sessionConf.sheduled) return 'Manually Scheduled';

		var freqType = freqTypes[sessionConf.frequencyType];
		var weekday = dayTypes[sessionConf.day];
		var timeZone = sessionConf.timeZone;
		var offset = '(UTC' + moment.tz(sessionConf.timeZone).format('Z') + ')';
		var time = timeTypes[sessionConf.time].split(' ');
		time = time[0] + time[1].toLowerCase();

		return (freqType + ' on ' + weekday + ' of the month at ' + time + ' ' + timeZone + offset);
	}
}