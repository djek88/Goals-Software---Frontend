'use strict';

angular
	.module('app.basic')
	.filter('isLessThanMins', isLessThanMins);

function isLessThanMins() {
	return function(dateString, minLimit) {
		var difference = (new Date(dateString) - new Date()) / 1000 / 60;
		return difference < minLimit;
	}
}