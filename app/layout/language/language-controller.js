"use strict";

angular
	.module('app')
	.controller("LanguagesCtrl", LanguagesCtrl);

function LanguagesCtrl($scope, $rootScope, $log, Language){
	$rootScope.lang = {};

	Language.getLanguages(function(data){
		$rootScope.languages = data;
		$rootScope.currentLanguage = data[0];

		Language.getLang(data[0].key, function(data){
			$rootScope.lang = data;
		});
	});

	$scope.selectLanguage = function(language){
		$rootScope.currentLanguage = language;

		Language.getLang(language.key,function(data){
			$rootScope.lang = data;
		});
	};

	$rootScope.getWord = function(key){
		if(angular.isDefined($rootScope.lang[key])){
			return $rootScope.lang[key];
		}
		else {
			return key;
		}
	};
};