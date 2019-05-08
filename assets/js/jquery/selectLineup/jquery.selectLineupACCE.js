

Items.prototype.setKeyArray = function() {
	var self=this;
	if(self.config) {
		self.keyArray = self.config.selectLineup.keyArray;
	} else {
//		self.keyArray = ["makerCode","category","type","size","sizeNote","taste","material","weight","campaign"];
		console.log("「/curtain_accessory/js/acce_config.js」を読み込んでください。");
	}
	return this;
};


Items.prototype.setOutputConfig = function() {
	var self=this;
	if(self.config) {
		self.outputConfig = $.extend(true, self.config.selectLineup.outputConfig, self.outputConfig);
	} else {
		console.log("「/curtain_accessory/js/acce_config.js」を読み込んでください。");
	}
	return this;
};


Items.prototype.setDefaultSort = function() {
	this.sort("popular","desc");
	return this;
}


Items.prototype.outputACCE = function() {
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
		var tax = config ? self.config.taxRate : 0.08;

		var html = "";
		html+='<div class="grid gutter15">'
		//Items.selectedItemsの中で、表示する範囲内をfor処理
		for(var i = startNum; i < endNum; i++) {
			//Items.selectedItemsの終わりまで来たらfor処理終了
			if(i==self.selectedItems.length) { break; }
			var item = self.selectedItems[i];

			html+='<div class="g03"><a href="'+item.url+'" class="item">';
			html+='<span class="el-thumb"><img src="'+item.thumb+'" alt="'+item.itemName+'" class="el-thumb-img">';
			// 商品ラベル「New!」「おすすめ」「人気商品」...
			if (util.isSet(item.label)) {
				if(config) {
					var label = config.label[item.label];
					if(label) {
						html+='<img src="'+label.img.left.m+'" alt="'+label.name+'" width="60" class="img-label">';
					}
				} else {
					switch(item.label) {
						case "new" :
							html+='<img src="/images/label/label_newitem01_left_m.png" alt="" width="60" class="img-label">';
							break;
						case "popular" :
							html+='<img src="/images/label/label_popular01_left_m.png" alt="" width="60" class="img-label">';
							break;
						case "recomend" :
							html+='<img src="/images/label/label_recomend01_left_m.png" alt="" width="60" class="img-label">';
							break;
						default :
							break;
					}
				}
			}
			html+='</span>';	//.el-thumb
			html+='<span class="el-body">';
			if (util.isSet(item.makerName)) {
				html+='<span class="el-maker">'+item.makerName+'</span>';
			}
			html+='<span class="el-name">'+item.itemName+'</span>';
			//ラベル
			if(output && output.labels) {
				html+='<span class="labels">';
				//カラー数
				if(util.isSet(item.colorLength)) {
					html+='<span class="label md-txt-label md-gray">'+item.colorLength+'色</span>';
				}
				// 材質
				if(util.isSet(item.category,"cr-heavy") && util.isSet(item.material)) {
					if(config) {
						$(item.material).each(function() {
							var material = config.material[String(this)];
							if(material) {
								html+='<span class="label md-txt-label bg-blue01">'+material.name+'</span>';
							}
						});
					}
				}
				html+='</span>';	//.labels
			}
			/*
			// コメント
			if(util.isSet(item.comment)) {
				html+='<span class="el-txt">'+item.comment+'</span>';
			}
			*/
			// 参考価格
			if(util.isSet(item.price)) {
				if(util.isNum(item.price)) {
//					var priceWithoutTax = util.untaxPrice(item.price);
					if(util.isSet(item.priceNote)) {
						html+='<span class="el-price-note t11 block">'+item.priceNote+'：</span>';
					}
					html+='<span class="el-price">&yen;'+util.putCommas(item.price) + (util.isSet(item.priceUnit)?item.priceUnit:'') + '<span class="t11 t-normal">(税込)</span></span>';
				} else {
					html+='<span class="el-price">'+String(item.price)+'</span>';
				}
			}
			html+='</span>';	//.el-body
			html+='</div></a>';

		}
		html+='</div>';
		$(".items", self.elem).append(html);

		//.items-lengthにアイテム数を表示
		self.outputItemsLength(startNum,endNum," ");
		//ページャーの表示
		self.pagerOutput();
	} else { //カテゴリのアイテムがなければ...
		self.outputNoItems();
	}
};
