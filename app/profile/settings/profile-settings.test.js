'use strict';

describe('app.profile module ->', function() {
	beforeEach(module('app.profile'));

	describe('profileSettingsController ->', function() {
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
		var $httpBackend;
		var LoopBackAuth;
		var curCtrl;

		beforeEach(module('app.shared'));
		beforeEach(module(function($provide) { 
			$provide.constant('APP_CONFIG', window.appConfig); 
			$provide.factory('layoutLoader', function() {
				return {
					on: function() {},
					off: function() {}
				};
			});
		}));

		beforeEach(inject(function(_LoopBackAuth_, _$httpBackend_, $controller, $rootScope) {
			LoopBackAuth = _LoopBackAuth_;
			$httpBackend = _$httpBackend_;

			LoopBackAuth.setUser(authData.id, authData.userId, authData.user);
			LoopBackAuth.rememberMe = true;
			LoopBackAuth.save();

			curCtrl = $controller('profileSettingsController', {$scope: $rootScope.$new(), loadAppData: {}});
		}));

		afterEach(function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it('is defined', function() {
			expect(curCtrl).toBeDefined();
		});

		describe('save function ->', function() {
			var resData;

			beforeEach(function() {
				// Make change in customer model
				curCtrl.customer.firstName = 'newFirstName';
				resData = angular.copy(curCtrl.customer);

				$httpBackend
					.whenPUT('/api/Customers/' + curCtrl.customer._id)
					.respond(200, resData);
			});

			it('properly send data, headers', function() {
				$httpBackend.expectPUT(
					'/api/Customers/' + curCtrl.customer._id,
					function(data) {
						return angular.equals(data, angular.toJson(curCtrl.customer))
							&& angular.isUndefined(data._id);
					},
					function(headers) {
						return headers['authorization'] === LoopBackAuth.accessTokenId;
					}
				);

				curCtrl.save();
				$httpBackend.flush();
			});

			it('update local storate', inject(function(Customer) {
				$httpBackend.expectPUT('/api/Customers/' + curCtrl.customer._id);

				curCtrl.save();
				$httpBackend.flush();

				expect(Customer.getCachedCurrent()).toEqual(resData);
			}));

			it('update data in controller', inject(function(Customer) {
				resData.firstName = 'firstNameNotUpdate';

				$httpBackend.expectPUT('/api/Customers/' + curCtrl.customer._id)
					.respond(200, resData);

				curCtrl.save();
				$httpBackend.flush();

				expect(curCtrl.customer).toEqual(resData);
			}));
		});
	});
});