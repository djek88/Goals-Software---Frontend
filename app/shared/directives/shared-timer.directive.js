'use strict';

angular
	.module('app.shared')
	.directive('gTimer', gTimer);

function gTimer($interval) {
	return {
		restrict: 'E',
		templateUrl: 'app/shared/directives/shared-timer.view.html',
		scope: {
			countTo: '@',
			callbackDelaySec: '@',
			callback: '&',
			calendarDesign: '@'
		},
		link: function(scope, elm, attrs) {
			/*setInterval(function() {
				turnToNext('minuteTens');
			}, 360000);

			setInterval(function() {
				turnToNext('minuteOnes');
			}, 60000);

			setInterval(function() {
				turnToNext('secondTens');
			}, 10000);

			setInterval(function() {
				turnToNext('secondOnes');
			}, 1000);

			function turnToNext(className) {
				$("body").removeClass("play");
				var aa = $('ul.' + className + ' li.active');

				if (aa.html() == undefined) {
					aa = $('ul.' + className + ' li').eq(0);
					aa.addClass("before")
						.removeClass("active")
						.next("li")
						.addClass("active")
						.closest("body")
						.addClass("play");
				}
				else if (aa.is(":last-child")) {
					$('ul.' + className + ' li').removeClass("before");
					aa.addClass("before").removeClass("active");
					aa = $('ul.' + className + ' li').eq(0);
					aa.addClass("active")
						.closest("body")
						.addClass("play");
				}
				else {
					$('ul.' + className + ' li').removeClass("before");
					aa.addClass("before")
						.removeClass("active")
						.next("li")
						.addClass("active")
						.closest("body")
						.addClass("play");
				}
			}*/

			var intervalId;

			scope.$watch('countTo', function(countTo) {
				var secTimeout = parseInt((new Date(scope.countTo) - Date.now()) / 1000);
				var delay = Number(scope.callbackDelaySec) || 0;

				stopInterval();

				intervalId = $interval(updateTimer, 1000);
				elm.on('$destroy', stopInterval);

				/*if (scope.calendarDesign) {
					turnToNext('minute', number from what want to start)
				}*/

				updateTimer();

				function updateTimer() {
					secTimeout--;

					if (secTimeout <= 0) {
						// if have delay before call callback
						if (delay && delay > 0 && secTimeout > (delay * -1)) {
							scope.min = 0;
							scope.sec = 0;
							return;
						}

						stopInterval();
						return scope.callback();
					}

					scope.min = parseInt(secTimeout / 60);
					scope.sec = parseInt(secTimeout % 60);
				}
			});

			function stopInterval() {
				$interval.cancel(intervalId);
			}
		}
	};
}