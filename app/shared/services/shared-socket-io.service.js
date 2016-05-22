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
		} else {
			startSocket = io($rootScope.socketUrl + '/startSession', {path: '/sockets'});
			injectAngularApply(startSocket);

			startSocket.onSuccessAuth = function() {};
			startSocket.onFailAuth = function() {};

			startSocket.on('connect', onConnect);
			startSocket.on('authenticated', onAuthenticated);
			startSocket.on('unauthorized', onUnauthorized);
		}

		return startSocket;
	}

	function goesNsp() {
		if (goesSocket) {
			if (goesSocket.disconnected) goesSocket.connect();
		} else {
			goesSocket = io($rootScope.socketUrl + '/goesSession', {path: '/sockets'});
			injectAngularApply(goesSocket);

			goesSocket.onSuccessAuth = function() {};
			goesSocket.onFailAuth = function() {};

			goesSocket.on('connect', onConnect);
			goesSocket.on('authenticated', onAuthenticated);
			goesSocket.on('unauthorized', onUnauthorized);
		}

		return goesSocket;
	}

	function onConnect() {
		this.emit('authentication', userCredentials);
	}

	function onAuthenticated() {
		this.onSuccessAuth();
	}

	function onUnauthorized() {
		this.onFailAuth();
	}

	function injectAngularApply(socket) {
		var on = socket.on;
		var emit = socket.emit;

		socket.on = function() {
			var cb = arguments[arguments.length - 1];

			arguments[arguments.length - 1] = function() {
				var self = this;
				var args = arguments;

				$rootScope.$apply(function() {
					cb.apply(self, args);
				});
			};

			return on.apply(this, arguments);
		};

		socket.emit = function() {
			if ('function' == typeof arguments[arguments.length - 1]) {
				var cb = arguments[arguments.length - 1];

				arguments[arguments.length - 1] = function() {
					var self = this;
					var args = arguments;

					$rootScope.$apply(function() {
						cb.apply(self, args);
					});
				}
			}

			return emit.apply(this, arguments);
		};
	}
}