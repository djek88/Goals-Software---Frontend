'use strict';

angular
	.module('app.group')
	.factory('groupUploadGoalEvidenceService', groupUploadGoalEvidenceService);

function groupUploadGoalEvidenceService($http, $stateParams, Goal, APP_CONFIG) {
	var service = {
		prepareGoal: prepareGoal,
		leaveFeedback: leaveFeedback,
		uploadEvidence: uploadEvidence,
		deleteEvidence: deleteEvidence,
		supportEvidenceTypes: supportEvidenceTypes,
		supportEvidenceExtens: supportEvidenceExtens,
		saveEvidenceBox: saveEvidenceBox,
		updateCommentsAndNotifyMembers: updateCommentsAndNotifyMembers
	};
	return service;

	function prepareGoal(goal, group) {
		var members = group.Members ? group.Members.concat(group.Owner) : [group.Owner];
		var result = angular.copy(goal);

		result.feedbacks.forEach(function(feedback) {
			members.forEach(function(member) {
				if (member._id === feedback._id) {
					feedback.fullName = member.firstName + ' ' + member.lastName;
				}
			});

			feedback.fullName = feedback.fullName || 'Unknown member';
		});

		return result;
	}

	function leaveFeedback(feedback, cb) {
		Goal.prototype$leaveFeedback({
			id: $stateParams.goalId
		}, {
			feedback: feedback
		}, cb);
	}

	function uploadEvidence(evidenceFile, cb) {
		var url = APP_CONFIG.apiRootUrl + '/Goals/' + $stateParams.goalId + '/upload-evidence';

		var fd = new FormData();
		fd.append('file', evidenceFile);

		$http.post(url, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}).success(cb);
	}

	function deleteEvidence(file, cb) {
		Goal.prototype$removeEvidence({
			id: $stateParams.goalId
		}, {
			fileName: file.name
		}, cb);
	}

	function supportEvidenceTypes(objTypes) {
		objTypes = JSON.parse(JSON.stringify(objTypes));
		var result = [];

		for(var key in objTypes) {
			result.push(objTypes[key]);
		}

		return result;
	}

	function supportEvidenceExtens(objTypes) {
		return Object.keys(JSON.parse(JSON.stringify(objTypes)));
	}

	function saveEvidenceBox(cb) {
		$.SmartMessageBox({
			title: "Save evidence...",
			content: "Do wish to notify the other users that your goal is complete and the evidence is ready for inspection?",
			buttons: '[No][Yes]'
		}, function (buttonPressed) {
			cb(buttonPressed === 'Yes');
		});
	}

	function updateCommentsAndNotifyMembers(comments, isNeedNotify, cb) {
		Goal.prototype$updateAttributes({
			id: $stateParams.goalId
		}, {
			comments: comments
		}, function(goal) {
			if (!isNeedNotify) return cb();

			Goal.prototype$notifyGroupMembers({id: $stateParams.goalId}, cb);
		});
	}
}