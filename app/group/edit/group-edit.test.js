'use strict';

describe('app.group module ->', function() {
	beforeEach(module('app.group'));

	describe('groupEditController ->', function() {
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
				timeZone: "EST",
				social: {
					fb: '',
					li: '',
					tw: '',
					wb: ''
				},
				visitSeveralGroups: false,
				groupPreferences: {
					type: 5,
					joiningFee: [0, 0],
					monthlyFee: [0, 0],
					yearlyFee: [0, 0],
					penaltyFee: [0, 0],
					members: [1, 1],
					availableTime: ['0.00', '23.30'],
					languages: ['en']
				}
			}
		};
		var group = {
			_id: "571e226f3f9f45fb02877d42",
			_lastSessionId: "",
			_memberIds: [],
			_nextSessionId: "571f2247ec29184d03be2f3e",
			_ownerId: authData.userId,
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
		};
		var groupTypes = {
			"1": "Business",
			"2": "Investment",
			"3": "Personal Development",
			"4": "Health and Fithness",
			"5": "Other"
		};
		var penaltyAmounts = [0, 2, 5, 10, 15, 20, 30, 50, 75, 100, 200, 1000, 2500, 5000];
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

		beforeEach(module(function($provide) { 
			$provide.factory('notifyAndLeave', function() {
				return function() {};
			});

			$provide.factory('transformTimeTypes', function() {
				return function() {};
			});

			$provide.factory('layoutLoader', function() {
				return {
					on: function() {},
					off: function() {}
				};
			});
		}));

		beforeEach(inject(function(LoopBackAuth, _$httpBackend_, $controller, groupEditService) {
			LoopBackAuth.setUser(authData.id, authData.userId, authData.user);
			LoopBackAuth.rememberMe = true;
			LoopBackAuth.save();

			$httpBackend = _$httpBackend_;

			curCtrlService = groupEditService;
			curCtrl = $controller('groupEditController', {
				group: group,
				groupTypes: groupTypes,
				penaltyAmounts: penaltyAmounts,
				sessionFrequencyTypes: frequencyTypes,
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

		describe('edit function ->', function() {
			var res = angular.merge({}, group, {name: 'newNameInServResponce'});

			beforeEach(function() {
				curCtrl.group.name = 'new name for group';

				$httpBackend
					.whenPUT('/api/Groups/' + curCtrl.group._id)
					.respond(200, res);

				spyOn(curCtrlService, 'updateGroup').and.callThrough();

				curCtrl.edit();
			});

			it('call updateGroup', function() {
				expect(curCtrlService.updateGroup).toHaveBeenCalledTimes(1);
				expect(curCtrlService.updateGroup)
					.toHaveBeenCalledWith(curCtrl.group, jasmine.any(Function));

				$httpBackend.flush();
			});

			it('call updateGroup request', function() {
				$httpBackend
					.expectPUT('/api/Groups/' + curCtrl.group._id);

				$httpBackend.flush();
			});

			it('update data in controller', function() {
				$httpBackend
					.expectPUT('/api/Groups/' + curCtrl.group._id);

				$httpBackend.flush();

				expect(curCtrl.group.name).toEqual(res.name);
			});
		});
	});
});