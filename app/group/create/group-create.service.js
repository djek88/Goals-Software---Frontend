'use strict';

angular
	.module('app.group')
	.factory('groupCreateService', groupCreateService);

function groupCreateService(Group) {
	var service = {
		prepareGroup: prepareGroup,
		timeZoneMap: buidTimeZoneMap(),
		languagesMap: buidLanguagesMap(),
		createGroup: createGroup
	};
	return service;

	function prepareGroup(groupTypes, penaltyAmounts, sessionDayTypes, sessionTimeTypes, sessionFrequencyTypes) {
		return {
			name: '',
			type: +Object.keys(groupTypes)[0],
			penalty: penaltyAmounts[0],
			maxMembers: 5,
			private: true,
			memberCanInvite: false,
			description: '',
			joiningFee: 0,
			quarterlyFee: 0,
			monthlyFee: 0,
			yearlyFee: 0,
			hideMembers: false,
			sessionConf: {
				sheduled: true,
				language:  "en",
				offline: false,
				withoutFacilitator: false,
				day: +Object.keys(sessionDayTypes)[0],
				time: Object.keys(sessionTimeTypes)[0],
				timeZone: jstz.determine().name(),
				frequencyType: +Object.keys(sessionFrequencyTypes)[0],
				roundLength: [120, 180, 90, 120]
			}
		};
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

	function buidLanguagesMap() {
		return languages.getAllLanguageCode().map(function(langCode) {
			return {
				code: langCode,
				name: languages.getLanguageInfo(langCode).name
			};
		});
	}

	function createGroup(group, cb) {
		Group.create(group, cb);
	}
}