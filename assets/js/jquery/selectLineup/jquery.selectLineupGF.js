
Items.prototype.setKeyArray = function() {
	var self=this;
	if(self.config) {
		self.keyArray = self.config.selectLineup.keyArray;
	} else {
		console.log("「/glassfilm/js/gf_config.js」を読み込んでください。");
	}
	return this;
};


Items.prototype.setOutputConfig = function() {
	var self=this;
	if(self.config) {
		self.outputConfig = $.extend(true, self.config.selectLineup.outputConfig, self.outputConfig);
	} else {
		console.log("「/glassfilm/js/gf_config.js」を読み込んでください。");
	}
	return this;
};

Items.prototype.setDefaultSort = function() {
	//this.sort("default","asc");
	return this;
};



Items.prototype.outputGF = function() {
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
		html+='<div class="grid gutter20">';
		//Items.selectedItemsの中で、表示する範囲内をfor処理
		for(var i = startNum; i < endNum; i++) {
			//Items.selectedItemsの終わりまで来たらfor処理終了
			if(i==self.selectedItems.length) { break; }
			var item = self.selectedItems[i];

			html+='<div class="g04 sp-g06"><a href="'+item.url+'" class="item gf-item">';
			html+='<span class="el-thumb"><img src="'+item.thumb+'" alt="'+item.itemName+'" class="fix-img w100p">';
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
			html+='<span class="el-name mb00">'+item.itemName+(output.itemCodes ? '<span class="el-code t-supplement t11 t-normal block">'+item.itemCodes+'</span>' : '')+'</span>';
			//コメント
			if(util.isSet(item.comment) && output.comment) {
				html+='<span class="el-txt">'+item.comment+'</span>';
			}
			//ラベル
			if(output.labels) {
				html+='<span class="labels">';
				//タイプ数
				if(util.isSet(item.colorLength) && output.hisanboushi) {
					html+='<span class="label md-txt-label">'+item.colorLength+'種</span>';
				}
				//飛散防止
				if(util.isSet(item.kinou,"hisanboushi") && output.kinou) {
					html+='<span class="label md-txt-label">飛散防止</span>';
				}
				//飛散低減
				if(util.isSet(item.kinou,"hisanteigen") && output.kinou) {
					html+='<span class="label md-txt-label">飛散低減</span>';
				}
				//UVカット
				if(util.isSet(item.kinou,"uv") && output.kinou) {
					html+='<span class="label md-txt-label">UVカット</span>';
				}
				//防虫忌避
				if(util.isSet(item.kinou,"boutyu") && output.kinou) {
					html+='<span class="label md-txt-label">防虫忌避</span>';
				}
				//低放射
				if(util.isSet(item.kinou,"teihousya") && output.kinou) {
					html+='<span class="label md-txt-label">低放射</span>';
				}
				//遮熱
				if(util.isSet(item.kinou,"syanetu") && output.kinou) {
					html+='<span class="label md-txt-label">遮熱</span>';
				}
				//眩しさ緩和
				if(util.isSet(item.kinou,"hizashi") && output.kinou) {
					html+='<span class="label md-txt-label">眩しさ緩和</span>';
				}
				//低虹彩
				if(util.isSet(item.kinou,"teikousai") && output.kinou) {
					html+='<span class="label md-txt-label">低虹彩</span>';
				}
				//ハードコート
				if(util.isSet(item.kinou,"hardcoat") && output.kinou) {
					html+='<span class="label md-txt-label">ハードコート</span>';
				}
				//外貼り可
				if(util.isSet(item.kinou,"sotobari") && output.kinou) {
					html+='<span class="label md-txt-label md-pink">外貼り可</span>';
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
					var zeikomiPrice = "";
					if(item.taxed == "untaxed"){
						zeikomiPrice = Math.floor(item.price * ( 1 + tax ));
					}else{
						zeikomiPrice = item.price;
					}
					if(util.isSet(item.priceNote)) {
						html+='<span class="el-price-note t11 block">'+item.priceNote+'：</span>';
					}
					html+='<span class="el-price">&yen;'+util.putCommas(zeikomiPrice) + (util.isSet(item.priceUnit)?item.priceUnit:'') + '<span class="t11 t-normal">(税込)</span></span>';
					/*
//					var priceWithoutTax = util.untaxPrice(item.price);
					if(util.isSet(item.priceNote)) {
						html+='<span class="el-price-note t11 block">'+item.priceNote+'：</span>';
					}
					html+='<span class="el-price">&yen;'+util.putCommas(item.price) + (util.isSet(item.priceUnit)?item.priceUnit:'') + '<span class="t11 t-normal">(税込)</span></span>';
					*/
				} else {
					html+='<span class="el-price">'+String(item.price)+'</span>';
				}
			}
			// 参考価格（面積）
			if(util.isSet(item.priceArea) && output.priceArea) {
				if(util.isNum(item.priceArea)) {
					var zeikomiPriceArea = "";
					if(item.taxed == "untaxed"){
						zeikomiPriceArea = Math.floor(item.priceArea * ( 1 + tax ));
					}else{
						zeikomiPriceArea = item.priceArea;
					}
					if(util.isSet(item.priceNoteArea)) {
						html+='<span class="el-price-note t11 block">'+item.priceNoteArea+'：</span>';
					}
					html+='<span class="el-price t-normal t12 block">&yen;'+util.putCommas(zeikomiPriceArea) + (util.isSet(item.priceUnitArea)?item.priceUnitArea:'') + '<span class="t11 t-normal">(税込)</span></span>';
					/*
//					var priceWithoutTax = util.untaxPrice(item.price);
					if(util.isSet(item.priceNote)) {
						html+='<span class="el-price-note t11 block">'+item.priceNoteArea+'：</span>';
					}
					html+='<span class="el-price t-normal t12 block">&yen;'+util.putCommas(item.priceArea) + (util.isSet(item.priceUnitArea)?item.priceUnitArea:'') + '<span class="t11 t-normal">(税込)</span></span>';
					*/
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
