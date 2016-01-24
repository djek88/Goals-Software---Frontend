'use strict';

angular
	.module('app.group')
	.controller('groupDetailController', groupDetailController);

function groupDetailController($rootScope, groupDetailService, customer, group) {
	var vm = this;

	vm.curCustomer = customer;
	vm.group = group;
	vm.members = groupDetailService.getMembers(group);
	vm.urlBase = $rootScope.urlBase;

	vm.removeMember = removeMember;

	function removeMember(memberId) {
		// if owner want alive group
		if (memberId == vm.group._ownerId) {
			console.log('Delete Group Owner');
			return groupDetailService.changeOwner(group, '56a4d8fb3cff56a0034f6ea2', function(group) {
				
			});
		}

		groupDetailService.removeMember(group, memberId, function(group) {
			vm.group = group;
			vm.members = groupDetailService.getMembers(group);

			$.smallBox({
				title: 'Ding Dong!',
				content: 'Removed',
				color: '#296191',
				timeout: 3000,
				icon: 'fa fa-bell swing animated'
			});
		});
	}



	/*console.log('curCustomer', vm.curCustomer);
	console.log('group', vm.group);
	console.log('members', vm.members);*/
}