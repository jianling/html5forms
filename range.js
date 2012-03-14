/**
 * 让低版本浏览器支持range
 * Version: 0.9
 * Author: jianling <jianling@github.com>
 * Require: jQuery 1.7.1
 */


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
    }
}

range.prototype =
/** @lends range.prototype */
{
    /**
     * range控件的模板
     */
	_rangeTmp: '<div class="range"><span class="range-handle"></span></div>'
	
	
	/**
	 * 创建range控件
	 */
	,create: function(){
	    var me = this,
	       range = $(me._rangeTmp),
	       input = me.input;
	    
	    input.before(range);
	    input.hide();
	    range.width(input.width());
	    
	    me.range = range;

	    me.setValue();

	    me._bindUI();
	}
	
	/**
	 * 给DOM元素绑定事件，支持键盘左右键
	 */
	,_bindUI: function(){
	    var me = this,
	       range = me.range,
	       range_handle = range.find(".range-handle");

	    range.click(me._rangeClickHandle);


	    range_handle.mouseover(function(){
	    	$(this).addClass("range-handle-hover");
	    }).mouseout(function(){
	    	$(this).removeClass("range-handle-hover");
	    });

	}
	
	/**
	 * 响应在控件上的点击事件
	 */
	,_rangeClickHandle: function(e){
	    range_handle.css("left", me._transferCoord(e.clientX) + "px");
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
	    
	    
	    this.input.val(value);
	}
	
	/**
	 * 获取range的值
	 */
	,getValue: function(){
	    
	}
}