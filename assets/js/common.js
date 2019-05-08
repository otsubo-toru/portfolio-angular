
$(function() {
	// スマホ対応
	$(window).spSwitch({
		defaultCssFiles : ["./assets/css/sp_common.css"],
		cssFiles : ["./assets/css/sp_common.css"],
	});

	// AOS
  AOS.init();
	// モーダル
	baguetteBox.run('.baguette-box',{
		caption: true,
		buttons: true,
	});
  // スライダー
  $(".swiper-container").setSwiper();
});
