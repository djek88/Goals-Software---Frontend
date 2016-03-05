'use strict';

angular
	.module('app.session')
	.controller('sessionGoesController', sessionGoesController);

function sessionGoesController($scope, Customer, layoutLoader, notifyAndLeave, sessionGoesService, loadAppData, group, socket) {
	var vm = this;

	layoutLoader.on();

	vm.isFacilitator = false;
	vm.isPause = false;
	vm.sess = {
		state: null,
		timer: -1,
		roundDesc: null,
		focusOn: null,
		whoGiveFeedback: null,
		nextFocusOn: null,
		nextWhoGiveFeedback: null
	};

	vm.skipRound = skipRound;
	vm.pauseResume = pauseResume;

	sessionGoesService.saveMembers(group);
	$scope.$on('$destroy', socket.disconnect.bind(socket));

	socket.emit('goesSessionRoom:join', group._id, onJoin);
	socket.on('session:stateUpdate', onStateUpdate);
	socket.on('session:nextTurnInfo', onNextTurnInfo);
	socket.on('session:timerUpdate', onTimerUpdate);

	function skipRound() {
		socket.emit( 'goesSessionRoom:skipRound', group._id);
	}

	function pauseResume() {
		socket.emit('goesSessionRoom:pauseResume', group._id, function() {
			vm.isPause = !vm.isPause;
		});
	}

	function onJoin(err, facilitatorId) {
		if (err) {
			socket.disconnect();
			return notifyAndLeave({
				title: 'Joining to session...',
				content: 'Forbidden!',
				isError: true,
				leave: {to: 'app.home'}
			});
		}

		vm.isFacilitator = facilitatorId === Customer.getCachedCurrent()._id;
	}

	function onStateUpdate(err, data) {
		layoutLoader.off();
		vm.isPause = false;

		if (err || !data) {
			socket.disconnect();
			return notifyAndLeave({
				title: err ? 'During the session...' : 'Session finish...',
				content: err ? 'Something went wrong!' : 'Session finished success!',
				isError: err ? true : false,
				leave: {to: 'app.home'}
			});
		}

		vm.sess.state = data.state;
		vm.sess.roundDesc = sessionGoesService.getRoundDesc(data.state[0]);
		vm.sess.focusOn = sessionGoesService.getUserInfo(data.focusOn);
		vm.sess.whoGiveFeedback = sessionGoesService.getUserInfo(data.whoGiveFeedback);
	}

	function onNextTurnInfo(data) {
		vm.sess.nextFocusOn = sessionGoesService.getUserInfo(data.nextFocusOn);
		vm.sess.nextWhoGiveFeedback = sessionGoesService.getUserInfo(data.nextWhoGiveFeedback);
	}

	function onTimerUpdate(sec) {
		vm.sess.timer = Number(sec);
	}
}