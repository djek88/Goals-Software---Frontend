'use strict';

angular
	.module('app.session')
	.controller('sessionStartController', sessionStartController);

function sessionStartController($scope, $timeout, Customer, notifyAndLeave, sessionStartService, loadAppData, group, socket) {
	var vm = this;

	//group.NextSession.startAt = '2016-04-25T07:00:00.000Z';

	vm.isGroupOwner = Customer.getCachedCurrent()._id === group._ownerId;
	vm.isStarted = false;
	vm.sessionStartAt = group.NextSession.startAt;
	vm.members = sessionStartService.prepareMembersList(group);

	vm.timeOut = timeOut;
	vm.startSession = startSession;

	$scope.$on('$destroy', onDestroy);

	socket.emit('startSessionRoom:join', group._id, onJoin);
	socket.on('startSessionRoom:redirect', onRedirect);
	socket.on('user:joined', onUserJoin);
	socket.on('user:left', onUserLeft);

	function timeOut() {
		vm.isStarted = true;

		$timeout(function() {
			vm.isGroupOwner = true
		}, 10000);
	}

	function startSession() {
		socket.emit('startSessionRoom:startSession', group._id, function(errMsg) {
			if (errMsg) {
				notifyAndLeave({
					title: 'Session starting...',
					content: errMsg,
					isError: true}
				);
			}
		});
	}

	function onDestroy() {
		socket.removeAllListeners('user:joined');
		socket.removeAllListeners('user:left');
		socket.disconnect();
	}

	function onJoin(errMsg, onlineUserIds) {
		if (errMsg) {
			onDestroy();
			return notifyAndLeave({
				title: 'Session joining...',
				content: errMsg,
				isError: true,
				leave: {to: 'app.home'}
			});
		}

		sessionStartService.refreshOnline(vm.members, onlineUserIds);
	}

	function onRedirect(groupId) {
		notifyAndLeave({
			title: 'Session starting...',
			content: 'Waiting other user and starting session.',
			leave: {to: 'app.session.goes', params: {id: groupId}}
		});
	}

	function onUserJoin(userId) {
		sessionStartService.changeMemberOnline(vm.members, userId, true);
	}

	function onUserLeft(userId) {
		sessionStartService.changeMemberOnline(vm.members, userId, false);
	}
}