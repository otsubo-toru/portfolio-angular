/* スマホページ用詰め合わせ */



$(function() {
	var initSpScrollX = function(evt) {
		var spScrollX = $(".table.md-sp-scrollx",evt.target);
		$(spScrollX).each(function() {
			if($(this).data("tableTransformMode")) { return; }
			if(window.responsiveMode=="SP") {
				$(this).spTableTransform();
			}
			$(window).on("switchPC switchSP",function(evt) {
				$(this).spTableTransform();
			});
		});
	};
	var initScrollX = function(evt) {
		var scrollX = $(".table.md-scrollx",evt.target);
		$(scrollX).each(function() {
			if($(this).data("tableTransformMode")) { return; }
			if(window.responsiveMode=="SP") {
				$(this).spTableTransform();
			} else if(window.responsiveMode=="PC") {
				$(this).spTableTransform();
			}
		});
	};

	$("div,ul,li").on("loadLC putHtml",function(evt) {
		initSpScrollX(evt);
		initScrollX(evt);
	});
	$(window).on("load",function(evt) {
		initSpScrollX(evt);
		initScrollX(evt);
	});
});




/*-------------------------------------------------------------------------------
// 【スマホ-PC表示切り替え関係】
//
// jQueryのプラグイン「jquery.cookie.js」で、PC用かスマホ用かの情報を記録し、
// それを読み込んで表示を切り替える
// ※初回訪問時などcookieが空の場合はスマホ用CSSを読み込むが、
// 「media='(max-width: 480px)'」で画面サイズ480pxをしきい値に
// CSSの有効/無効が変わるため、画面480px以上ならPC用、480px未満ならスマホ用サイトになる
-------------------------------------------------------------------------------*/
(function($){
	$.fn.extend({
		spSwitch : function(options){
			var self=this;

			//オプション設定（デフォルト値を予め入れておく）
			var options = $.extend({
				//デフォルトで読み込みたいSP用CSSのURLを配列で設定
				defaultCssFiles : ["/css/sp_common.css"],
				//読み込みたいSP用CSSのURLを配列で設定
				cssFiles : ["/css/sp_common.css"],

				//スマホ用ヘッダーHTMLのファイルURL
//				headerFile : "/js/jquery/spSwitch/sp_header.txt",//y02
				headerFile : "",//y02

				//スマホ表示に変わるポイント。いじらない。
				maxWidth : 480
			}, options);

			return this.each(function() {
				if(!$(document).data("responsive") && !$(window).data("responsive")) {
					console.log(window);

					var responsive = new Responsive();
					responsive.elem = self;
					responsive.defaultCssFiles = options.defaultCssFiles;
					responsive.cssFiles = options.cssFiles;
					responsive.headerFile = options.headerFile;
					responsive.maxWidth = options.maxWidth;

					//ビューポイントの書き込み（スマホ用に縮小禁止を入れている）
					responsive.setViewport();

					// スマホ用CSSの読み込み
					responsive.setCSS();

					//スマホ時TOP（緑のロゴ入り画像）のメニュー展開
					//新ヘッダー化統一に伴い、PCとSPで同一のヘッダーを使うため不要に。//y02
//					responsive.setHeader();//y02

					// UAと画面幅からPC＞スマホに戻るボタン表示
					responsive.setSPBtn();

					// 切替時にイベントが発生するようにする
					/*------------------------------------------------------*/
					// readySP：SPモードで読み込まれた時
					// readyPC：PCモードで読み込まれた時
					// resizeSP：SPモードでリサイズしている間
					// resizePC：PCモードでリサイズしている間
					// switchSP：SPモードに切り替わった時（リサイズ時）
					// switchPC：PCモードに切り替わった時（リサイズ時）
					// switchResponsive：SPモード・PCモードが切り替わった時
					//【現在の表示モードを調べたい時】
					// window.responsiveMode："SP" or "PC"
					//【デバイスがスマホかどうか】
					// window.isSP：true or false
					/*------------------------------------------------------*/
					responsive.triggerEvent();
					$(self).data("responsive",responsive);
				} else {
					var responsive = $(window).data("responsive") ? $(window).data("responsive") : $(document).data("responsive");
					responsive.defaultCssFiles = options.defaultCssFiles;
					responsive.cssFiles = options.cssFiles;
					// スマホ用CSSの読み込み
					responsive.setCSS();
				}
			});
		},
		spTableTransform : function(options) {
			//オプション設定（デフォルト値を予め入れておく）
			var options = $.extend({

			}, options);

			return this.each(function() {
				if(!$(this).is("table")) { return; }
				var targetTable = this;
				var table = $(this).clone().insertAfter(this);
				var htmlPC = $(this).html();
				var htmlSP = "";
				$(targetTable).html("").append($("caption",table)).append("<thead>","<tbody>");

				$("tr",table).each(function(idx) {
					var tr = this;
					if(idx==0) {
						$("th,td",this).each(function(idx) {
							if(idx==0) {
								$("thead",targetTable).append("<tr>");
							} else {
								$("tbody",targetTable).append("<tr>");
							}
						});
					}
					$("th,td",this).each(function(idx) {
						$("tr",targetTable).eq(idx).append($(this));
					});
				});
				if($(targetTable).hasClass("table-hover") && $.fn.tableHover) {
					$(targetTable).tableHover({
						colClass: "hover",
						cellClass: "hovercell",
						clickClass: "click"
					});
				}
				$(table).remove();
				htmlSP = $(targetTable).html();
				// テーブルの高さを揃える
				var maxHeightArr = [];
				$("thead th, thead td",targetTable).each(function(idx) {
					maxHeightArr.push($(this).height());
				});
				$("tbody tr",targetTable).each(function() {
					$("th,td",this).each(function(idx) {
						if($(this).height()>maxHeightArr[idx]) {
							maxHeightArr[idx] = $(this).height();
						}
					});
				}).each(function() {
					$("th,td",this).each(function(idx) {
						$(this).height(maxHeightArr[idx]);
					});
				});
				$("thead th, thead td",targetTable).each(function(idx) {
					$(this).height(maxHeightArr[idx]);
				});
				maxHeightArr=[];
				$(this).data("tableTransformMode",window.responsiveMode);
			});
		}
	});
})(jQuery);





