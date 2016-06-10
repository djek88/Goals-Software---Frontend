'use strict';

angular
	.module('app.shared')
	.factory('notifyAndLeave', notifyAndLeave);

function notifyAndLeave($state, Notification) {
	return function(opts) {
		Notification.call(Notification, opts);

		if (opts.leave && opts.leave.to) {
			$state.go(opts.leave.to.toString(), opts.leave.params || {});
		}
	};
}