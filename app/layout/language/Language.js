"use strict";

angular
	.module('app')
	.factory('Language', Language);

function Language($http, $log){
	return {
		getLanguages: getLanguages,
		getLang: getLanguage
	}

	function getLanguage(key, callback) {
		$http.get('/langs/' + key + '.json').success(function(data){
			callback(data);
		}).error(function(){
			$log.log('Error');
			callback([]);
		});
	}

	function getLanguages(callback) {
		$http.get('/langs/languages.json').success(function(data){
			callback(data);
		}).error(function(){
			$log.log('Error');
			callback([]);
		});
	}

};