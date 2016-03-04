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
			var secTimeout = parseInt((new Date(scope.countTo) - new Date()) / 1000);
			scope.output = null;

			function updateTimer() {
				secTimeout--;

				if (secTimeout <= 0) {
					$interval.cancel(stopTime);
					scope.callback();
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