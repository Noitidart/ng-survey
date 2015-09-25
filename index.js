var	ANG_APP = angular.module('surveyengine', [])
	.controller('BodyController', ['$scope', function($scope) {
		
		var MODULE = this;
		
		MODULE.survey = [ // array of objects, each object is a question, as user answers question it adds "response" field to the element
			// question is a string, which holds what to ask the user with
			// type radio/check/dropdown have options element, this is an array of strings that each option is labeled with
			// {type:'radio', options:[must have at least 1], question:''},
			// {type:'check', options:[must have at least 1], question:''},
			// {type:'dropdown', options:[must have at least 1], question:''},
			// {type:'textarea', question:''},
			// // {type:'radio', options:['radio1', 'radio2'], question:'pick one of the radio buttons as a response'},
			// // {type:'check', options:['check1', 'check2'], question:'pick multiple responses from checkboxes'},
			// // {type:'dropdown', options:['drop1', 'drop2'], question:'pick from dropdown a response'},
			// // {type:'textarea', question:'this is open ended type something'}
		];
		
		// start - survey builder code
		
		MODULE.buildTypeOptions = {
			textarea: 'Openended',
			radio: 'Radio',
			check: 'Checkbox',
			dropdown: 'Drop Down'
		};
		
		MODULE.building = {};
		
		MODULE.removeBuildOptionElement = function(aOptionKey) {
			delete MODULE.building.options[aOptionKey];
		};
		
		MODULE.buildTypeChanged = function() {
			if (MODULE.building.type != 'textarea') {
				if (!MODULE.building.options) {
					MODULE.building.options = {'0':''};
				}
			} else {
				delete MODULE.building.options;
			}
		};
		
		MODULE.addBuildOption = function() {
			MODULE.building.options[Math.random()] = '';
			// find first non blank text field and focus it
			setTimeout(function() { //0ms timeout to make this trigger at end of "thread" as the adding of the element by ng needs to happen
				var optionTextFields = document.getElementById('welcome').querySelectorAll('.build-option-entry');
				for (var i=0; i<optionTextFields.length; i++) {
					if (optionTextFields[i].value == '') {
						optionTextFields[i].focus();
						break;
					}
				}
			}, 0);
		};
		
		MODULE.shouldShowDelBuildOpt = function() {
			if (Object.keys(MODULE.building.options).length == 1) {
				return false;
			} else {
				return true;
			}
		};
		
		MODULE.addBuild = function() {
			
			if (MODULE.building.type != 'textarea') {
				var builtOptionsArr = [];
				for (var p in MODULE.building.options) {
					if (builtOptionsArr.indexOf(MODULE.building.options[p]) > -1) {
						// dont add duplicates
						continue;
					}
					builtOptionsArr.push(MODULE.building.options[p]);
				}
				MODULE.building.options = builtOptionsArr;
			}
			
			if (MODULE.building.type == 'check') {
				// work around the ng-pristine on checkbox issue for validation
				MODULE.building.response = {'0':false};
			}
			
			MODULE.survey.push(MODULE.building);
			
			MODULE.building = {};
			
			MODULE.progress_max = MODULE.survey.length;
		};
		
		// end - survey builder code
		
		// start - taking and reviewing the survey code

		
		MODULE.progress_current = -1; // holds the question/element number they are on
		MODULE.progress_max = MODULE.survey.length;
		
		for (var i=0; i<MODULE.survey.length; i++) {
			if (MODULE.survey[i].type == 'check') {
				MODULE.survey[i].response = {};
				for (var j=0; j<MODULE.survey[i].options.length; j++) {
					MODULE.survey[i].response['' + j] = false;
				}
			}
		}
		
		MODULE.getSubmitBtnText = function() {
			// purely ng-gui function
			if (MODULE.in_review) {
				return 'Return to Review & Submit'
			} else {
				if (MODULE.progress_current != MODULE.progress_max - 1) {
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
		
		MODULE.allCheckValuesFalse = function(aResponse) {
			// purely ng-gui function
			// for the reiview, to determine if should display "NONE" in review for checkboxes
			for (var a in aResponse) {
				if (aResponse[a] == true) {
					return false;
				}
			}
			return true;
		};
		
		// end - taking and reviewing the survey code
	}]);