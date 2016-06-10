'use strict';

angular
	.module('app.profile')
	.factory('profileSettingsService', profileSettingsService);

function profileSettingsService($http, LoopBackAuth, Customer, APP_CONFIG) {
	var service = {
		timeZoneMap: buidTimeZoneMap(),
		languagesMap: buidLanguagesMap(),
		getCustomer: getCustomer,
		saveCustomer: saveCustomer,
		getDefaultImgData: getDefaultImgData,
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

	function buidLanguagesMap() {
		return languages.getAllLanguageCode().map(function(langCode) {
			return {
				code: langCode,
				name: languages.getLanguageInfo(langCode).name
			};
		});
	}

	function getCustomer() {
		var detectedTz = jstz.determine();
		// copy cause internal objects are the same for any instance
		var customer = angular.copy(Customer.getCachedCurrent());

		// Init profile timezone
		if (customer.timeZone === '') {
			customer.timeZone = detectedTz.name();
		}

		// Transform languages
		customer.groupPreferences.languages = customer.groupPreferences.languages.map(function(code) {
			return {code: code};
		});

		return customer;
	}

	function saveCustomer(customer, cb) {
		var sendData = angular.copy(customer);
		delete sendData._id;

		// Transform languages
		sendData.groupPreferences.languages = sendData.groupPreferences.languages.map(function(lang) {
			return lang.code;
		});

		Customer.prototype$updateAttributes({id: customer._id}, sendData, function(freshCustomer) {
			updateLocalStorage(freshCustomer);
			cb();
		});
	}

	function getDefaultImgData() {
		var actualCustomerAvatar = APP_CONFIG.apiRootUrl + Customer.getCachedCurrent().avatar;

		return {
			selectedPicture: actualCustomerAvatar,
			newPicture: null
		};
	}

	function uploadPicture(pictureFile, cb) {
		var url = APP_CONFIG.apiRootUrl + '/Customers/' + Customer.getCachedCurrent()._id + '/upload-avatar';

		var fd = new FormData();
		fd.append('file', pictureFile);

		$http.post(url, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}).success(function(customer){
			updateLocalStorage(customer);
			cb();
		});
	}

	function updateLocalStorage(customer) {
		customer = angular.fromJson(angular.toJson(customer));
		LoopBackAuth.setUser(LoopBackAuth.accessTokenId, customer._id, customer);
	}
}