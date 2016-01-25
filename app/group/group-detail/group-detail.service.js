'use strict';

angular
	.module('app.group')
	.factory('groupDetailService', groupDetailService);

function groupDetailService($http, $state, APP_CONFIG, Group) {
	var service = {
		//customerIsMember: customerIsMember,
		getMembersWithOwner: getMembersWithOwner,
		changeOwner: changeOwner,
		deleteGroup: deleteGroup,
		removeMemberFromGroup: removeMemberFromGroup,
		deleteOwnerBox: deleteOwnerBox,
		deleteMemberBox: deleteMemberBox,
		notifyAndLeavePage: notifyAndLeavePage
	};
	return service;

	/*function customerIsMember(customerId, group) {
		return group._memberIds.some(function(mId) {
			return mId.toString() == customerId;
		});
	}*/

	function getMembersWithOwner(group) {
		return [group.Owner].concat(group.Members);
	}

	function changeOwner(group, newOwnerId, cb) {
		var url = APP_CONFIG.apiRootUrl + '/Groups/' + group._id + '/change-owner/' + newOwnerId;

		$http.put(url, {transformRequest: angular.identity}).success(cb);
	}

	function deleteGroup(groupId, cb) {
		var url = APP_CONFIG.apiRootUrl + '/Groups/' + groupId;

		$http.delete(url, {transformRequest: angular.identity}).success(cb);
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
				arguments[1] = getIdFromOption(selectVal);
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
			var str = '[' + member.firstName + ' ' + member.lastName + ' (' + member._id + ')]';
			result.push(str);
		});

		return result.join('');
	}

	function getIdFromOption(str) {
		return str.split('(').pop().slice(0, -1);
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
}