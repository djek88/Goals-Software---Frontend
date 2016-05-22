'use strict';

angular
	.module('app.shared')
	.directive('gClickOutside', gClickOutside);

function gClickOutside($parse, $timeout) {
	return {
		link: function (scope, element, attrs) {
			function handler(event) {
				if(!$(event.target).closest(element).length) {
					scope.$apply(function () {
						$parse(attrs.gClickOutside)(scope);
					});
				}
			}

			$timeout(function () {
				// Timeout is to prevent the click handler from immediately
				// firing upon opening the popover.
				$(document).on("click", handler);
			});

			scope.$on("$destroy", function () {
				$(document).off("click", handler);
			});
		}
	}
};