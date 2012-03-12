/**
 * html5forms <https://github.com/jianling/html5forms>
 * Version: 0.9 (2012-03-05)
 * Author: jianling <jianling@github.com>
 * Require: jQuery 1.7.1
 * html5forms is a cross-browser implementation of the “previous” version of HTML5 forms.
 */

window.html5forms = (function(window, document){
	var version = '0.9',

		regExp = {
			telRegExp: //
			,urlRegExp: /^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/
			,emailRegExp: /^[\w!#\$%'\*\+\-\/=\?\^`{}\|~]+([.][\w!#\$%'\*\+\-\/=\?\^`{}\|~]+)*@[-a-z0-9]{1,20}[.][a-z0-9]{1,10}([.][a-z]{2})?$/
			,numberRegExp: /^\d*$/
			,colorRegExp: /^#[0-9a-fA-F]{6}/
		},

		validationMessages = {
			required: "请填写此字段"
			,tel: "请输入电话"
			,url: "请输入网址"
			,email: "请输入邮箱"
			,number: "请输入数字"
			,color: "请输入颜色值"
			,rangeOverflow: "值必须小于或等于"
			,rangeUnderflow: "值必须大于或等于"
			,stepMismatch: "值无效"
			,tooLong: "值超长，值的长度必须小于或等于"
		}
		

		_placeholderClassName= 'placeholder',

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

	    _initPlaceholderElement = function(el){

	    	//TODO 提交的时候会将placeholder值提交，所以跟高级浏览器的处理方式不能一样！！或者能够达到效果相同么
	    	//TODO 只针对老版本的ie，使用onpropertychange监听，使用attachEvent添加事件监听
	    	var el = $(el),
	    		placeholder = el.attr("placeholder");
	    	el.focus(function(){
	    		el.removeClass(_placeholderClassName);
	    	});

	    	el.blur(function(){
	    		if(!el.val){
	    			el.val(placeholder);
	    			if(!el.hasClass(_placeholderClassName)){
	    				el.addClass(_placeholderClassName);
	    			}
	    		}
	    	});
	    },

	    initPlaceholderElement = function(placeholderClassName){
	    	if("placeholder" in document.createElement("input"))
	    		return;

	    	if(placeholderClassName)
	    		_placeholderClassName = placeholderClassName;
	    	$('input[placeholder]').each(function(){
	    		_initPlaceholderElement($(this));
	    	});
	    },

	    formCheckValidity = function(){

	    },

	    inArray = function(a, item){
	    	var i = 0, len = a.length;

	    	for(; i<len; i++){
	    		if(a[i] == item)
	    			return true;
	    	}
	    	return false;
	    },

	    elementCheckValidity = function(el){
	    	var el = $(el),
	    		parttenCheckControl = "tel url email number color".split(" "),
	    		controlValue = el.val(),
		    	controlType = el.attr("type"),
		    	validity = createValidityState;

		    //TODO 如果有placeholder需要特殊处理

		    if(el.attr("required")){
		    	if(/^(radio|checkbox)$/.test(controlType)){
		    		el.validity.valueMissing = el.checked;	//TODO 挂在el的jQuery对象上不对
		    	}else{
		    		el.validity.valueMissing = (controlValue == '');
		    	}
		    }
		    el.validationMessage = validationMessages.required;
		    //valueMissing时不再做其他验证

		    return;

		    if(inArray(parttenCheckControl, controlType)){
		    	el.validity.typeMismatch = !regExp[controlType + "RegExp"].test(controlValue);
		    }

		    //patternMismatch
		    if(el.attr("pattern")){	//TODO parttern的值格式 new RegExp("^(?:" + patternAttr.value + ")$");
		    	el.validity.patternMismatch = !el.attr("pattern").test(controlValue);
		    }

		    //tooLong
		    //TODO 直接取length合理？
		    if(el.attr("maxlength")){
		    	el.validity.tooLong = (controlValue.length > parseInt(el.attr("maxlength")));	
		    }
	    	
	    	//rangeOverflow || rangeUnderflow
	    	//range控件用户无法设置不符合规则的值，所以不需要验证(??!!)
	    	if(controlType == "number"){
	    		var _value = Number(controlValue),
	    			_step = Number(el.atr("step")) || 1,
	    			_min;
	    		el.validity.rangeUnderflow = el.attr("min") && _value < Number(el.attr("min"));
	    		el.validity.rangeOverflow = el.attr("max") && _value > Number(el.attr("max"));

    			_min = el.attr("min") ? el.attr("min") : 0;
    			el.validity.stepMismatch = ((_value - _min)/_step == parseInt((_value - _min)/_step));

	    	}





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
	    	
	    	,'init': function(options){
	    		var forms = document.forms || document.getElementByTagName("form"),
	    			i = 0, len = forms.length;
	    		for(; i<len; i++){
	    			_forms[i] = forms[i];
	    			initform(forms[i]);
	    		}

	    		initAutofocusElement();
	    		initPlaceholderElement(options.placeholderClassName);
	    	}

	    	,'initform': initform
	    };
})(this, this.document);