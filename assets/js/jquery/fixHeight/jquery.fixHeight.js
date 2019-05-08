/*============================================================*/
//
// jquery.fixHeight.js
// 
// 作成日：2015/12/04
// 作成者：大坪 亨
//
/*============================================================*/

$(function() {
	$(".fix-height").fixHeight();
	$("div,ul,li").on("loadLC putHtml",function() {
		$(".fix-height",this).fixHeight();
	});
});
$(window).on("load", function() {
	$(".fix-height").fixHeight();
});


(function($){
	$.fn.extend({
		fixHeight : function(options){
			//オプション設定（デフォルト値を予め入れておく）
			var options = $.extend({
				//スマホ表示に変わるポイント。多分いじらない。
				maxWidth : 480,
				column : 0,
				fhTarget : ""
			}, options);
			
			return this.each(function () {
				var fh = new FixHeight();
				if($.type(options[0]) && options[0]=="destroy") {
					fh.destroy();
				} else if($.type(options[0]) && options[0]=="refresh") {
					fh.refresh();
				} else {
					fh.elem = this;
					fh.maxWidth = options.maxWidth;
					fh.fontSizeCheck = options.fontSizeCheck;
					fh.column = options.column;
					fh.fhTarget = options.fhTarget;
					fh.setOptions();
					if(fh.fhTarget=="") {
						fh.target = $(this).children().not(".no-fh-target");
					} else {
						fh.target = $(this).find(fh.fhTarget).not(".no-fh-target");
					}
					fh.init();
				}
			});
		}
	});
})(jQuery);



var FixHeight = function(){
	this.elem;
	this.target;
	this.maxWidth;
	this.column;
	this.spColumn;
	this.fhTarget;
	this.tmpColumn;
	//setTimeout用タイマー。トランジション解除に使用。
	this.timer;
}


FixHeight.prototype = {
	init : function(){
		var self = this;
		self.execute();
		$(this.elem).on("destroyFH",function(){
			self.destroy();
		}).on("refreshFH",function(){
			self.refresh();
		});
		// spSwitch.js：イベント「switchPC」「switchSP」「resizeSP」
		$(window).on("switchPC switchSP", function(evt) {
			//alert(evt.type);
			self.execute();
		});
	},
	execute : function() {
		var self = this;
		var delay = window.isSP ? 100 : 0;
		var maxHeight = 0;
		var cnt = 0;
		var func = setInterval(function() {
			//-----------------------------------------------------------------------------
			// ターゲット内の画像が読み込み完了になるまでは、0.1秒毎に読み込み判定を行う。
			// 5分以上たっても画像読み込み完了しなければ、下のスクリプトを実行。
			//-----------------------------------------------------------------------------
			var flag = true;
			$("img",self.target).each(function() { if(!this.complete){ flag=false; } });
			if(!flag && cnt<5000) {
				cnt++;
				return;
			}
			
			//-----------------------------------------------------------------------------
			// ターゲット内の画像が読み込み完了になったら、処理開始
			//-----------------------------------------------------------------------------
			if(self.timer) { clearTimeout(self.timer); }
			$(self.target).add($("img",self.target)).css("transition","height 0s linear").css("height","");
			// FixHeight.tmpColumnの値を設定
			self.setTmpColumn();
			// デフォルト。カラムの設定がない場合
			if(!self.tmpColumn || self.tmpColumn==0 || self.tmpColumn=="") {
				$(self.target).each(function(idx){
					if($(this).outerHeight()>maxHeight){
						maxHeight = $(this).outerHeight();
					}
				}).each(function(){
					var height = maxHeight - parseInt($(this).css("padding-top")) - parseInt($(this).css("padding-bottom"));
					$(this).height(height);
				});
			//カラムの設定がある場合、コラム数毎にリセットする
			} else {
				var maxHeightArr = [];
				var targetLength = $(self.target).length;
				$(self.target).each(function(idx,target){
					if((idx!=0 && idx%self.tmpColumn==0)) {
						maxHeightArr.push(maxHeight);
						maxHeight = 0;
					}
					if($(this).outerHeight()>maxHeight){
						maxHeight = $(this).outerHeight();
					}
					if(idx==targetLength-1) {
						maxHeightArr.push(maxHeight);
						maxHeight = 0;
					}
				}).each(function(idx){
					var height = maxHeightArr[Math.floor(idx/self.tmpColumn)] - parseInt($(this).css("padding-top")) - parseInt($(this).css("padding-bottom")) - 1;
					$(this).height(height);
				});
			}
			//「window.isSP」：「spSwitch」読み込み時、デバイスがスマホじゃない
			if((!window.isSP && $.fn.spSwitch) || (!$.fn.spSwitch)) {
				this.timer = setTimeout(function() {
					$(self.target).add($("img",self.target)).css("transition","");
				},1000);
			}
			clearInterval(func);
		},delay);
	},
	destroy : function(){
		$(this.target).css("transition","height 0s linear").css("height","");
	},
	refresh : function(){
		this.destroy();
		this.execute();
	},
	setTmpColumn : function() {
		if(window.responsiveMode=="SP") {
			if(this.column==4) {
				this.tmpColumn = 2;
			} else {
				this.tmpColumn = this.column;
			}
			if(this.spColumn) {
				this.tmpColumn = this.spColumn;
			}
		} else {
			this.tmpColumn = this.column;
		}
	},
	setOptions : function() {
		// 「.fix-height」に「md-column-◯◯」があれば「options.column : ◯◯」にする。
		var column = this.pickupWords($(this.elem),"md-column-");
		if($(this.elem).hasClass("fix-height") && column.length!=0) {
			if(column.length==1) {
				this.column = Number(column[0]);
			}
		}
		// 「.fix-height」に「md-sp-column-◯◯」があれば「options.column : ◯◯」にする。
		var spColumn = this.pickupWords($(this.elem),"md-sp-column-");
		if($(this.elem).hasClass("fix-height") && spColumn.length!=0) {
			if(spColumn.length==1) {
				this.spColumn = Number(spColumn[0]);
			}
		}
		// 「.fix-height」に「md-target-◯◯」があれば「options.fhTarget : ◯◯」にする。
		var target = this.pickupWords($(this.elem),"md-target-");
		if($(this.elem).hasClass("fix-height") && target.length!=0) {
			if(target.length==1) {
				this.fhTarget = "."+target[0];
			}
		}
	},
	pickupWords : function(elem,key) {
		var arr = $(elem).attr("class").split(" ");
		var words = [];
		for(var i in arr) {
			if(arr[i].indexOf(key) >= 0) {
				words.push(arr[i].replace(key,""));
			}
		}
		return words;
	}
}

