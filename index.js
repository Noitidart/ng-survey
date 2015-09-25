var	ANG_APP = angular.module('surveyengine', [])
	.controller('BodyController', ['$scope', function($scope) {
		
		var MODULE = this;
		
		MODULE.survey = [ // array of objects, each object is a question, as user answers question it adds "response" field to the element
			// question is a string, which holds what to ask the user with
			// type radio/check/dropdown have options element, this is an array of strings that each option is labeled with
			// {type:'radio', options:[], question:''},
			// {type:'check', options:[], question:''},
			// {type:'dropdown', options:[], question:''},
			// {type:'textarea', question:''},
			{type:'radio', options:['radio1', 'radio2'], question:'pick one of the radio buttons as a response'},
			{type:'check', options:['check1', 'check2'], question:'pick multiple responses from checkboxes'},
			{type:'dropdown', options:['drop1', 'drop2'], question:'pick from dropdown a response'},
			{type:'textarea', question:'this is open ended type something'}
		];
		
		MODULE.progress_current = -1; // holds the question/element number they are on
		MODULE.progress_max = MODULE.survey.length;
		
		MODULE.getSubmitBtnText = function() {
			if (MODULE.in_review) {
				return 'Return to Review & Submit'
			} else {
				if (MODULE.progress_current != MODULE.progress_max) {
					return 'Next Question';
				} else {
					return 'Last Question - Review & Submit';
				}
			}
		};
		
		MODULE.next = function() {
			// this is the submit function
			if (MODULE.in_review) {
				MODULE.showReview();
			} else {
				if (MODULE.progress_current < MODULE.progress_max - 1) {
					MODULE.progress_current++;
				} else {
					MODULE.in_review = true; // this marks that the user has finished the survey
					MODULE.showReview();
				}
			}
		};

		MODULE.previous = function() {
			if (MODULE.progress_current > 0) {
				MODULE.progress_current--;
			}
		};
		
		MODULE.showReview = function() {
			MODULE.progress_current = MODULE.progress_max;
		};
		
		MODULE.reviewQuestion = function(questionNumber) {
			// questionNumber is question number minus 1, so in the survey array position
			MODULE.progress_current = questionNumber;
		};
	}]);