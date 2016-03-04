'use strict';

angular
	.module('app.session')
	.controller('sessionStartController', sessionStartController);

function sessionStartController($scope, $timeout, Customer, notifyAndLeave, sessionStartService, loadAppData, group, socket) {
	var vm = this;

	group.NextSession.startAt = '2016-02-27T13:24:20.000Z';
	vm.isGroupOwner = Customer.getCachedCurrent()._id === group._ownerId;
	vm.isStarted = false;
	vm.sessionStartAt = group.NextSession.startAt;
	vm.members = sessionStartService.prepareMembersList(group);

	vm.timeOut = timeOut;
	vm.startSession = startSession;

	$scope.$on('$destroy', socket.disconnect.bind(socket));

	socket.emit('startSessionRoom:join', group._id, onJoin);
	socket.on('startSessionRoom:redirect', onRedirect);
	socket.on('user:joined', onUserJoined);
	socket.on('user:left', onUserLeft);

	function timeOut() {
		vm.isStarted = true;

		$timeout(function() {
			vm.isGroupOwner = true
		}, 10000);
	}

	function startSession() {
		socket.emit('startSessionRoom:startSession', group._id);
	}

	function onJoin(err, onlineUserIds) {
		if (err) {
			socket.disconnect();
			return notifyAndLeave({
				title: 'Session joining...',
				content: 'Something went wrong!',
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

	function onUserJoined(userId) {
		sessionStartService.changeMemberOnline(vm.members, userId, true);
	}

	function onUserLeft(userId) {
		sessionStartService.changeMemberOnline(vm.members, userId, false);
	}
}