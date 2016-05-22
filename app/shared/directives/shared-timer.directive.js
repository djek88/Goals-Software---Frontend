'use strict';

angular
	.module('app.shared')
	.directive('gTimer', gTimer);

function gTimer($interval) {
	return {
		restrict: 'E',
		template: '<span>{{output}}</span>',
		scope: {
			countTo: '@',
			callbackDelaySec: '@',
			callback: '&'
		},
		link: function(scope, elm, attrs) {
			var secTimeout = parseInt((new Date(scope.countTo) - Date.now()) / 1000);
			var delay = Number(scope.callbackDelaySec) || 0;
			scope.output = null;

			function updateTimer() {
				secTimeout--;

				if (secTimeout <= 0) {
					// if have delay before call callback
					if (delay && delay > 0 && secTimeout > (delay * -1)) {
						return scope.output = '';
					}

					$interval.cancel(intervalId);
					return scope.callback();
				}

				var min = parseInt(secTimeout / 60);
				var sec = parseInt(secTimeout % 60);

				scope.output = min ? min + ' Minutes ' : '';
				scope.output += sec ? sec + ' Seconds ' : '';
			}

			var intervalId = $interval(updateTimer, 1000);

			elm.on('$destroy', function() {
				$interval.cancel(intervalId);
			});

			updateTimer();
		}
	};
}