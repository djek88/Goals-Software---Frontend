'use strict';

angular
	.module('app.shared')
	.directive('gLikeCalendarDate', gLikeCalendarDate);

function gLikeCalendarDate() {
	return {
		restrict: 'E',
		templateUrl: 'app/shared/directives/shared-like-calendar-date.view.html',
		scope: {
			date: '@'
		},
		link: function(scope, elm, attrs) {
			scope.$watch('date', function(newDate) {
				scope.symbols = newDate.split('');
			});
		}
	};
}