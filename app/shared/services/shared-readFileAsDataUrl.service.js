'use strict';

angular
	.module('app.shared')
	.factory('readFileAsDataUrl', readFileAsDataUrl);

function readFileAsDataUrl($rootScope) {
	return function(file, cb) {
		var fileReader = new FileReader();

		fileReader.onload = function() {
			$rootScope.$apply(function() {
				cb(fileReader.result);
			});
		};

		fileReader.readAsDataURL(file);
	};
}