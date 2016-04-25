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
			callback: '&'
		},
		link: function(scope, elm, attrs) {
			var secTimeout = parseInt((new Date(scope.countTo) - Date.now()) / 1000);
			scope.output = null;

			function updateTimer() {
				secTimeout--;

				if (secTimeout <= 0) {
					// 15 min delay after due time reached
					if (secTimeout > -15 * 60) {
						return scope.output = '';
					}

					$interval.cancel(stopTime);
					return scope.callback();
				}

				var min = parseInt(secTimeout / 60);
				var sec = parseInt(secTimeout % 60);

				scope.output = min ? min + ' Minutes ' : '';
				scope.output += sec ? sec + ' Seconds ' : '';
			}

			var stopTime = $interval(updateTimer, 1000);

			elm.on('$destroy', function() {
				$interval.cancel(stopTime);
			});

			updateTimer();
		}
	};
}