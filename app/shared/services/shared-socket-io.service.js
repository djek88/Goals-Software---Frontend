'use strict';

angular
	.module('app.shared')
	.factory('socketIO', socketIO);

function socketIO($rootScope, $stateParams, LoopBackAuth) {
	var startSocket = null;
	var goesSocket = null;
	var userCredentials = {
		id: LoopBackAuth.accessTokenId,
		userId: LoopBackAuth.currentUserId
	};

	return {
		toStart: startNsp,
		toGoes: goesNsp
	}

	function startNsp() {
		if (startSocket) {
			if (startSocket.disconnected) startSocket.connect();
			return startSocket;
		}

		startSocket = io($rootScope.socketUrl + '/startSession');
		startSocket.on('connect', onConnect);

		return startSocket;
	}

	function goesNsp() {
		if (goesSocket) {
			if (goesSocket.disconnected) goesSocket.connect();
			return goesSocket;
		}

		goesSocket = io($rootScope.socketUrl + '/goesSession');
		goesSocket.on('connect', onConnect);

		return goesSocket;
	}

	function onConnect() {
		this.emit('authentication', userCredentials);
	}
}