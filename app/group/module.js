'use strict';

angular
	.module('app.group', [
		'ui.router',
		'backendApi',
		'ui.bootstrap.datetimepicker',
		'file-model'
	])
	.config(config);

function config($stateProvider) {
	$stateProvider
		.state('reviewGroup', {
			url: '/review/:id/group',
			data: {
				title: 'Review group'
			},
			views: {
				root: {
					templateUrl: 'app/group/review/group-review.view.html',
					controller: 'reviewGroupController',
					controllerAs: 'vm'
				}
			},
			resolve: {
				group: function($q, $stateParams, Group) {
					var deferred = $q.defer();

					Group.prototype$baseGroupInfo({
							id: $stateParams.id
						},
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				sessionsPassed: function($q, $stateParams, Group) {
					var deferred = $q.defer();

					Group.prototype$countPassedSessions({
							id: $stateParams.id
						},
						function() {
							deferred.resolve(arguments[0].count);
						},
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				frequencyTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.sessionFrequencyTypes(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				sessionDayTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.sessionDayTypes(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				sessionTimeTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.sessionTimeTypes(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				scripts: function(lazyScript){
					return lazyScript.register(['jstz']);
				}
			}
		})
		.state('app.group', {
			abstract: true,
			url: '/group',
			template: '<ui-view/>'
		})
		.state('app.group.myGroups', {
			url: '/my-groups',
			data: {
				title: 'My groups'
			},
			views: {
				'content@app': {
					templateUrl: 'app/group/my-groups/group-my-groups.view.html',
					controller: 'groupMyGroupsController',
					controllerAs: 'vm'
				}
			},
			resolve: {
				groups: function($q, Group, Customer, loadAppData) {
					var deferred = $q.defer();
					var id = Customer.getCachedCurrent()._id;

					Group.find({
							filter: {
								where: {or: [{_ownerId: id}, {_memberIds: id}]},
								include: 'NextSession'
							}
						},
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				}
			}
		})
		.state('app.group.search', {
			url: '/search',
			data: {
				title: 'Search groups'
			},
			views: {
				'content@app': {
					templateUrl: 'app/group/search/group-search.view.html',
					controller: 'groupSearchController',
					controllerAs: 'vm'
				}
			},
			resolve: {
				groupTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.groupTypes(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				penaltyAmounts: function($q, Additional) {
					var deferred = $q.defer();

					Additional.penaltyAmounts(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				}
			}
		})
		.state('app.group.detail', {
			url: '/:id/detail',
			data: {
				title: 'Your group'
			},
			views: {
				'content@app': {
					templateUrl: 'app/group/detail/group-detail.view.html',
					controller: 'groupDetailController',
					controllerAs: 'vm'
				}
			},
			resolve: {
				group: function($q, $stateParams, Group) {
					var deferred = $q.defer();

					Group.findById({
							id: $stateParams.id,
							filter: {include: ['Members', 'Owner']}
						},
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				sessionsPassed: function($q, $stateParams, Group) {
					var deferred = $q.defer();

					Group.prototype$countPassedSessions({
							id: $stateParams.id
						},
						function() {
							deferred.resolve(arguments[0].count);
						},
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				frequencyTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.sessionFrequencyTypes(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				sessionDayTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.sessionDayTypes(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				sessionTimeTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.sessionTimeTypes(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				scripts: function(lazyScript){
					return lazyScript.register(['jstz']);
				}
			}
		})
		.state('app.group.join', {
			url: '/:id/join',
			data: {
				title: 'Join to group'
			},
			views: {
				'content@app': {
					templateUrl: 'app/group/join/group-join.view.html',
					controller: 'groupJoinController',
					controllerAs: 'vm'
				}
			}
		})
		.state('app.group.joinRequests', {
			url: '/:id/join-requests',
			data: {
				title: 'Join requests'
			},
			views: {
				'content@app': {
					templateUrl: 'app/group/join-requests/group-join-requests.view.html',
					controller: 'groupJoinRequestsController',
					controllerAs: 'vm'
				}
			},
			resolve: {
				activeRequests: function($q, $stateParams, Group) {
					var deferred = $q.defer();

					Group.prototype$activeJoinRequests({
							id: $stateParams.id
						},
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				}
			}
		})
		.state('app.group.approveExcuse', {
			url: '/:id/session/:sessionId/approve-excuse/:excuseId',
			views: {
				'content@app': {
					controller: function($stateParams, Group, notifyAndLeave, layoutLoader, loadAppData) {
						layoutLoader.on();

						Group.prototype$approveExcuse({
								id: $stateParams.id,
								sessionId: $stateParams.sessionId,
								excuseId: $stateParams.excuseId
							}, null, function() {
								notifyAndLeave({
									title: 'Approve excuse...',
									content: 'Thanks for your vote.',
									leave: {to: 'app.home'}
								});
							}, function() {
								notifyAndLeave({
									leave: {to: 'app.home'}
								});
							}
						);
					}
				}
			}
		})
		.state('app.group.rejectExcuse', {
			url: '/:id/session/:sessionId/reject-excuse/:excuseId',
			views: {
				'content@app': {
					controller: function($timeout, notifyAndLeave, layoutLoader, loadAppData) {
						layoutLoader.on();

						$timeout(function() {
							notifyAndLeave({
								title: 'Reject excuse...',
								content: 'Thanks for your vote.',
								leave: {to: 'app.home'}
							});
						}, 300);
					}
				}
			}
		})
		.state('app.group.invite', {
			url: '/:id/invite',
			data: {
				title: 'Invite to group'
			},
			views: {
				'content@app': {
					templateUrl: 'app/group/invite/group-invite.view.html',
					controller: 'groupInviteController',
					controllerAs: 'vm'
				}
			},
			resolve: {
				group: function($q, $stateParams, Group) {
					var deferred = $q.defer();

					Group.findById({
							id: $stateParams.id
						},
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				}
			}
		})
		.state('app.group.create', {
			url: '/create',
			data: {
				title: 'Create new group'
			},
			views: {
				'content@app': {
					templateUrl: 'app/group/create/group-create.view.html',
					controller: 'groupCreateController',
					controllerAs: 'vm'
				}
			},
			resolve: {
				groupTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.groupTypes(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				penaltyAmounts: function($q, Additional) {
					var deferred = $q.defer();

					Additional.penaltyAmounts(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				sessionFrequencyTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.sessionFrequencyTypes(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				sessionDayTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.sessionDayTypes(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				sessionTimeTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.sessionTimeTypes(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				scripts: function(lazyScript){
					return lazyScript.register(['jstz']);
				}
			}
		})
		.state('app.group.edit', {
			url: '/:id/edit',
			data: {
				title: 'Edit group'
			},
			views: {
				'content@app': {
					templateUrl: 'app/group/edit/group-edit.view.html',
					controller: 'groupEditController',
					controllerAs: 'vm'
				}
			},
			resolve: {
				group: function($q, $stateParams, Group) {
					var deferred = $q.defer();

					Group.findById({
							id: $stateParams.id
						},
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				groupTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.groupTypes(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				penaltyAmounts: function($q, Additional) {
					var deferred = $q.defer();

					Additional.penaltyAmounts(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				sessionFrequencyTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.sessionFrequencyTypes(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				sessionDayTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.sessionDayTypes(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				sessionTimeTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.sessionTimeTypes(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				scripts: function(lazyScript){
					return lazyScript.register(['jstz']);
				}
			}
		})
		.state('app.group.goalCreate', {
			url: '/:id/goal-create',
			data: {
				title: 'Create goal'
			},
			views: {
				'content@app': {
					templateUrl: 'app/group/goal-create/group-goal-create.view.html',
					controller: 'groupGoalCreateController',
					controllerAs: 'vm'
				}
			},
			resolve: {
				group: function($q, $stateParams, Group) {
					var deferred = $q.defer();

					Group.findById({
							id: $stateParams.id,
							filter: {include: ['NextSession']}
						},
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				}
			}
		})
		.state('app.group.goalEdit', {
			url: '/:id/goal-edit/:goalId',
			data: {
				title: 'Edit goal'
			},
			views: {
				'content@app': {
					templateUrl: 'app/group/goal-edit/group-goal-edit.view.html',
					controller: 'groupGoalEditController',
					controllerAs: 'vm'
				}
			},
			resolve: {
				goal: function($q, $stateParams, Goal) {
					var deferred = $q.defer();

					Goal.findById({
							id: $stateParams.goalId
						},
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				}
			}
		})
		.state('app.group.memberGoals', {
			url: '/:id/member-goals/:memberId',
			data: {
				title: 'Member goals'
			},
			views: {
				'content@app': {
					templateUrl: 'app/group/member-goals/group-member-goals.view.html',
					controller: 'groupMemberGoalsController',
					controllerAs: 'vm'
				}
			},
			resolve: {
				goals: function($q, $stateParams, Group) {
					var deferred = $q.defer();

					Group.prototype$memberGoals({
							id: $stateParams.id,
							memberId: $stateParams.memberId
						},
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				member: function($q, $stateParams, Customer) {
					var deferred = $q.defer();

					Customer.prototype$baseCustomerInfo({
							id: $stateParams.memberId
						},
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
			}
		})
		.state('app.group.uploadGoalEvidence', {
			url: '/:id/upload-goal-evidence/:goalId',
			data: {
				title: 'Upload goal evidence'
			},
			views: {
				'content@app': {
					templateUrl: 'app/group/upload-goal-evidence/group-upload-goal-evidence.view.html',
					controller: 'groupUploadGoalEvidenceController',
					controllerAs: 'vm'
				}
			},
			resolve: {
				evidenceTypes: function($q, Additional) {
					var deferred = $q.defer();

					Additional.evidenceSupportedTypes(
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				goal: function($q, $state, $stateParams, Goal, Customer) {
					var deferred = $q.defer();

					Goal.findById({
							id: $stateParams.goalId
						},
						function(goal) {
							if (goal._ownerId !== Customer.getCachedCurrent()._id) {
								$state.go('app.group.goalReview', {
									id: $stateParams.id,
									goalId: $stateParams.goalId
								});
							}

							deferred.resolve(goal);
						},
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				group: function($q, $stateParams, Group) {
					var deferred = $q.defer();

					Group.findById({
							id: $stateParams.id,
							filter: {include: ['Members', 'Owner']}
						},
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				}
			}
		})
		.state('app.group.goalReview', {
			url: '/:id/goal-review/:goalId',
			data: {
				title: 'Goal review'
			},
			views: {
				'content@app': {
					templateUrl: 'app/group/goal-review/group-goal-review.view.html',
					controller: 'groupGoalReviewController',
					controllerAs: 'vm'
				}
			},
			resolve: {
				goal: function($q, $state, $stateParams, Goal, Customer) {
					var deferred = $q.defer();

					Goal.findById({
							id: $stateParams.goalId
						},
						function(goal) {
							if (goal._ownerId === Customer.getCachedCurrent()._id) {
								$state.go('app.group.uploadGoalEvidence', {
									id: $stateParams.id,
									goalId: $stateParams.goalId
								});
							}

							deferred.resolve(goal);
						},
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				},
				group: function($q, $stateParams, Group) {
					var deferred = $q.defer();

					Group.findById({
							id: $stateParams.id,
							filter: {include: ['Members', 'Owner']}
						},
						deferred.resolve.bind(deferred),
						deferred.reject.bind(deferred)
					);

					return deferred.promise;
				}
			}
		});
}