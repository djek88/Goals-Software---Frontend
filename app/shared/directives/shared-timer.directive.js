'use strict';

angular
	.module('app.shared')
	.directive('gTimer', gTimer);

function gTimer($interval, $rootScope) {
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
			var intervalId;

			scope.$watch('countTo', function(countTo) {
				var secTimeout = parseInt((new Date(countTo) - Date.now()) / 1000);
				var delay = Number(scope.callbackDelaySec) || 0;

				if (secTimeout >= 3600) {
					scope.calendarDesign = false;
				}

				$interval.cancel(intervalId);

				if (scope.calendarDesign) {
					scope.$evalAsync(function() {
						var time = secToTimeStr(secTimeout);
						setCounterNumber('minuteTens', time[0]);
						setCounterNumber('minuteOnes', time[1]);
						setCounterNumber('secondTens', time[2]);
						setCounterNumber('secondOnes', time[3]);
					});
				}

				intervalId = $interval(updateTimer, 1000);
				elm.on('$destroy', $interval.cancel.bind(null,intervalId));

				scope.$evalAsync(function() {
					updateTimer();
				});

				function updateTimer() {
					secTimeout--;
					var time = secToTimeStr(secTimeout);

					if (scope.calendarDesign && secTimeout >= 0) {
						isNeedUpdateCountdown('minuteTens', time[0]) && turnToNext('minuteTens');
						isNeedUpdateCountdown('minuteOnes', time[1]) && turnToNext('minuteOnes');
						isNeedUpdateCountdown('secondTens', time[2]) && turnToNext('secondTens');
						isNeedUpdateCountdown('secondOnes', time[3]) && turnToNext('secondOnes');
					}

					if (secTimeout <= 0) {
						// if have delay before call callback
						if (delay && delay > 0 && secTimeout > (delay * -1)) {
							scope.min = 0;
							scope.sec = 0;
							return;
						}

						$interval.cancel(intervalId);
						return scope.callback();
					}

					scope.min = time.substring(0, 2);
					scope.sec = time.substring(2);
				}

				function setCounterNumber(className, desiredNum) {
					if (desiredNum < 0 || desiredNum > maxIndex) return;

					var liElements = $('ul.' + className + ' li');
					var maxIndex = liElements.length - 1;
					var desiredIndex = maxIndex - desiredNum;

					if (desiredIndex === 0) {
						liElements.eq(maxIndex)
							.addClass("before")
							.removeClass("active");

						liElements.eq(desiredIndex)
							.addClass("active");
					} else {
						liElements
							.eq(desiredIndex - 1)
							.addClass("before")
							.removeClass("active")
							.next("li")
							.addClass("active")
							.closest("body")
							.addClass("play");
					}
				}

				function isNeedUpdateCountdown(className, numToCheck) {
					var activeElement = $('ul.' + className + ' li.active')[0];
					return activeElement.textContent[0] !== numToCheck.toString();
				}

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
				}

				function secToTimeStr(sec) {
					var min = parseInt(sec / 60).toString();
					var sec = parseInt(sec % 60).toString();
					min = min.length == 1 ? '0' + min : min;
					sec = sec.length == 1 ? '0' + sec : sec;

					return min + sec;
				}
			});
		}
	};
}