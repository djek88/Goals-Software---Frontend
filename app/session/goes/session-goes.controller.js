'use strict';

angular
	.module('app.session')
	.controller('sessionGoesController', sessionGoesController);

function sessionGoesController($scope, Customer, layoutLoader, notifyAndLeave, sessionGoesService, loadAppData, group, goals, socket) {
	var vm = this;
	var curCustomer = Customer.getCachedCurrent();

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
	vm.stillNotVotedGoals = [];

	vm.skipRound = skipRound;
	vm.pauseResume = pauseResume;
	vm.leaveVote = leaveVote;

	sessionGoesService.saveMembers(group);
	sessionGoesService.saveGoals(goals);
	$scope.$on('$destroy', onDestroy);

	socket.emit('goesSessionRoom:join', group._id, onJoin);
	socket.on('session:stateUpdate', onStateUpdate);
	socket.on('session:nextTurnInfo', onNextTurnInfo);
	socket.on('session:timerUpdate', onTimerUpdate);

	function skipRound() {
		socket.emit('goesSessionRoom:skipRound', group._id);
	}

	function pauseResume() {
		socket.emit('goesSessionRoom:pauseResume', group._id, function() {
			vm.isPause = !vm.isPause;
		});
	}

	function leaveVote(isApprove) {
		if (!vm.stillNotVotedGoals.length) return;

		if (vm.stillNotVotedGoals.length === 1) {
			sendVote(vm.stillNotVotedGoals[0]._id);
		} else {
			sessionGoesService.selectGoalBox(vm.stillNotVotedGoals, sendVote);
		}

		function sendVote(goalId) {
			layoutLoader.on();

			sessionGoesService.sendVote(
				goalId,
				isApprove,
				function() {
					layoutLoader.off();

					vm.stillNotVotedGoals = vm.stillNotVotedGoals.filter(function(goal) {
						return goal._id !== goalId;
					});

					notifyAndLeave({
						title: 'Leave vote...',
						content: 'Thanks for your vote.'
					});
				}
			);
		}
	}

	function onDestroy() {
		socket.removeAllListeners('session:stateUpdate');
		socket.removeAllListeners('session:nextTurnInfo');
		socket.removeAllListeners('session:timerUpdate');
		socket.disconnect();
	}

	function onJoin(err, facilitatorId) {
		if (err) {
			onDestroy();
			return notifyAndLeave({
				title: 'Joining to session...',
				content: 'Forbidden!',
				isError: true,
				leave: {to: 'app.home'}
			});
		}

		vm.isFacilitator = facilitatorId === curCustomer._id;
	}

	function onStateUpdate(err, data) {
		layoutLoader.off();
		vm.isPause = false;

		// err or session finish
		if (err || !data) {
			onDestroy();
			return notifyAndLeave({
				title: err ? 'During the session...' : 'Session finish...',
				content: err ? 'Something went wrong!' : 'Session finished success!',
				isError: err ? true : false,
				leave: {to: 'app.home'}
			});
		}

		// for 1 round
		if (data.state[0] === 1) {
			if (data.focusOn === curCustomer._id) {
				vm.stillNotVotedGoals = [];
			} else {
				var activeGoals = sessionGoesService.getMemberActiveGoals(data.focusOn);
				vm.stillNotVotedGoals = sessionGoesService.getGoalsInWhichMemberNotVoted(activeGoals, curCustomer._id);
			}
		}

		vm.sess.state = data.state;
		vm.sess.roundDesc = sessionGoesService.getRoundDesc(data.state[0]);
		vm.sess.focusOn = sessionGoesService.getMemberInfo(data.focusOn);
		vm.sess.whoGiveFeedback = sessionGoesService.getMemberInfo(data.whoGiveFeedback);
	}

	function onNextTurnInfo(data) {
		vm.sess.nextFocusOn = sessionGoesService.getMemberInfo(data.nextFocusOn);
		vm.sess.nextWhoGiveFeedback = sessionGoesService.getMemberInfo(data.nextWhoGiveFeedback);
	}

	function onTimerUpdate(sec) {
		vm.sess.timer = Number(sec);
	}
}