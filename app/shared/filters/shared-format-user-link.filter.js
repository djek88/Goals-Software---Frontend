'use strict';

angular
	.module('app.shared')
	.filter('userLink', userLink);

function userLink() {
	return function (link) {
		return link.isPrefix('http://') || link.isPrefix('https://')
			? link : 'http://' + link;
	}
}

String.prototype.isPrefix = function (str) {
	return this.indexOf(str) == 0;
};