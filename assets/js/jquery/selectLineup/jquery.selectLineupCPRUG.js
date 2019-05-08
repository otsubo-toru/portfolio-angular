
Items.prototype.setKeyArray = function() {
	var self=this;
	if(self.config) {
		self.keyArray = self.config.selectLineup.keyArray;
	} else {
		console.log("「/carpet.rug/js/cp_common.js」を読み込んでください。");
	}
	return this;
};

Items.prototype.setOutputConfig = function() {
	var self=this;
	if(self.config) {
		self.outputConfig = $.extend(true, self.config.selectLineup.outputConfig, self.outputConfig);
	} else {
		console.log("「/carpet.rug/js/cp_common.js」を読み込んでください。");
	}
	return this;
};

Items.prototype.setDefaultSort = function() {
	this.sort("price","asc");
	return this;
}



Items.prototype.outputCPRUG = function() {
	var self = this;
	var util = self._utility;
	// 出力設定を読み込み
	self.setOutputConfig();
	if(self.selectedItems.length!=0) {
		//アイテム表示の「始まり」と「終わり」の番号
		var startNum = self.currentPage * self.displayLength;
		var endNum = startNum + self.displayLength;
		var output = self.outputConfig;
		var config = self.config;
		var tax = self.config.taxRate;

		var html = "";
		html+='<div class="grid gutter15">'
		//Items.selectedItemsの中で、表示する範囲内をfor処理
		for(var i=startNum; i<endNum; i++) {
			//Items.selectedItemsの終わりまで来たらfor処理終了
			if(i==self.selectedItems.length) { break; }
			var item = self.selectedItems[i];

			html+='<div class="g03"><a href="'+item.url+'" class="item">';
			html+='<span class="el-thumb"><img src="'+item.thumb+'" alt="'+item.itemName+'" class="el-thumb-img sp-h150">';
			// 商品ラベル「New!」「おすすめ」「人気商品」...
			var label = config.label[item.label];
			if(label) {
				html+='<img src="'+label.img.left.m+'" alt="'+label.name+'" width="70" class="img-label">';
			}
			// キャンペーン関連
			$(config.selectLineup.campaign).each(function() {
				var map = config.campaign;
				if(util.isSet(item.campaign, String(this))) {
					html+='<img src="'+map[this].bnr+'" alt="'+map[this].name+'" height="38" class="label md-tile-hidden">';
				}
			});
			html+='</span>';	//.el-thumb
			html+='<span class="el-body">';
			if (util.isSet(item.makerName)) {
				html+='<span class="el-maker">'+item.makerName+(util.isSet(item.catalogName)?'・'+item.catalogName:'')+'</span>';
			}
			html+='<span class="el-name">'+item.itemName+(output.itemCodes ? '<span class="el-code t-supplement t11 t-normal block">'+item.itemCodes+'</span>' : '')+'</span>';
			//ラベル
			if(output.labels) {
				html+='<span class="labels">';
				// チェック用「人気度」
				//html+='<span class="label md-txt-label md-spec">人気度：'+item.popular+'</span>';
				//カラー数
				if(util.isSet(item.colorLength)) {
					html+='<span class="label md-txt-label md-spec">全'+item.colorLength+'色</span>';
				}
				//カラー数
				if(util.isSet(item.sizeLength)) {
					html+='<span class="label md-txt-label md-spec">全'+item.sizeLength+'サイズ</span>';
				}
				//歩行量
				$(config.selectLineup.stamina).each(function() {
					var map = config.stamina;
					if(util.isSet(item.stamina, String(this))) {
						html+='<span class="label md-txt-label md-spec">'+map[this].name+'</span>';
					}
				});
				//パイル
				$(config.selectLineup.pile).each(function() {
					var map = config.pile;
					if(util.isSet(item.pile, String(this))) {
						html+='<span class="label md-txt-label md-spec">'+map[this].name+'</span>';
					}
				});
				//送料無料
				if(util.isSet(item.souryou) && item.souryou=="送料無料" && output.souryou) {
					html+='<span class="label md-txt-label md-basic-info mr02">'+item.souryou+'</span>';
				}
				html+='</span>';	//.labels
			}
			// 機能アイコン
			html+='<span class="labels md-kinou">';
			$(config.selectLineup.kinou).each(function() {
				var map = config.kinou;
				if(util.isSet(item.kinou, String(this))) {
					html+='<img src="'+map[this].icon.s+'" alt="'+map[this].name+'" width="30" class="label md-tile-hidden">';
				}
			});
			html+='</span">';	//.labels.md-kinou
			// コメント
			if(util.isSet(item.comment)) {
				html+='<span class="el-txt">'+item.comment+'</span>';
			}
			// 参考価格
			if(util.isSet(item.price)) {
				if(util.isNum(item.price)) {
					// item.priceは、税込価格
					if(util.isSet(item.priceNote)) {
						html+='<span class="el-price-note t11 block">'+item.priceNote+'：</span>';
					}
					html+='<span class="el-price">&yen;'+util.putCommas(item.price)+'<span class="el-price-unit">'+(util.isSet(item.priceUnit)?item.priceUnit:'')+'</span><span class="t11 t-normal">(税込)</span></span>';
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
		self.outputItemsLength(startNum,endNum,"<span class='t-supplement ml20 sp-block sp-ml00 sp-mt05'>※表示価格は税込価格。送料や加工料金が別途かかる場合があります。</span>");
		//ページャーの表示
		self.pagerOutput();
	} else { //カテゴリのアイテムがなければ...
		self.outputNoItems();
	}
};



//サイズによって価格表示を変えるためのメソッド
Items.prototype.setPrice = function() {
	var self = this;
	var util = self._utility;
	// カテゴリのアイテムがあれば...
	if(this.selectedItems.length!=0) {
		//ページャーの長さを登録
		this.pagerLength = Math.ceil(this.selectedItems.length / this.displayLength);
		//アイテム表示の「始まり」と「終わり」の番号
		var startNum = this.currentPage * this.displayLength;
		var endNum = startNum + this.displayLength;
		var cnt = 0;
		var sizeOrder = "";
		var sizeArr = ["mat","kitchen","oneroom","middle","living","large","CP01","CP02","order"];
		if(this.category) {
			//「カーペット」ページの場合
			if(isCarpet()) {
				sizeOrder = "CP01";
				//「サイズで選ぶ」ページの場合
				if($.type(this.defaultFilter)=="object" && this.defaultFilter.type=="size") {
					setSizeOrder(this.defaultFilter.word);
				} else if($.type(this.defaultFilter)=="array") {
					for(var i=0; i<this.defaultFilter.length; i++) {
						if(this.defaultFilter[i].type=="size") {
							setSizeOrder(this.defaultFilter[i].word);
						}
					}
				}
			//「ラグマット」ページの場合
			} else {
				//「サイズで選ぶ」ページの場合
				if($.type(this.defaultFilter)=="object" && this.defaultFilter.type=="size") {
					setSizeOrder(this.defaultFilter.word);
				} else if($.type(this.defaultFilter)=="array") {
					for(var i=0; i<this.defaultFilter.length; i++) {
						if(this.defaultFilter[i].type=="size") {
							setSizeOrder(this.defaultFilter[i].word);
						}
					}
				}
			}
			//「サイズ絞り込み」ボタンを押した場合
			$(".navi-filter", this.elem).each(function() {
				var filterTarget = util.pickupWords($(".active",this),"md-filter-");
				if($.inArray("size",filterTarget)>=0) {
					var filterOrder = util.pickupWords($(".active",this),"md-order-");
					for(var i=0; i<filterOrder.length; i++) {
						if(filterOrder[i]!="kikaku") {
							sizeOrder = filterOrder[i];
						}
					}
				}
			});
			if(!isCarpet() && sizeOrder=="order") {
				sizeOrder = "default";
			}
			if(sizeOrder=="all" || sizeOrder=="") {
				sizeOrder = "default";
			}
			//Items.selectedItemsの中で、表示する範囲内をfor処理
			for(var i=0; i<this.selectedItems.length; i++) {
				var item = this.selectedItems[i];
				if(util.isSet(item["price"+util.fHyphenToPascal(sizeOrder)])) {
					item.price = item["price"+util.fHyphenToPascal(sizeOrder)];
					switch(sizeOrder) {
						case "CP01" :
							item.priceNote = "江戸間4.5畳(261&times;261cm)";
							break;
						case "CP02" :
							item.priceNote = "江戸間6畳(261&times;352cm)";
							break;
						case "order" :
							item.priceNote = "オーダーサイズ";
							item.priceUnit = item.priceOrderUnit;
							break;
						default :
							item.priceNote = item["price"+util.fHyphenToPascal(sizeOrder)+"Note"];
							break;
					}
				} else {
					item.defaultPrice =item.price;
					item.defaultPriceNote =item.priceNote;
					item.defaultPriceUnit =item.priceUnit;
					item.price = item.defaultPrice;
					item.priceNote = item.defaultPriceNote;
					item.priceUnit = item.defaultPriceUnit;
				}
			}
		}
	}
	function isCarpet() {
		if($.type(self.category)=="array" && $.inArray("carpet", self.category) >= 0) {
			return true;
		} else if($.type(self.category)=="string" && self.category=="carpet") {
			return true;
		} else {
			return false;
		}
	};
	function setSizeOrder(word) {
		if($.type(word)=="array") {
			for(var i=0; i<word.length; i++) {
				if($.inArray(word[i], sizeArr) >= 0) { sizeOrder = word; }
			}
		} else if($.type(word)=="string") {
			if($.inArray(word, sizeArr) >= 0) { sizeOrder = word; }
		}
	};
};
