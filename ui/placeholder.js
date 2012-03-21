/**
 * 让低版本浏览器支持placeholder
 * Version: 0.9
 * Author: jianling <jianling@github.com>
 * Require: jQuery 1.7.1
 */


/**
 * placeholder类
 * @class
 * @name placeholder
 * @grammar new placeholder()
 * @param {Object} options 配置参数
 * @config {$|String|HTMLElement} input input/textarea控件
 * @config {String} placeholderClass 显示placeholder时，控件的class名
 * @config {String} passFixClass 模拟password控件placeholder效果的input的class名，用于设置样式，以保证它跟password控件的样式一样
 */

function placeholder(options){
	if("placeholder" in document.createElement("input"))
		return;

	if(placeholder.typeModifySupport == undefined){
		placeholder.typeModifySupport = this._testTypeModifySupport()
	}
	this.typeModifySupport = placeholder.typeModifySupport;

	this.input = $(options.input);
	this.placeholderClass = options.placeholderClass || "placeholder";
	this.passFixClass = options.passFixClass;

	this.initPlaceholder();
	
}

placeholder.prototype = 
/** @lends placeholder.prototype */
{
    
    /**
     * 初始化placeholder
     */
	initPlaceholder: function(){
		var me = this,
			input = this.input;

		//Attention:IE在onload时会将浏览器记忆的值填入input控件中；如果在onload之前设置input的值，在onload后仍然会被设置成浏览器记忆的值
		if($.browser.msie){
			$().ready(function(){
				(input.val() == '') && me.show();
			});
		}else{
			(input.val() == '') && me.show();
		}
		
		//创建模拟password控件placeholder效果的input
		if(this.input.attr("type") == "password" && !this.typeModifySupport){
            var me = this;
            me._createPasswordPlaceholderFix();
    
            $(me.input[0].form).submit(function(){
                me.passwordFix.remove();
                me.input.show();
            });
        }

		input.blur(function(){
			input.val() == '' && me.show();
		});

		input.focus(function(){
			me.valueIsPlaceholder() && me.hide();

			if(!this.typeModifySupport && input.attr("type") == "password"){
				if(input.val() ==""){
	                //解决IE里面光标丢失的问题
	                setTimeout(function(){
	                	input[0].focus();
	                }, 10);
				}
			}
		});
        
        //提交表单时，清除控件中的placeholder值
        $(input[0].form).submit(function(){
            if(me.valueIsPlaceholder()){
                input.val("");
            }
        });
        
	}
    
    /**
     * 显示placeholder
     */
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
    
    /**
     * 隐藏placeholder
     */
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
    
    /**
     * 判断控件中的值是否是placeholder
     */
	,valueIsPlaceholder: function(){
		var input = this.input;
		return input.val() == input.attr("placeholder") && input.hasClass(this.placeholderClass);
	}
    
    /**
     * 测试浏览器是否支持修改控件的type
     */
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

		return type == "text";	// Chrome、Firefox、IE9 returns true, else false.
	}
    
    /**
     * 创建一个input用来模拟password控件的placeholder
     */
	,_createPasswordPlaceholderFix: function(){
		var me = this,
			input = me.input,
			html;

		if(input[0].outerHTML){
			html = $(input[0].outerHTML.replace(/type=(['"])?password\1/gi, "type=$1text$1"));
		}else{
		    html = $('<input type="text" />');
		    
		    //复制class和style，以保证样式一致
		    html.attr("class", input.attr("class"));
		    html.attr("style", input.attr("style"));
		}
			html.addClass(me.placeholderClass);
			me.passFixClass && html.addClass(me.passFixClass);
			
			html.val(input.attr("placeholder"));
			html.attr("id", "");	//去掉可能存在的id
			html.focus(function(){
				html.hide();
				input.trigger("focus");
				input.show();
			});
		me.passwordFix = html;
	}


};