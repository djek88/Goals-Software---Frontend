'use strict';

angular
	.module('app.shared')
	.directive('gGoalStateIcon', gGoalStateIcon);

function gGoalStateIcon($interval) {
	return {
		restrict: 'E',
		template: '<i class="{{dinamicIcon}}" style="color: {{dinamicColor}}; padding-left: 10px; font-size: 23px;">',
		scope: {
			state: '@'
		},
		link: function(scope, elm, attrs) {
			scope.state = +scope.state;

			if (scope.state === 1) {
				scope.dinamicIcon = 'fa fa-star-o';
				scope.dinamicColor = '#E61610';
			}
			else if (scope.state === 2) {
				scope.dinamicIcon = 'fa fa-star-half-o';
				scope.dinamicColor = '#FFA834';
			}
			else if (scope.state === 3) {
				scope.dinamicIcon = 'fa fa-star';
				scope.dinamicColor = '#72BB53';
			}
			else if (scope.state === 4) {
				scope.dinamicIcon = 'fa fa-star-half-o';
				scope.dinamicColor = '#E61610';
			}
			else if (scope.state === 5) {
				scope.dinamicIcon = 'fa fa-frown-o';
			}
		}
	};
}