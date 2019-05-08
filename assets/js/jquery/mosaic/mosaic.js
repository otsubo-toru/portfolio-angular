/*
	Mosaic - Sliding Boxes and Captions jQuery Plugin
	Version 1.0.1
	www.buildinternet.com/project/mosaic
	
	By Sam Dunn / One Mighty Roar (www.onemightyroar.com)
	Released under MIT License / GPL License
*/

//����js�t�@�C���͏�L�̌��{���獡��̎g�p�ړI�ɕs�v�ȕ������폜���Ă���y�ʔłł��i�K�v������q�؂��Ă��ď������������Ƃ������j

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

	//�ȉ��n�C�X���C�h�Ή��p�ǋL����
	$(function(){
			$("a.highslide.mosaic").each(function(){
				var wid = $(this).width();
				$(this).wrap("<div class='mosaic-block' style='width:" + wid + "px;'></div>")
				$(this).after($(this).contents()).each(function(){
					$(this).append("&nbsp;"); //���̍s���u$(this).append($(this).next().attr("alt"));�v�ɂ���Ɖ摜��alt��<a>�̓��e�ɂȂ�܂��i����f�o����錋�ʂł͓��e�́u&nbsp;�v�ł��j
				});
		});
	});
    //�ǋL�I���
	
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

