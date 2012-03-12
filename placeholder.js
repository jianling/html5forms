/**
 * 让低版本浏览器支持placeholder
 * Version: 0.9
 * Author: jianling <jianling@github.com>
 * Require: jQuery 1.7.1
 */



if(console == undefined){
	var console = {
		log: function(){}
	}
}


function placeholder(option){
	if("placeholder" in document.createElement("input"))
		return;

	if(placeholder.typeModifySupport == undefined){
		placeholder.typeModifySupport = this._testTypeModifySupport()
	}
	this.typeModifySupport = placeholder.typeModifySupport;

	this.input = $(option.input);
	this.placeholderClass = option.classname || "placeholder";

	if(this.input.attr("type") == "password" && !this.typeModifySupport){
		this._createPasswordPlaceholderFix();

		$(this.input[0].form).submit(function(){
			me.passwordFix.remove();
			this.input.show();
		});
	}

	this.initPlaceholder();
}

placeholder.prototype = {

	initPlaceholder: function(){
		var me = this,
			input = this.input;

		//Attention:IE在onload时会将浏览器记忆的值填入input控件中；如果在onload之前设置input的值，在onload后仍然会被设置成浏览器记忆的值
		if($.browser.msie){
			$().ready(function(){
				console.log(input.val());
				(input.val() == '' || input.val() == input.attr("placeholder")) && me.show();
			});
		}else{
			(input.val() == '') && me.show();
		}

		input.blur(function(){
			input.val() == '' && me.show();
		});

		input.focus(function(){
			me.valueIsPlaceholder() && me.hide();

			if($.browser.msie && input.attr("type") == "password"){
				if(input.val() ==""){
					// var range = input[0].createTextRange();
                    // range.collapse(true);
                    // range.moveStart('character', 0);
                    // range.select();

	                //解决IE里面光标丢失的问题
	                setTimeout(function(){
	                	input[0].focus();
	                }, 10);
				}
			}
		});

	}

	,show: function(){
		var me = this,
			input = me.input;

		if(input.attr("type") == "password"){
			try{
				input[0].type = "text";
			}catch(e){
				if(me.passwordFix){
					me.input.hide();
					me.input.before(me.passwordFix);
					me.passwordFix.show();
				}
			}
		}
		input.val(input.attr("placeholder"));
		input.addClass(me.placeholderClass);
	}

	,hide: function(){
		var me = this,
			input = me.input;

		if(input.attr("password")){
			try{
				input[0].type = "password";
			}catch(e){}
		}
		input.val("");
		input.removeClass(me.placeholderClass);
	}

	,valueIsPlaceholder: function(){
		var input = this.input;
		return input.val() == input.attr("placeholder") && input.hasClass(this.placeholderClass);
	}

	,_testTypeModifySupport: function(){

		//Chrome、Firefox、IE9都能通过改变type将密码输入框变成普通输入框，而IE8、IE7虽然可以通过setAttribute重设type，但是修改后表象仍然是password型，IE6完全无法改变type的值。

		var input = document.createElement("input"),
			type = "password";
		input.type = type;
		document.body.appendChild(input);
		try{
			input.type = "text";
		}catch(e){}
		type = input.type;
		document.body.removeChild(input);

		console.log("typeModifySupport:" + (type == "text"));
		return type == "text";	// Chrome、Firefox、IE9 returns true, else false.
	}

	,_createPasswordPlaceholderFix: function(){
		var me = this,
			input = me.input,
			html;
		if($.browser.msie && input[0].outerHTML){
			html = $(input[0].outerHTML.replace(/type=(['"])?password\1/gi, "type=$1text$1"));
			html.addClass(me.placeholderClass);
			html.val(input.attr("placeholder"));
			html.attr("id", "");	//去掉可能存在的id
			html.focus(function(){
				html.hide();
				input.trigger("focus");
				input.show();
			});
		}
		me.passwordFix = html;
	}


};