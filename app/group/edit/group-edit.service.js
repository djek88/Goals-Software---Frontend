'use strict';

angular
	.module('app.group')
	.factory('groupEditService', groupEditService);

function groupEditService(Group) {
	var service = {
		prepareTimeTypes: prepareTimeTypes,
		timeZoneMap: buidTimeZoneMap(),
		updateGroup: updateGroup
	};
	return service;

	function prepareTimeTypes(timeTypes) {
		var result = [];

		for (var key in timeTypes) {
			result.push({
				key: key,
				value: timeTypes[key]
			});
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

	function updateGroup(group, cb) {
		Group.prototype$updateAttributes({id: group._id}, group, cb);
	}
}