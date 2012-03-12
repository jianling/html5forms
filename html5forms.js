/**
 * html5forms <https://github.com/jianling/html5forms>
 * Version: 0.9 (2012-03-05)
 * Author: jianling <jianling@github.com>
 * 
 * html5forms is a cross-browser implementation of the “previous” version of HTML5 forms.
 */

window.html5forms = (function(window, document){
	var version = '0.9',

		telRegExp: //,
		urlRegExp: /^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/,
		emailRegExp: /^[\w!#\$%'\*\+\-\/=\?\^`{}\|~]+([.][\w!#\$%'\*\+\-\/=\?\^`{}\|~]+)*@[-a-z0-9]{1,20}[.][a-z0-9]{1,10}([.][a-z]{2})?$/,
		numberRegExp: /^\d*$/,
		colorRegExp: /^#[0-9a-fA-F]{6}/,

		_forms = [],

		createValidityState = function(){
	        return {
	            typeMismatch    : false,
	            rangeUnderflow  : false,
	            rangeOverflow   : false,
	            stepMismatch    : false,
	            tooLong         : false,
	            patternMismatch : false,
	            valueMissing    : false,
	            customError     : false,
	            valid           : true
	        };
	    },

	    initAutofocusElement = function(){

	    },

	    initPlaceholderElement = function(){

	    },

	    formCheckValidity = function(){

	    },

	    elementCheckValidity = function(){

	    },

	    _initform = function(el){
	    	_forms.push(el);
	    	_forms[_forms.length].initialized = true;
	    },

	    initform = function(el){
	    	var i = 0, len = forms.length;

	    	for(; i<len; i++){
	    		if(_forms[i] == el && _forms[i].initialized)
	    			return;
	    	}

	    	_initform(el);
	    };

	    return {
	    	'version': version
	    	
	    	,'init': function(){
	    		var forms = document.forms || document.getElementByTagName("form"),
	    			i = 0, len = forms.length;
	    		for(; i<len; i++){
	    			_forms[i] = forms[i];
	    			initform(forms[i]);
	    		}
	    	}

	    	,'initform': initform
	    };
})(this, this.document);