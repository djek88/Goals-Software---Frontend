'use strict';

angular
	.module('app.group')
	.factory('groupCreateService', groupCreateService);

function groupCreateService(Group) {
	var service = {
		prepareGroup: prepareGroup,
		prepareTimeTypes: prepareTimeTypes,
		timeZoneMap: buidTimeZoneMap(),
		createGroup: createGroup
	};
	return service;

	function prepareGroup(groupTypes, penaltyAmounts, sessionDayTypes, sessionTimeTypes, sessionFrequencyTypes) {
		return {
			name: '',
			type: +Object.keys(groupTypes)[0],
			penalty: penaltyAmounts[0],
			maxMembers: 5,
			private: false,
			memberCanInvite: false,
			description: '',
			sessionConf: {
				sheduled: true,
				day: +Object.keys(sessionDayTypes)[0],
				time: Object.keys(sessionTimeTypes)[0],
				timeZone: jstz.determine().name(),
				frequencyType: +Object.keys(sessionFrequencyTypes)[0],
				roundLength: [120, 180, 90, 120]
			}
		};
	}

	function prepareTimeTypes(timeTypes) {
		var result = [];

		for (var key in timeTypes) {
			if (isFinite(key)) {
				result.push({
					key: key,
					value: timeTypes[key]
				});
			}
		}

		return result;
	}

	function buidTimeZoneMap() {
		var results = [];

		moment.tz.names().forEach(function(zoneName) {
			var tz = moment.tz(zoneName);

			results.push({
				id: zoneName,
				name: zoneName.replace(/_/g, ' '),
				offset: 'UTC' + tz.format('Z'),
				nOffset: tz.utcOffset()
			});
		});

		return results;
	}

	function createGroup(group, cb) {
		Group.create(group, cb);
	}
}