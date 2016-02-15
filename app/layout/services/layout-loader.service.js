'use strict';

angular
	.module('app.layout')
	.factory('layoutLoader', layoutLoader);

function layoutLoader($rootScope) {
	$rootScope.$on('$stateChangeStart', onStateChangeStart);
	$rootScope.$on('$stateChangeSuccess', onStateChangeSuccess);

	var service = {
		on: on,
		off: off
	};
	return service;

	function onStateChangeStart(event, toState, toParams, fromState, fromParams) {
		service.on();
	}

	function onStateChangeSuccess(event, toState, toParams, fromState, fromParams) {
		service.off();
	}

	function on() {
		$rootScope.showLoader = true;
	}

	function off() {
		$rootScope.showLoader = false;
	}
}