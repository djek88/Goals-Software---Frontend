'use strict';

describe('app.basic module ->', function() {
	beforeEach(module('app.basic'));

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
		var groups = [
			{
				NextSession: {
					_groupId: "571e226f3f9f45fb02877d42",
					_id: "571f2247ec29184d03be2f3e",
					_participantIds: [],
					excuses: {},
					startAt: "2016-04-30T21:00:00.000Z",
					state: []
				},
				_id: "571e226f3f9f45fb02877d42",
				_lastSessionId: "",
				_memberIds: [],
				_nextSessionId: "571f2247ec29184d03be2f3e",
				_ownerId: "14415597",
				createdAt: "2016-04-25T13:58:07.069Z",
				description: "",
				maxMembers: 5,
				memberCanInvite: false,
				name: "test1 group",
				penalty: 0,
				private: false,
				sessionConf: {
					day: 0,
					frequencyType: 1,
					roundLength: [120, 180, 90, 120],
					sheduled: true,
					time: "0.00",
					timeZone: "Europe/Zaporozhye"
				},
				type: 1
			}, {
				NextSession: {
					_groupId: "571e226f3f9f45fb02877d43",
					_id: "571f2247ec29184d03be2f4e",
					_participantIds: [],
					excuses: {},
					startAt: "2016-04-30T21:00:00.000Z",
					state: []
				},
				_id: "571e226f3f9f45fb02877d43",
				_lastSessionId: "",
				_memberIds: [],
				_nextSessionId: "571f2247ec29184d03be2f4e",
				_ownerId: "14415597",
				createdAt: "2016-04-25T13:58:07.069Z",
				description: "",
				maxMembers: 5,
				memberCanInvite: false,
				name: "test2 group",
				penalty: 0,
				private: false,
				sessionConf: {
					day: 0,
					frequencyType: 1,
					roundLength: [120, 180, 90, 120],
					sheduled: true,
					time: "0.00",
					timeZone: "Europe/Zaporozhye"
				},
				type: 1
			}
		];
		var goals = [
			{
				_groupId: "571e226f3f9f45fb02877d42",
				_id: "571f77f52c93d06d0ddd0b1c",
				_ownerId: "14415597",
				comments: "",
				createdAt: "2016-04-26T14:15:17.496Z",
				description: "",
				due: "2016-04-30T21:00:00.000Z",
				evidences: [],
				feedbacks: [],
				name: "test goal 2",
				state: 1,
				votes: []
			}, {
				_groupId: "571e226f3f9f45fb02877d42",
				_id: "571f77f52c93d06d0ddd0b2c",
				_ownerId: "14415597",
				comments: "",
				createdAt: "2016-04-26T14:15:17.496Z",
				description: "",
				due: "2016-04-30T21:00:00.000Z",
				evidences: [],
				feedbacks: [],
				name: "test goal 2",
				state: 1,
				votes: []
			}, {
				_groupId: "571e226f3f9f45fb02877d43",
				_id: "571f77f52c93d06d0ddd0b3c",
				_ownerId: "14415597",
				comments: "",
				createdAt: "2016-04-26T14:15:17.496Z",
				description: "",
				due: "2016-04-30T21:00:00.000Z",
				evidences: [],
				feedbacks: [],
				name: "test goal 2",
				state: 1,
				votes: []
			}, {
				_groupId: "571e226f3f9f45fb02877d43",
				_id: "571f77f52c93d06d0ddd0b4c",
				_ownerId: "14415597",
				comments: "",
				createdAt: "2016-04-26T14:15:17.496Z",
				description: "",
				due: "2016-04-30T21:00:00.000Z",
				evidences: [],
				feedbacks: [],
				name: "test goal 2",
				state: 1,
				votes: []
			}
		];
		var curCtrl;
		var curCtrlService;

		beforeEach(module('app.shared'));
		beforeEach(module('ui.bootstrap'));
		beforeEach(module(function($provide) { 
			$provide.factory('layoutLoader', function() {
				return {
					on: function() {},
					off: function() {}
				};
			});
		}));

		beforeEach(inject(function(_LoopBackAuth_, $controller, basicHomeService) {
			_LoopBackAuth_.setUser(authData.id, authData.userId, authData.user);
			_LoopBackAuth_.rememberMe = true;
			_LoopBackAuth_.save();

			curCtrlService = basicHomeService;
			curCtrl = $controller('basicHomeController', {loadAppData: {}, groups: groups, goals: goals});
		}));

		it('is defined', function() {
			expect(curCtrl).toBeDefined();
		});

		describe('onSessionStart function ->', function() {
			it('delete nextSession success', function() {
				curCtrl.groups.forEach(function(group) {
					expect(group._nextSessionId).toBeDefined();
					expect(group.NextSession).toBeDefined();

					curCtrl.onSessionStart(group._id);

					expect(group._nextSessionId).not.toBeDefined();
					expect(group.NextSession).not.toBeDefined();
				});
			});
		});

		describe('showExcuseModal function ->', function() {
			beforeEach(function() {
				spyOn(curCtrlService, 'excuseModalOpen');
				curCtrl.showExcuseModal(curCtrl.groups[0]._id);
			});

			it('call excuseModalOpen', function() {
				expect(curCtrlService.excuseModalOpen).toHaveBeenCalledTimes(1);
				expect(curCtrlService.excuseModalOpen).toHaveBeenCalledWith(
					curCtrl.groups[0]._id,
					jasmine.any(Function)
				);
			});

			it('update data in controller', function() {
				var callback = curCtrlService.excuseModalOpen.calls.argsFor(0)[1];
				var freshSession = angular.extend({}, curCtrl.groups[0].NextSession, {
					excuses: {'testUserId': {excuse: 'mock', valid: true}}
				});

				callback(freshSession);

				expect(curCtrl.groups[0].NextSession).toBe(freshSession);
			});
		});

		describe('scheduleSession function ->', function() {
			var $httpBackend;
			var groupId;
			var resData;

			beforeEach(inject(function(_$httpBackend_) {
				$httpBackend = _$httpBackend_;

				resData = angular.extend({}, curCtrl.groups[0].NextSession, {
					_id: 'testSessId',
					startAt: "2017-04-30T21:00:00.000Z"
				});

				groupId = curCtrl.groups[0]._id

				$httpBackend
					.whenPOST('/api/Groups/' + groupId + '/manually-shedule-session')
					.respond(200, resData);
			}));

			afterEach(function() {
				$httpBackend.verifyNoOutstandingExpectation();
				$httpBackend.verifyNoOutstandingRequest();
			});

			it('not should be request', function() {
				curCtrl.scheduleSession(groupId);
			});

			it('properly send data', function() {
				var threeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

				$httpBackend.expectPOST(
					'/api/Groups/' + groupId + '/manually-shedule-session',
					function(data) {
						return JSON.parse(data).startAt === threeDays.getTime();
					}
				);

				curCtrl.scheduledTime = threeDays;
				curCtrl.scheduleSession(groupId);

				$httpBackend.flush();
			});

			it('min start at check', function() {
				$httpBackend.expectPOST(
					'/api/Groups/' + groupId + '/manually-shedule-session',
					function(data) {
						var minStartAt = Date.now() + 8 * 60 * 1000;
						return JSON.parse(data).startAt - minStartAt < 30;
					}
				);

				curCtrl.scheduledTime = new Date();
				curCtrl.scheduleSession(groupId);

				$httpBackend.flush();
			});

			it('update data in controller', function() {
				$httpBackend.expectPOST('/api/Groups/' + groupId + '/manually-shedule-session');

				curCtrl.scheduledTime = new Date();
				curCtrl.scheduleSession(groupId);

				$httpBackend.flush();

				expect(curCtrl.groups[0]._nextSessionId).toBe(resData._id);
				expect(curCtrl.groups[0].NextSession).toEqual(resData);
			});
		});
	});
});