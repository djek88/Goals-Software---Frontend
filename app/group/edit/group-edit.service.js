'use strict';

angular
	.module('app.group')
	.factory('groupEditService', groupEditService);

function groupEditService($http, Group, Additional, APP_CONFIG) {
	var service = {
		countriesMap: countriesMap,
		uploadStatesOrCitiesMap: uploadStatesOrCitiesMap,
		timeZoneMap: buidTimeZoneMap(),
		languagesMap: buidLanguagesMap(),
		updateGroup: updateGroup,
		getDefaultImgData: getDefaultImgData,
		uploadPicture: uploadPicture,
		uploadAttachment: uploadAttachment
	};
	return service;

	function countriesMap(countries) {
		countries = angular.copy(countries);
		countries.unshift({ id: '', name: 'Please select' });
		return countries;
	}

	function uploadStatesOrCitiesMap(countryId, stateId, cb) {
		var defaultOptions = [{ id: '', name: 'Please select' }];

		if (countryId) {
			if (stateId) {
				Additional.supportedCountries({
					countryId: countryId,
					stateId: stateId
				}, resolveOpts);
			} else {
				Additional.supportedCountries({
					countryId: countryId
				}, resolveOpts);
			}
		} else {
			return defaultOptions;
		}

		function resolveOpts(opts) {
			opts.unshift(defaultOptions[0]);
			cb(opts);
		}
	}

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

	function updateGroup(group, cb) {
		Group.prototype$updateAttributes({id: group._id}, group, cb);
	}

	function getDefaultImgData(group) {
		var actualGroupAvatar = APP_CONFIG.apiRootUrl + group.avatar;

		return {
			selectedPicture: actualGroupAvatar,
			newPicture: null
		};
	}

	function uploadPicture(pictureFile, groupId, cb) {
		var url = APP_CONFIG.apiRootUrl + '/Groups/' + groupId + '/upload-avatar';

		var fd = new FormData();
		fd.append('file', pictureFile);

		$http.post(url, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}).success(cb);
	}

	function uploadAttachment(attachmentFile, groupId, cb) {
		var url = APP_CONFIG.apiRootUrl + '/Groups/' + groupId + '/upload-attachment';

		var fd = new FormData();
		fd.append('file', attachmentFile);

		$http.post(url, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}).success(cb);
	}
}