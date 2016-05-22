'use strict';

describe('app.group module ->', function() {
	beforeEach(module('app.group'));

	describe('basicHomeController ->', function() {
		var authData = {
			id: 'gX6E2dlKxOBNB4w1HAbOpKbHATNDIQaAnojwMMyVpejcO3yQAyrQWlkMY0ShQ7WD',
			userId: '14415597',
			user: {
				_id: "14415597",
				avatar: "/AvatarsContainers/14415597/download/evhynrf0RvI.jpg",
				createdAt: "2016-04-13T15:08:05.174Z",
				description: '',
				firstName: "dsa12",
				lastName: "last name",
				social: {
					fb: '',
					li: '',
					tw: ''
				},
				timeZone: "EST"
			}
		};
		var curCtrl;

		beforeEach(module(function($provide) { 
			$provide.factory('notifyAndLeave', function() {
				return function() {};
			});

			$provide.factory('layoutLoader', function() {
				return {
					on: function() {},
					off: function() {}
				};
			});
		}));

		beforeEach(inject(function(LoopBackAuth, $controller) {
			LoopBackAuth.setUser(authData.id, authData.userId, authData.user);
			LoopBackAuth.rememberMe = true;
			LoopBackAuth.save();

			curCtrl = $controller('groupCreateController', {groupTypes: {}, penaltyAmounts: [], sessionFrequencyTypes: {}, sessionDayTypes: {}, sessionTimeTypes: {}});
		}));

		it('is defined', function() {
			expect(curCtrl).toBeDefined();
		});

		describe('create function ->', function() {
			var $httpBackend;

			beforeEach(inject(function(_$httpBackend_) {
				$httpBackend = _$httpBackend_;

				$httpBackend
					.whenPOST('/api/Groups')
					.respond(200, {});
			}));

			afterEach(function() {
				$httpBackend.verifyNoOutstandingExpectation();
				$httpBackend.verifyNoOutstandingRequest();
			});

			it('properly send data', function() {
				var newGroup = {
					testFiled: 'testFieldData'
				};

				$httpBackend.expectPOST(
					'/api/Groups',
					function(data) {
						return angular.equals(JSON.parse(data), newGroup);
					}
				);

				curCtrl.group = newGroup;
				curCtrl.create();

				$httpBackend.flush();
			});
		});
	});
});