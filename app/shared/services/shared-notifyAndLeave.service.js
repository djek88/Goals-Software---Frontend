'use strict';

angular
	.module('app.shared')
	.factory('notifyAndLeave', notifyAndLeave);

function notifyAndLeave($state) {
	return function(opts) {
		var box = opts.box || 'smallBox';
		var title = opts.title && opts.title.toString() || null;
		var content = opts.content && opts.content.toString() || null;
		var leave = opts.leave || null;
		var isError = opts.isError || false;
		var timeout = opts.timeout || 3000;
		var sound = opts.sound || false;

		if (title && content) {
			$[box]({
				title: title,
				content: content,
				timeout: timeout,
				color: isError ? '#C46A69' : '#296191',
				icon: isError ? 'fa fa-warning shake animated' : 'fa fa-bell swing animated',
				sound: sound
			});
		}

		if (leave && leave.to) {
			$state.go(leave.to.toString(), leave.params || {});
		}
	};
}