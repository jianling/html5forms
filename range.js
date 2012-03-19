/**
 * 让低版本浏览器支持range
 * Version: 0.9
 * Author: jianling <jianling@github.com>
 * Require: jQuery 1.7.1
 */


//TODO 在handle上显示个当前值什么的

if(console == undefined){
	var console = {
		log: function(){}
	}
}

/**
 * range
 * @class
 * @name range
 * @grammar new range()
 * @param {Object} options 配置参数
 * @config {$|String|HTMLElement} input input/textarea控件
 */
function range(el){
    
    this.input = $(el);
    this.option = {
        'max': Number(this.input.attr("max")) || 100,
        'min': Number(this.input.attr("min")) || 0,
        'step': Number(this.input.attr("step")) || 1,
        'value': Number(this.input.attr("value")) || 0
    };

}

range.prototype =
/** @lends range.prototype */
{
    /**
     * range控件的模板
     */
	_rangeTmp: '<div class="range" id="J_range"><span class="range-handle"></span></div>'
	
	
	/**
	 * 创建range控件
	 */
	,create: function(){
	    var me = this,
	       range = $(me._rangeTmp),
	       input = me.input;

	    me.range_length = input.width();
	    me.range_handle = range.find(".range-handle");
	    
	    input.before(range);
	    input.hide();
	    range.width(input.width());
	    
	    me.range = range;

	    me.setValue(me.option.value);

	    me._bindUI();
	}
	
	/**
	 * 给DOM元素绑定事件，支持键盘左右键
	 */
	,_bindUI: function(){
	    var me = this,
	       range = me.range,
	       range_handle = me.range_handle;


	    range.click(function(e){
	    	var max = me.option.max,
		    	min = me.option.min,
		    	step = me.option.step;
	    		_value = me._transferCoord(e.clientX) * (max - min) / me.range_length;

	    	me.setValue(_value);

	    	me.active = true;
	    });


	    range_handle.mouseover(function(){
	    	$(this).addClass("range-handle-hover");
	    }).mouseout(function(){
	    	$(this).removeClass("range-handle-hover");
	    });

	    $(document.body).click(function(e){
	    	if(!$.contains(range[0], e.target) && e.target != range[0]){
	    		me.active = false;
	    		return;
	    	}
	    });

	    me._keyboardHandler();

	    $(window).blur(function(){
	    	me.active = false;
    		return;
	    });
	}

	/**
	 * 响应键盘事件
	 */
	,_keyboardHandler: function(){
		var me = this,
			step = me.option.step,
			timer,
			pause = false;


		$(document.body).keydown(function(e){
	    	if(!me.active || pause)	//如果range控件不处于激活状态或者处于连续移动中的暂停状态，则返回
	    		return;

	    	if(e.which != 37 && e.which != 39)	//不响应除了左右键以外的键盘按键
	    		return;

	    	timer = setTimeout(function(){
	    		pause = false;
	    	}, 100);
	    		

	    	if(!pause){
	    		e.which == 37 ? me.setValue(me.getValue() - step) : me.setValue(me.getValue() + step);
	    		pause = true;
	    	}
	    	e.preventDefault();//阻止默认事件，比如页面横向滚动等

	    }).keyup(function(e){
	    	if(e.which != 37 && e.which != 39)	//不响应除了左右键以外的键盘按键
	    		return;
	    	// e.which == 37 ? me.setValue(me.getValue() - step) : me.setValue(me.getValue() + step);
	    	pause = false;
	    	clearTimeout(timer);
	    })
	}
	
	/**
	 * 将鼠标点击的横坐标转换成在range控件上点击的横坐标
	 * @param {Number} pageX 鼠标在页面点击的横坐标
	 * @return {Number} 鼠标在range控件点击的横坐标
	 */
	,_transferCoord: function(pageX){
		return pageX - this.range.position().left - Number(ran.range.css("marginLeft").replace("px",''));
	}
	
	/**
	 * 设置range的值
	 * @param {Number} value range的值
	 */
	,setValue: function(value){
	    var me = this,
	    	max = me.option.max,
	    	min = me.option.min,
	    	step = me.option.step,
	    	left = 0,
	    	realValue = 0;

	    if(value > max || value < min){
	    	return false;
	    }

	    realValue = Math.round((value - min)/step) * step + min;

	    if(realValue > max){
	    	realValue = (Math.round((value - min)/step) - 1) * step + min;
	    }
	   	me.currentValue = realValue;

	    left = me.range_length/(me.option.max - me.option.min) * realValue;

	    me.range_handle.css("left",  left+ "px");

	    me.input.val(realValue);

	    //TODO 触发自定义事件
	    $(me).trigger("valueUpdate", realValue);
	}
	
	/**
	 * 获取range的值
	 */
	,getValue: function(){
	    return this.currentValue;
	}
}