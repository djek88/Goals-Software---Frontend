'use strict';

describe('app.group module ->', function() {
	beforeEach(module('app.group'));

	describe('groupDetailController ->', function() {
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
		var group = {
			_id: "571e226f3f9f45fb02877d42",
			_lastSessionId: "",
			_memberIds: ['14415598'],
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
			type: 1,
			Owner: authData.user,
			Members: [
				{
					_id: "14415598",
					avatar: "/AvatarsContainers/14415597/download/evhynrf0RvI.jpg",
					createdAt: "2016-04-13T15:08:05.174Z",
					description: '',
					firstName: "dsa123",
					lastName: "last name",
					social: {
						fb: '',
						li: '',
						tw: ''
					},
					timeZone: "EST"
				}
			]
		};
		var sessionsPassed = [];
		var frequencyTypes = {
			"1": "Weekly",
			"2": "First week",
			"3": "Second week",
			"4": "Third week",
			"5": "Fourth week",
			"6": "First and third week",
			"7": "Second and fourth week"
		};
		var sessionDayTypes = {
			"0": "Sunday",
			"1": "Monday",
			"2": "Tuesday",
			"3": "Wednesday",
			"4": "Thursday",
			"5": "Friday",
			"6": "Saturday"
		};
		var sessionTimeTypes = {
			"0.00": "12:00 AM",
			"0.30": "12:30 AM",
			"1.00": "1:00 AM",
			"1.30": "1:30 AM",
			"2.00": "2:00 AM",
			"2.30": "2:30 AM",
			"3.00": "3:00 AM",
			"3.30": "3:30 AM",
			"4.00": "4:00 AM",
			"4.30": "4:30 AM",
			"5.00": "5:00 AM",
			"5.30": "5:30 AM",
			"6.00": "6:00 AM",
			"6.30": "6:30 AM",
			"7.00": "7:00 AM",
			"7.30": "7:30 AM",
			"8.00": "8:00 AM",
			"8.30": "8:30 AM",
			"9.00": "9:00 AM",
			"9.30": "9:30 AM",
			"10.00": "10:00 AM",
			"10.30": "10:30 AM",
			"11.00": "11:00 AM",
			"11.30": "11:30 AM",
			"12.00": "12:00 PM",
			"12.30": "12:30 PM",
			"13.00": "1:00 PM",
			"13.30": "1:30 PM",
			"14.00": "2:00 PM",
			"14.30": "2:30 PM",
			"15.00": "3:00 PM",
			"15.30": "3:30 PM",
			"16.00": "4:00 PM",
			"16.30": "4:30 PM",
			"17.00": "5:00 PM",
			"17.30": "5:30 PM",
			"18.00": "6:00 PM",
			"18.30": "6:30 PM",
			"19.00": "7:00 PM",
			"19.30": "7:30 PM",
			"20.00": "8:00 PM",
			"20.30": "8:30 PM",
			"21.00": "9:00 PM",
			"21.30": "9:30 PM",
			"22.00": "10:00 PM",
			"22.30": "10:30 PM",
			"23.00": "11:00 PM",
			"23.30": "11:30 PM"
		};
		var curCtrl;
		var curCtrlService;
		var $httpBackend;

		beforeEach(module('ui.bootstrap'));
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

		beforeEach(inject(function(LoopBackAuth, _$httpBackend_, $controller, groupDetailService) {
			LoopBackAuth.setUser(authData.id, authData.userId, authData.user);
			LoopBackAuth.rememberMe = true;
			LoopBackAuth.save();

			$httpBackend = _$httpBackend_;

			curCtrlService = groupDetailService;
			curCtrl = $controller('groupDetailController', {
				loadAppData: {},
				group: group,
				sessionsPassed: sessionsPassed,
				frequencyTypes: frequencyTypes,
				sessionDayTypes: sessionDayTypes,
				sessionTimeTypes: sessionTimeTypes
			});
		}));

		afterEach(function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it('is defined', function() {
			expect(curCtrl).toBeDefined();
		});

		describe('showEmailModal function ->', function() {
			beforeEach(function() {
				spyOn(curCtrlService, 'emailModalOpen');
				curCtrl.showEmailModal(curCtrl.listMembersWithOwner[0]);
			});

			it('call emailModalOpen', function() {
				expect(curCtrlService.emailModalOpen).toHaveBeenCalledTimes(1);
				expect(curCtrlService.emailModalOpen).toHaveBeenCalledWith(
					curCtrl.group._id,
					curCtrl.listMembersWithOwner[0],
					jasmine.any(Function)
				);
			});
		});

		describe('removeOwner function ->', function() {
			beforeEach(function() {
				spyOn(curCtrlService, 'deleteOwnerBox');
				curCtrl.removeOwner();
			});

			it('call deleteOwnerBox', function() {
				expect(curCtrlService.deleteOwnerBox).toHaveBeenCalledTimes(1);
				expect(curCtrlService.deleteOwnerBox).toHaveBeenCalledWith(
					group,
					jasmine.any(Function)
				);
			});

			it('without any request', function() {
				var callback = curCtrlService.deleteOwnerBox.calls.argsFor(0)[1];

				callback('click to cancel button');
				callback('Select new owner');
			});

			it('delete group request', function() {
				var callback = curCtrlService.deleteOwnerBox.calls.argsFor(0)[1];

				$httpBackend
					.expectDELETE('/api/Groups/' + group._id)
					.respond(200);

				callback('Delete group');

				$httpBackend.flush();
			});

			it('change owner request', function() {
				var callback = curCtrlService.deleteOwnerBox.calls.argsFor(0)[1];
				var newOwnerId = 982323479;

				$httpBackend
					.expectPUT('/api/Groups/' + group._id + '/change-owner/' + newOwnerId)
					.respond(200);

				callback('Select new owner', newOwnerId);

				$httpBackend.flush();
			});
		});

		describe('removeMember function ->', function() {
			var memberId = group.Members[0]._id;

			beforeEach(function() {
				$httpBackend
					.whenDELETE('/api/Groups/' + group._id + '/Members/rel/' + memberId)
					.respond(200);

				spyOn(curCtrlService, 'deleteMemberBox');
				spyOn(curCtrlService, 'removeMemberFromGroup').and.callThrough();
				curCtrl.removeMember(memberId);
			});

			it('call deleteMemberBox', function() {
				expect(curCtrlService.deleteMemberBox).toHaveBeenCalledTimes(1);
				expect(curCtrlService.deleteMemberBox).toHaveBeenCalledWith(jasmine.any(Function));
			});

			it('call removeMemberFromGroup', function() {
				var callback = curCtrlService.deleteMemberBox.calls.argsFor(0)[0];

				callback();

				expect(curCtrlService.removeMemberFromGroup).toHaveBeenCalledTimes(1);
				expect(curCtrlService.removeMemberFromGroup)
					.toHaveBeenCalledWith(group, memberId, jasmine.any(Function));

				$httpBackend.flush();
			});

			it('remove member grom group request', function() {
				var callback = curCtrlService.deleteMemberBox.calls.argsFor(0)[0];

				$httpBackend
					.expectDELETE('/api/Groups/' + group._id + '/Members/rel/' + memberId);

				callback();

				$httpBackend.flush();
			});
		});
	});
});