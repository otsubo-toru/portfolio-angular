




Items.prototype.outputOC = function() {
	var self = this;
	var util = self._utility;

	// カテゴリのアイテムがあれば...
	if(self.selectedItems.length!=0) {
		//アイテム表示の「始まり」と「終わり」の番号
		var startNum = self.currentPage * self.displayLength;
		var endNum = startNum + self.displayLength;
		var config = self.config;
		var tax = config.taxRate;
		var output = self.outputConfig;
		var kinouIcons = self.kinouIcons;
		var target = {
			elem : $(".items", self.elem),
			isGrid : function() { return $(this.elem).hasClass("grid"); },
			isUl : function() { return $(this.elem).is("ul") },
		};
		var isColumn03 = (self.column==3);
		var html = "";
		if(!target.isGrid()) {
			html+='<'+(!target.isUl()?'ul':'div')+' class="grid gutter10'+(isColumn03?' fix-height md-target-item md-column-03 md-sp-column-02':'')+'">';
		}
		//Items.selectedItemsの中で、表示する範囲内をfor処理
		for(var i = startNum; i < endNum; i++) {
			//Items.selectedItemsの終わりまで来たらfor処理終了
			if(i==self.selectedItems.length) { break; }
			var item = self.selectedItems[i];

			html+='<'+(target.isUl()?'li':'div')+' class="'+(isColumn03?'g04 sp-g06':'g03')+'"><a href="'+item.url+'" class="item">';
			html+='<span class="el-thumb">';
			html+='<img src="'+item.thumb+'" alt="'+item.itemName+'" class="el-thumb-img w100p '+(isColumn03?'h220':'h170')+' sp-h170">';
			if(output.label) {
				// 商品ラベル「New!」「おすすめ」「人気商品」...
				var label = config.label[item.label];
				if(label) {
					html+='<img src="'+label.img.left.m+'" alt="'+label.name+'" width="'+(isColumn03?'80':'70')+'" class="img-label sp-w70">';
				}
			}
			html+='<span class="labels md-bottom-left ml02 mb02">';
			//カラー数
			if(util.isSet(item.colorLength)) {
				html+='<span class="label md-txt-label md-gray-border t14 t-bold">全'+item.colorLength+'色</span>';
			}
			html+='</span>';	//.labels
			html+='</span>';	//.el-thumb
			html+='<span class="el-body">';
			//カラーリスト
			if(util.isSet(item.colorThumb) && output.colorThumb) {
				html+='<span class="el-color-thumb block mt02 mb05"><img src="'+item.colorThumb+'" alt="" class="fix-img"></span>';
			}
			if (util.isSet(item.makerName) && output.makerName) {
				html+='<span class="el-maker">'+item.makerName+'・'+item.catalogName+'</span>';
			}
			html+='<span class="el-name mb00">'+item.itemName+'</span>';
			//商品コード
			if(util.isSet(item.itemCodes) && (item.itemCodes!=item.itemName) && output.itemCodes) {
				html+='<span class="el-code t-supplement t11 t-normal block">'+item.itemCodes+'</span>';
			}
			//コメント
			if(util.isSet(item.comment) && output.comment) {
				html+='<span class="el-txt">'+item.comment+'</span>';
			}
			// 機能アイコン
			if(output.kinouIcons) {
				html+='<span class="labels md-kinou mh02">';
				$(kinouIcons).each(function() {
					var map = config.kinou;
					if(util.isSet(item.kinou, String(this)) && map[this]) {
						html+='<img src="'+map[this].icon.s+'" alt="'+map[this].name+'" width="30" class="label mr02 mh02">';
					}
				});
				html+='</span>';
			}
			//ラベル
			if(output.labels) {
				html+='<span class="labels mt05">';
				/*
				//カラー数
				if(util.isSet(item.colorLength)) {
					html+='<span class="label md-txt-label">'+item.colorLength+'色</span>';
				}
				*/
				//サイズ
				if(util.isSet(item.size) && output.size) {
					html+='<span class="label md-txt-label">'+config.size[item.size].name+'</span>';
				}
				//防炎
				if(util.isSet(item.kinou,"bouen") && output.bouen) {
					html+='<span class="label md-txt-label bg-red">防炎</span>';
				}
				//遮光
				if(util.isSet(item.touka,"syakou") && util.isSet(item.syakou) && output.syakou) {
					html+='<span class="label md-txt-label md-blue">遮光'+String(item.syakou).replace('-','～')+'級</span>';
				}
				//暗幕カーテン
				if(util.isSet(item.type,"anmaku") && output.syakou) {
					html+='<span class="label md-txt-label md-blue">暗幕カーテン</span>';
				}
				//シアー
				if(util.isSet(item.type,"sheer") && output.sheer) {
					html+='<span class="label md-txt-label">シアー</span>';
				}
				//レース
				if(util.isSet(item.type,"lace") && output.sheer) {
					html+='<span class="label md-txt-label">レース</span>';
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
					html+='<span class="label md-txt-label md-light-blue">ウォッシャブル</span>';
				}
				//はっ水
				if(util.isSet(item.kinou,"hassui") && output.hassui) {
					html+='<span class="label md-txt-label md-light-blue">はっ水</span>';
				}
				//速乾カーテン
				if(util.isSet(item.kinou,"sokkan")) {
					html+='<span class="label md-txt-label md-light-blue">速乾</span>';
				}
				//保温
				if(util.isSet(item.kinou,["hoon","hoon-c"]) && output.hoon) {
					html+='<span class="label md-txt-label md-orange">保温</span>';
				}
				//送料無料
				if(util.isSet(item.souryou) && item.souryou=="送料無料" && output.souryou) {
					html+='<span class="label md-txt-label md-basic-info mr02">'+item.souryou+'</span>';
				}
				html+='</span>';	//.labels
			}
			// 参考価格
			(function() {
				if(!output.price) {return;}
				var key = (output.priceCategory!="")?output.priceCategory:"";
				var price = item["price"+key];
				var makerPrice = item["makerPrice"+key];
				var priceNote = item["priceNote"+key];
				var priceUnit = item["priceUnit"+key];
				var discountRate = item["discountRate"+key];
				var priceDisplay = item["priceDisplay"+key];
				var makerPriceDisplay = item["makerPriceDisplay"+key];
				if(util.isSet(price)) {
					html+=makePrice(price);
				} else if(util.isSet(makerPrice) && util.isSet(discountRate) && priceDisplay=="1") {
					html+=makePrice(util.discountPrice(makerPrice,discountRate));
				} else {
					html+=makePriceHidden();
				}

				// 使用関数
				function makePrice(price) {
					var html="";
					if(util.isNum(price)) {
						if(util.isSet(priceNote)) {
							html+='<span class="el-price-note t11 block mt05">例：'+priceNote+'</span>';
						}
						if(output.makerPrice) {
							html+='<span class="el-maker-price block mt02">&yen;'+util.putCommas(util.taxPrice(makerPrice,config.taxRate)) + (util.isSet(priceUnit)?priceUnit:'') + '<span class="t11 t-normal">(税込)</span> &rarr;</span>';
						}
						if(item.taxed=="untaxed") {
							price =  util.taxPrice(price,config.taxRate);
						}
						html+='<span class="el-price t15">&yen;'+util.putCommas(price) + (util.isSet(priceUnit)?priceUnit:'') + '<span class="t11 t-normal">(税込)</span></span>';
					} else {
						html+=makePriceHidden(price);
					}
					return html;
				};
				function makePriceHidden(price) {
					var html="";
					var priceTxt = price ? String(price) : '価格はお見積りにて！';
					if(output.makerPrice && util.isNum(makerPrice)) {
						if(util.isSet(priceNote)) {
							html+='<span class="el-price-note t11 block mt05">例：'+priceNote+'</span>';
						}
						html+='<span class="el-maker-price block mt02">&yen;'+util.putCommas(util.taxPrice(makerPrice,config.taxRate)) + (util.isSet(priceUnit)?priceUnit:'') + '<span class="t11 t-normal">(税込)</span> &rarr;</span>';
						html+='<span class="el-price mt02">'+priceTxt+'</span>';
					} else {
						html+='<span class="el-price mt05">'+priceTxt+'</span>';
					}
					return html;
				};
			})();
			//html+='<span class="block">'+item.popular+'</span>';
			html+='</span>';	//.el-body
			html+='</a></'+(target.isUl()?'li':'div')+'>';
		}
		if(!target.isGrid()) {
			html+='</'+(!target.isUl()?'ul':'div')+'>';
		}
		$(target.elem).append(html);

		//.items-lengthにアイテム数を表示
		self.outputItemsLength(startNum,endNum);
		//ページャーの表示
		self.pagerOutput();
	} else { //カテゴリのアイテムがなければ...
		self.outputNoItems();
	}
};