/*----------------------------------------------------------------*/
/* Responsiveオブジェクト                                         */
/*----------------------------------------------------------------*/

var Responsive = function(){
	this.elem;
	this.headerFile = "";
	//ビューポート設定
	this.viewport = "<meta name='viewport' content='width=device-width, initial-scale=1'>";
	this.defaultCssFiles = [];
	this.cssFiles = [];
	this.loadedCssFiles = [];
	this.maxWidth = 0;
	//スマホかどうかの判定
	this.isSP = (navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0 || navigator.userAgent.indexOf('Android') > 0;
};


Responsive.prototype = {
	/* ビューポイントの書き込み（スマホ用に縮小禁止を入れている）
	----------------------------------------------------------- */
	setViewport : function() {
		$("head").append(
			// PCモードなら
			($.cookie("switchScreen") == 1) ? "" : this.viewport
		);
	},
	/* スマホ用CSSの読み込み
	----------------------------------------------------------- */
	setCSS : function() {
		var self = this;
		var cssFiles = this.setCssFiles();
		var spCSS = "";
		// PCモードでなければ
		if($.cookie("switchScreen") != 1) {
			for(var i=0; i<cssFiles.length; i++) {
				spCSS = "<link rel='stylesheet' type='text/css' media='(max-width: "+this.maxWidth+"px)' href='"+cssFiles[i]+"'>";
				$("head").append(spCSS);
				self.loadedCssFiles.push(cssFiles[i]);
			}
		}
	},
	setCssFiles : function() {
		var self = this;
		var cssFiles = self.defaultCssFiles;
		$(this.cssFiles).each(function() {
			//「Responsive.cssFiles」の中で
			//「defaultCssFiles」と重複していないものだけを読み込む
			if($.inArray($.trim(this), cssFiles)<0) {
				cssFiles.push(this);
			}
		})
		//spSwitchが2回以上呼びだされた時の処理
		//すでに読み込んでいるCSSファイルを重複で読み込まないように調整
		if($(self.elem).data("responsive")) {
			$(self.loadedCssFiles).each(function() {
				var a = $.inArray($.trim(this), cssFiles);
				if(a>=0) { cssFiles.splice(a,1); }
			});
		}
		//console.log(cssFiles);
		return cssFiles;
	},
	/* UAと画面幅からPC＞スマホに戻るボタン表示CSSの
	----------------------------------------------------------- */


	//y02 新しい切り替えボタン表示に変更（場所・ソース変更）
	setSPBtn : function() {
		// PCモード切替ボタン
		//y02 新ヘッダー後に変更
		$("#HEADER_NEW")
			.after('<div class="switch_btn"><div class="btnSP"><i class="icon-mobile-1"></i>スマホ版サイトに表示を切り替え</div></div>')
			.after('<div id="pc_switch"><div class="btnPC"><p class="t_center t_u"><i class="icon-desktop"></i>&nbsp;PC版サイトに表示を切り替え</p></div></div>');
		$('#pc_switch').css("display","none");
		$(".switch_btn").css("display","none");
		// cookie処理
		$(".btnPC, .btnSP").click(function() {
			// クッキーにディスプレイモードを設定
			// PC：1　SP：0
			$.cookie("switchScreen", ($(this).attr("class") == "btnPC") ? 1 : 0);
			location.reload();
			return false;
		});
		//y02

		if (this.isSP) {
			if(!window.matchMedia("(max-width: "+this.maxWidth+"px)").matches) {
				if($.cookie("switchScreen")==1){
					$(".switch_btn").css("display","block");
				}
			}else{//y02
				$('#pc_switch').css("display","block");//y02
			}
		}
	},

	triggerEvent : function() {
		var self = this;
		var flag = false;
		//「デバイスがスマートフォンかどうか」window.isSPに登録
		window.isSP = this.isSP;
		$(window).on("ready resize", function(evt) {
			var q;
			var cnt=0;
			var func;
			if(window.matchMedia) {
				q = window.matchMedia("(max-width: "+self.maxWidth+"px)").matches;
			} else {
				q = $(window).width()<=self.maxWidth;
			}
			// 読み込み時
			if(evt.type=="ready") {
				//スマホサイズ内
				if(q) {
					//PCモード(切替ボタン)なら
					if($.cookie("switchScreen")==1) {
						window.responsiveMode = "PC";
						$(window).trigger("readyPC");
					//SPモード(切替ボタン)なら
					} else {
						window.responsiveMode = "SP";
						$(self.cssFiles).each(function() {
							$("link[href='"+this+"']").on("load",function() { cnt++; });
						});
						func = setInterval(function() {
							if(cnt!=self.cssFiles.length) { return; }
							$(window).trigger("readySP");
							clearInterval(func);
						},100);
					}
				//スマホサイズ外
				} else {
					window.responsiveMode = "PC";
					$(window).trigger("readyPC");
				}
			//リサイズ
			} else if(evt.type=="resize") {
				//スマホサイズ内
				if(q) {
					//PCモード(切替ボタン)なら
					if($.cookie("switchScreen")==1) {
						$(window).trigger("resizePC");
					//SPモード(切替ボタン)なら
					} else {
						$(window).trigger("resizeSP");
					}
					//matchMediaが切り替わった時
					if(flag!=q) {
						//PCモード(切替ボタン)なら
						if($.cookie("switchScreen")==1) {
							//【PCモード → PCモード】※トリガー不要
							//$(window).trigger("switchPC");
						//SPモード(切替ボタン)なら
						} else {
							//【PCモード → SPモード】
							if(window.responsiveMode!="SP") {
								window.responsiveMode = "SP";
								$(window).trigger("switchSP");
							}
						}
					}
				//スマホサイズ外
				} else {
					$(window).trigger("resizePC");
					//matchMediaが切り替わった時
					if(flag!=q) {
						//【SPモード → PCモード】
						window.responsiveMode = "PC";
						$(window).trigger("switchPC");
					}
				}
				//matchMediaが切り替わった時
				if(flag!=q) {
					//【SPモード → PCモード】【SPモード → PCモード】
					// 何かしらの切り替わりが起こった時
					$(window).trigger("switchResponsive");
					flag = q;
				}
			}
		});
	},
	/* スマホ時TOP（緑のロゴ入り画像）のメニュー展開
	----------------------------------------------------------- */
	setHeader : function() {

		//y01追加
		if(this.headerFile == ''){return false;}
		//y01追加 END

		//スマホ用ヘッダーを表示させる
		var pathArr = [];
		$("a, .visited", "#path").each(function() {
			pathArr.push({
				href : $(this).attr("href"),
				text : $(this).text()
			});
		});
		$.ajax({
			url : this.headerFile,
			cache : false,
			dataType : "html",
			beforeSend : function(htmlTxt,status,xhr){
				//this.onLoad(htmlTxt,status,xhr);
			},
			error : function(htmlTxt,status,xhr){
				//this.onError(htmlTxt,status,xhr);
			},
			success : function(htmlTxt,status,xhr){
				$("#page").prepend(htmlTxt);
				for(var i=0; i<pathArr.length; i++) {
					if(pathArr[i].text=="松装") {
						pathArr[i].text = "松装トップページ";
					}
					if(pathArr[i].href) {
						$(".sp_mtsw_head #spmenu").append(
							$("<a href='"+pathArr[i].href+"'><span class='sp ml10'>&#9495;</span><span class='sp link ml10'>"+pathArr[i].text+"</span><span class='gt'><i class='icon-angle-right'></i></span></a>")
						);
					} else {
						$(".sp_mtsw_head #spmenu").append(
							$("<p><span class='sp ml10'>&#9495;</span><span class='visited sp ml10'>"+pathArr[i].text+"</span></p>")
						);
					}
				}
				/* メニューのオンオフ */
				$('#spmenu_p').click(function(){
					$("#spmenu").toggleClass("spmenu_on");
				});
			}
		});
	},
};
