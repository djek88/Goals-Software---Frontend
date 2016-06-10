'use strict';

angular
	.module('app.group')
	.factory('groupEditService', groupEditService);

function groupEditService($http, $stateParams, Group, APP_CONFIG) {
	var service = {
		timeZoneMap: buidTimeZoneMap(),
		languagesMap: buidLanguagesMap(),
		updateGroup: updateGroup,
		getDefaultImgData: getDefaultImgData,
		uploadPicture: uploadPicture,
		uploadAttachment: uploadAttachment
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

	function uploadPicture(pictureFile, cb) {
		var url = APP_CONFIG.apiRootUrl + '/Groups/' + $stateParams.id + '/upload-avatar';

		var fd = new FormData();
		fd.append('file', pictureFile);

		$http.post(url, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}).success(cb);
	}

	function uploadAttachment(attachmentFile, cb) {
		var url = APP_CONFIG.apiRootUrl + '/Groups/' + $stateParams.id + '/upload-attachment';

		var fd = new FormData();
		fd.append('file', attachmentFile);

		$http.post(url, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}).success(cb);
	}
}