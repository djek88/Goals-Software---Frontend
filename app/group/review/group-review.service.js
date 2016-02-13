'use strict';

angular
	.module('app.group')
	.factory('reviewGroupService', reviewGroupService);

function reviewGroupService() {
	var service = {
		prepareGroup: prepareGroup
	};
	return service;

	function prepareGroup(group, sessPassed, freqTypes, dayTypes, timeTypes) {
		var created = new Date(group.createdAt).toLocaleString("en-US", {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
		var mastermindSessions = formatMastermindSession(group.sessionConf, freqTypes, dayTypes, timeTypes);

		return {
			_id: group._id,
			name: group.name,
			created: created,
			sessionsPassed: sessPassed,
			penalty: group.penalty,
			description: group.description,
			mastermindSessions: mastermindSessions
		};
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