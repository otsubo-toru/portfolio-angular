// -----------------------------------------------------
// jquery.smoothScroll.js
// Author: Toru Otsubo
// Date: 2019-05-01
//
// ※jquery3.4.0.jsにて動作確認済み
// ※AOSへの対応
// ※loadComponents対応
// -----------------------------------------------------


$(function(){
	// #で始まるアンカーをクリックした場合に処理
	$("a[href*='#']").smoothScroll();

	//loadComponents.jsへの対応
	var cnt = 0;
	var func = setInterval(function() {
		cnt++;
		var a = $("a[href*='#']").not(".no-smooth");
		$(a).each(function() {
			if(!$(this).data("smoothscroll")) {
				$(this).smoothScroll();
			}
		});
		if(cnt>=5){clearInterval(func);}
	},1000);
});


// easing
jQuery.easing.quart = function (x, t, b, c, d) {
    return -c * ((t=t/d-1)*t*t*t - 1) + b;
};


(function($){
	$.fn.extend({
		smoothScroll : function(options){
			//オプション設定（デフォルト値を予め入れておく）
			var options = $.extend({
				speed : 800		//スクロールの速度(ミリ秒)
			}, options);

			return this.each(function () {
				// データ「smoothscroll」が割り当てられていたらキャンセル
				if($(this).data("smoothscroll")) { return; }
				//「.no-smooth」クラスが割り当てられていたらキャンセル
				if($(this).hasClass("no-smooth")) { return; }
				//ホスト名が違っていたらキャンセル
				if(location.hostname != this.hostname) { return; }

				//アンカーリンクの判定・整形
				//リンクが同ページ内であれば、hrefを「#」から始まる形式に変換する
				//（※smoothScrollが適用されるようにする）
				var pathArr = String(location.pathname).split("/");
				var aPathArr = String(this.pathname).split("/");
				var aHref = String($(this).attr("href"));
				if(pathArr.length==aPathArr.length) {
					for(var i=0; i<pathArr.length; i++) {
						if(i!=pathArr.length-1) {
							//現在のページとリンクパスが違う場合はキャンセル
							if(pathArr[i]!=aPathArr[i]) { return; }
						} else {
							//現在のページとリンクパスが同じで
							//a要素の「href」が「#」から始まらない場合
							//「#」から始まる形式に変換
							if(aHref.indexOf("#")!=0) {
								aHref = aHref.substr(aHref.indexOf("#"));
								if(pathArr[i]!=aPathArr[i]) {
									if(pathArr[i]=="index.html" || pathArr[i]=="index.htm" || pathArr[i]=="") {
										if(aPathArr[i]=="index.html" || aPathArr[i]=="index.htm") {
											$(this).attr("href", aHref);
										} else { return; }
									} else { return; }
								} else {
									$(this).attr("href", aHref);
								}
							}
						}
					}
				}

				//スムーススクロールの重複割当を防止
				$(this).data("smoothscroll", true);
				//スムーススクロール処理
				$(this).click(function() {
					// アンカーの値取得
					var href= $(this).attr("href");
					// 移動先を取得
					var target = $((href=="#" || href=="") ? "html" : href);
					// 移動先を数値で取得
					var position = target.offset().top;
					// GNAV対応
					position -= 60;
					// AOS対応
					if(target.data("aos")) {
						position -= 100;
					}
					// スムーススクロール
					$("body,html").animate({scrollTop:position}, options.speed, "swing");
					return false;
				});
			});
		}
	});
})(jQuery);
