"use strict";

angular
	.module('app')
	.factory('Language', Language);

function Language($http){
	function getLanguage(key, callback) {
		$http.get('/api/langs/' + key + '.json').success(function(data){
			callback(data);
		}).error(function(){
			$log.log('Error');
			callback([]);
		});
	}

	function getLanguages(callback) {
		$http.get('/api/languages.json').success(function(data){
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