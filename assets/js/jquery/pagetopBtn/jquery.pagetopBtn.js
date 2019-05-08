

/*---------------------------------
//このファイルを読み込んだ時点で、自動的に「トップへ」ボタンが生成されます。
//設定を変えたい場合は、このファイルの読み込み後に以下のように記述
//(ボタンを変えたい場合は、appendForceをtrueにする)

<script type="text/javascript">
$(function() {
	$("#contents").pagetopBtn({
		appendForce : true,
		btnHtml : "&uarr;ページトップへ",
		href : ◯◯◯
	});
});
</script>

*/


$(function() {
	$("#PAGE").pagetopBtn();
});



(function($){
	$.fn.extend({
		pagetopBtn : function(options){
			var self = this;
			//オプション設定（デフォルト値を予め設定しておく）
			var options = $.extend({
				//ボタンのID
				btnID : "PAGETOP_BTN",
				//クリックで戻るポジション(アンカーリンクで設定)
				href : "#PAGE",
				//ボタン内のHTML
				btnHtml : "<i class='fontello-arr-up'></i>",
				//既存のボタンを削除
				appendForce : false,
				//自動ボタン生成
				autoAppendBtn : true,
				//ボタンが現れるポジション
				btnShowPos : 500
			}, options);

			return this.each(function () {
				//options.appendForceがtrueなら、「トップへ」ボタンを削除
				if(options.appendForce && $("#"+options.btnID).length) {
					$("#"+options.btnID).remove();
				}
				//options.btnIDと同一IDの要素がなければ、「トップへ」ボタンを作る
				//【↓デフォルトのボタン】※要アイコンフォントfontello
				//<p><a href="#path"><i class="icon-arr-up"></i></a></p>
				if(options.autoAppendBtn && !$("#"+options.btnID).length) {
					$(self).append(
						$("<p/>").attr("id",options.btnID).append(
							$("<a/>").attr("href",options.href).html(options.btnHtml)
						)
					);
				}
				//options.btnShowPosよりも下にスクロールしたら、ボタンが現れる
				var topBtn = $("#"+options.btnID);
				topBtn.hide();
				$(window).scroll(function () {
					if ($(this).scrollTop() > options.btnShowPos) {
						topBtn.fadeIn();
					} else {
						topBtn.fadeOut();
					}
				});
				//ボタンをクリックしたら、スクロールしてoptions.hrefの位置まで戻る
				topBtn.click(function () {
					$("body,html").animate({
						scrollTop: $(options.href).offset().top
					}, 500);
					return false;
				});
			});
		}
	});
})(jQuery);
