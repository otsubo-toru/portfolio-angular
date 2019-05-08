/*
	Mosaic - Sliding Boxes and Captions jQuery Plugin
	Version 1.0.1
	www.buildinternet.com/project/mosaic
	
	By Sam Dunn / One Mighty Roar (www.onemightyroar.com)
	Released under MIT License / GPL License
*/

//このjsファイルは上記の原本から今回の使用目的に不要な部分を削除してある軽量版です（必要部分を拝借してきて少し改造したとも言う）

(function($){

    if(!$.omr){
        $.omr = new Object();
    };
    
    $.omr.mosaic = function(el, options){
    
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
        base.$el.data("omr.mosaic", base);
        
        $(function(){
            base.options = $.extend({},$.omr.mosaic.defaultOptions, options);
            
            $(base.options.backdrop, base.el).show();
				$(base.options.overlay , base.el).show();
				$(base.el).hover(function () {
			        	$(base.options.overlay, base.el).stop().fadeTo(base.options.speed, base.options.opacity);
			        },function () {
			        	$(base.options.overlay, base.el).stop().fadeTo(base.options.speed, 0.5);
			      	});
        });

    };

	//以下ハイスライド対応用追記部分
	$(function(){
			$("a.highslide.mosaic").each(function(){
				var wid = $(this).width();
				$(this).wrap("<div class='mosaic-block' style='width:" + wid + "px;'></div>")
				$(this).after($(this).contents()).each(function(){
					$(this).append("&nbsp;"); //この行を「$(this).append($(this).next().attr("alt"));」にすると画像のaltが<a>の内容になります（現状吐出される結果では内容は「&nbsp;」です）
				});
		});
	});
    //追記終わり
	
    $.omr.mosaic.defaultOptions = {
        speed		: 150,
        opacity		: 0.5,
        preload		: 0,
        overlay  	: '.highslide',	//Mosaic overlay
    };
    
    $.fn.mosaic = function(options){
        return this.each(function(){
            (new $.omr.mosaic(this, options));
        });
    };
    
})(jQuery);

//add

jQuery(function($){$('.mosaic-block').mosaic({opacity:0.8});});

