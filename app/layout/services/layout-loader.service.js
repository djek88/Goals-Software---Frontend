'use strict';

angular
	.module('app.layout')
	.factory('layoutLoader', layoutLoader);

function layoutLoader($rootScope) {
	var service = {
		on: on,
		off: off
	};

	$rootScope.$on('$stateChangeStart', service.on);
	$rootScope.$on('$stateChangeSuccess', service.off);
	$rootScope.$on('$stateChangeError', service.off);

	return service;

	function on() {
		$rootScope.showLoader = true;
	}

	function off() {
		$rootScope.showLoader = false;
	}
}