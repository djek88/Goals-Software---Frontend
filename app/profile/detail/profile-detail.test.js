'use strict';

describe('app.profile module ->', function() {
	beforeEach(module('app.profile'));

	describe('profileDetailController ->', function() {
		var curCtrl;

		beforeEach(inject(function($controller) {
			curCtrl = $controller('profileDetailController', {customer: {}});
		}));

		it('is defined', function() {
			expect(curCtrl).toBeDefined();
		});
	});
});