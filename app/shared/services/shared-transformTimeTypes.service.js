'use strict';

angular
	.module('app.shared')
	.factory('transformTimeTypes', transformTimeTypes);

function transformTimeTypes() {
	return function(timeTypes) {
		var result = [];

		for (var key in timeTypes.toJSON()) {
			result.push({
				key: key,
				value: timeTypes[key]
			});
		}

		return result;
	};
}