'use strict';

angular
	.module('app.profile')
	.factory('profileSettingsService', profileSettingsService);

function profileSettingsService($rootScope, $http, LoopBackAuth, Customer, APP_CONFIG) {
	var service = {
		timeZoneMap: buidTimeZoneMap(),
		getCustomer: prepareCustomer,
		saveCustomer: saveCustomer,
		getDefaultImgData: getDefaultImgData,
		readFileAsDataUrl: readFileAsDataUrl,
		uploadPicture: uploadPicture
	};
	return service;

	function buidTimeZoneMap() {
		var results = [];

		moment.tz.names().forEach(function(zoneName) {
			var tz = moment.tz(zoneName);

			results.push({
				id: zoneName,
				name: zoneName.replace(/_/g, ' '),
				offset: 'UTC' + tz.format('Z'),
				nOffset: tz.utcOffset()
			});
		});

		return results;
	}

	function prepareCustomer() {
		var detectedTz = jstz.determine();
		var customer = Customer.getCachedCurrent();

		// Init profile timezone
		if (customer.timeZone === '') {
			customer.timeZone = detectedTz.name();
		}

		return customer;
	}

	function saveCustomer(customer, cb) {
		var customerId = customer._id;

		delete customer._id;

		Customer.prototype$updateAttributes({id: customerId}, customer, function(customer) {
			// Update localStorage
			LoopBackAuth.setUser(LoopBackAuth.accessTokenId, customer._id, customer);

			cb();
		});
	}

	function getDefaultImgData() {
		var actualCustomerAvatar = $rootScope.urlBase + Customer.getCachedCurrent().avatar;

		return {
			selectedPicture: actualCustomerAvatar,
			newPicture: null
		};
	}

	function readFileAsDataUrl(file, cb) {
		var fileReader = new FileReader();

		fileReader.onload = function() {
			cb(fileReader.result);
		};

		fileReader.readAsDataURL(file);
	}

	function uploadPicture(customerId, pictureFile, cb) {
		var url = APP_CONFIG.apiRootUrl + '/Customers/' + customerId + '/upload-avatar';

		var fd = new FormData();
		fd.append('file', pictureFile);

		$http.post(url, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}).success(function(result){
			// update cached Customer
			LoopBackAuth.setUser(LoopBackAuth.accessTokenId, result._id, result);
			cb();
		});
	}
}