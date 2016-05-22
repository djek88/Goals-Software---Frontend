'use strict';

describe('app.basic module ->', function() {
	beforeEach(module('app.basic'));

	describe('basicMyGoalsController ->', function() {
		beforeEach(module('app.shared'));

		it('is defined', inject(function(_LoopBackAuth_, $controller) {
			var ctrl = $controller('basicMyGoalsController', {layoutLoader: {}, loadAppData: {}, groups: [], goals: []});
			expect(ctrl).toBeDefined();
		}));
	});
});