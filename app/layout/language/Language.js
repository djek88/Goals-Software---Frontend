"use strict";

angular
	.module('app')
	.factory('Language', Language);

function Language($http, APP_CONFIG){
	function getLanguage(key, callback) {
		$http.get(APP_CONFIG.apiRootUrl + '/langs/' + key + '.json').success(function(data){
			callback(data);
		}).error(function(){
			$log.log('Error');
			callback([]);
		});
	}

	function getLanguages(callback) {
		$http.get(APP_CONFIG.apiRootUrl + '/languages.json').success(function(data){
			callback(data);
		}).error(function(){
			$log.log('Error');
			callback([]);
		});
	}

	return {
		getLanguages: getLanguages,
		getLang: getLanguage
	}
};