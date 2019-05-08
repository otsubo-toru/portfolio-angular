(function($){
	$.fn.extend({
		loadComponents : function(options){
			//オプション設定（デフォルト値を予め入れておく）
			var options = $.extend({
				fileUrl : "",
				replacements : {},
				loadOnly : false,
				append : false
			}, options);
			
			return this.each(function () {
				var lc = new LoadComponents();
				lc.elem = this;
				lc.fileUrl = options.fileUrl;
				lc.replacements = options.replacements;
				lc.loadOnly = options.loadOnly;
				lc.append = options.append;
				$(lc.elem).data("loadComponents",lc);
				lc.init();
			});
		}
	});
})(jQuery);




var LoadComponents = function() {
	this.elem;
	this.fileUrl;
	this.replacements;
	this.loadOnly;
	this.htmlTxt = "";
};

LoadComponents.prototype = {
	init : function() {
		if(this.fileUrl=="") {return;}
		var self = this;
		$.ajax({
			url : self.fileUrl,
			cache : true,
			dataType : "html",
			beforeSend : function(htmlTxt,status,xhr){
				//self.onLoad(htmlTxt,status,xhr);
			},
			error : function(e){
				//self.onError(e);
				$(self.elem).triggerHandler("errorLC");
				//console.log("[loadComponents Loading Error]");
				//console.log("file : "+self.fileUrl);
				//console.log(e);
			},
			success : function(htmlTxt,status,xhr){
				htmlTxt = self.replaceWords(htmlTxt);
				self.htmlTxt = htmlTxt;
				if(!self.loadOnly) {
					if(!self.append) {
						$(self.elem).html(htmlTxt);
					} else {
						$(self.elem).append(htmlTxt);
					}
					$(self.elem).triggerHandler("readyLC");
				} else {
					$(self.elem).triggerHandler("loadOnlyLC");
				}
			}
		});
	},
	//「{{◯◯◯}}」で囲った部分の文字列を
	//「replacements」で指定した文字列に置換する
	// ※現時点では、入れ子は不可
	replaceWords : function(htmlTxt) {
		var self = this;
		var keys = htmlTxt.match(/{{*(.*?)}}*/g);
		var hasReplacements = Object.keys(self.replacements).length;
		$(keys).each(function() {
			var key = this.replace(/{{|}}/g,"");
			var txt = self.replacements[key];
			var isVar = false;
			// keyが「$」で始まっている時は、デフォルトの文字列を表示しない
			if(key.slice(0,1)=="$") {
				isVar = true;
			}
			//置換設定がある時
			if(hasReplacements){
				if(txt) {
					htmlTxt = htmlTxt.replace(this, txt);
				} else {
					htmlTxt = htmlTxt.replace(this, isVar?"":key);
				}
			//置換設定がない時
			} else {
				htmlTxt = htmlTxt.replace(this, isVar?"":key);
			}
		});
		return htmlTxt;
	}
};





/*============================================*/
// IE用
// Object.keysがない場合の対処
/*============================================*/

if(!Object.keys) {
	Object.keys = function(obj) {
		var keys = [];
		for(var i in obj) {
			if(obj.hasOwnProperty(i)) { keys.push(i); }
		}
		return keys;
	};
}


