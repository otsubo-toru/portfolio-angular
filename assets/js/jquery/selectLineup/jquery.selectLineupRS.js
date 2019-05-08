

Items.prototype.setKeyArray = function() {
	var self=this;
	if(self.config) {
		self.keyArray = self.config.selectLineup.keyArray;
	} else {
		console.log("「/rollscreen/js/rs_config.js」を読み込んでください。");
	}
	return this;
};

Items.prototype.setOutputConfig = function() {
	var self=this;
	if(self.config) {
		self.outputConfig = $.extend(true, self.config.selectLineup.outputConfig, self.outputConfig);
	} else {
		console.log("「/rollscreen/js/rs_config.js」を読み込んでください。");
	}
	return this;
};

Items.prototype.setDefaultSort = function() {
	//this.sort("default","asc");
	return this;
};


Items.prototype.outputRS = function() {
	var self = this;
	var util = self._utility;
	// 出力設定を読み込み
	self.setOutputConfig();
	// カテゴリのアイテムがあれば...
	if(self.selectedItems.length!=0) {
		//アイテム表示の「始まり」と「終わり」の番号
		var startNum = self.currentPage * self.displayLength;
		var endNum = startNum + self.displayLength;
		var output = self.outputConfig;
		var config = self.config;
		var tax = self.config.taxRate;

		var html = "";
		html+='<div class="grid gutter10">'
		//Items.selectedItemsの中で、表示する範囲内をfor処理
		for(var i = startNum; i < endNum; i++) {
			//Items.selectedItemsの終わりまで来たらfor処理終了
			if(i==self.selectedItems.length) { break; }
			var item = self.selectedItems[i];

			html+='<div class="g03"><a href="'+item.url+'" class="item">';
			html+='<span class="el-thumb"><img src="'+item.thumb+'" alt="'+item.itemName+'" class="fix-img w100p h135 sp-h115">';
			// 商品ラベル「New!」「おすすめ」「人気商品」...
			var label = config.label[item.label];
			if(label) {
				html+='<img src="'+label.img.left.m+'" alt="'+label.name+'" width="70" class="img-label">';
			}
			html+='</span>';	//.el-thumb
			html+='<span class="el-body">';
			if (util.isSet(item.makerName) && output.makerName) {
				html+='<span class="el-maker">'+item.makerName+'・'+item.catalogName+'</span>';
			}
			html+='<span class="el-name">'+item.itemName+(output.itemCodes ? '<span class="el-code t-supplement t11 t-normal block">'+item.itemCodes+'</span>' : '')+'</span>';
			//ラベル
			if(output.labels) {
				html+='<span class="labels">';
				//カラー数
				if(util.isSet(item.colorLength)) {
					html+='<span class="label md-txt-label">'+item.colorLength+'色</span>';
				}
				//遮光
				if(util.isSet(item.touka,"syakou") && output.syakou) {
					html+='<span class="label md-txt-label">遮光'+String(item.syakou).replace('-','～')+'級</span>';
				}
				//シアー
				if(util.isSet(item.type,"sheer") && output.sheer) {
					html+='<span class="label md-txt-label">シアー</span>';
				}
				//遮熱
				if(util.isSet(item.kinou,"syanetu") && output.syanetu) {
					html+='<span class="label md-txt-label mr02">遮熱</span>';
				}
				//広幅対応
				if(util.isSet(item.kinou,"hirohaba") && output.hirohaba) {
					html+='<span class="label md-txt-label md-pink">広幅対応</span>';
				}
				//ウォッシャブル
				if(util.isSet(item.kinou,"washable") && output.washable) {
					html+='<span class="label md-txt-label">ウォッシャブル</span>';
				}
				//送料無料
				if(util.isSet(item.souryou) && item.souryou=="送料無料" && output.souryou) {
					html+='<span class="label md-txt-label md-basic-info mr02">'+item.souryou+'</span>';
				}
				html+='</span>';	//.labels
			}
			// 参考価格
			if(util.isSet(item.price) && output.price) {
				if(util.isNum(item.price)) {
//					var priceWithoutTax = util.untaxPrice(item.price);
					var price = item.price;
					if(item.taxed=="untaxed") { price=util.taxPrice(price,tax); }
					price = util.putCommas(price);
					if(util.isSet(item.priceNote)) {
						html+='<span class="el-price-note t11 block">'+item.priceNote+'：</span>';
					}
					html+='<span class="el-price">&yen;'+ price + (util.isSet(item.priceUnit)?item.priceUnit:'') + '<span class="t11 t-normal">(税込)</span></span>';
				} else {
					html+='<span class="el-price">'+String(item.price)+'</span>';
				}
			}
//			html+='<span class="block">'+item.popular+'</span>';
			html+='</span>';	//.el-body
			html+='</div></a>';

		}
		html+='</div>';
		$(".items", self.elem).append(html);

		//.items-lengthにアイテム数を表示
		self.outputItemsLength(startNum,endNum);
		//ページャーの表示
		self.pagerOutput();
	} else { //カテゴリのアイテムがなければ...
		self.outputNoItems();
	}
};
