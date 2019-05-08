

/*
Items.prototype.setKeyArray = function() {
	var self=this;
	if(self.config) {
		self.keyArray = self.config.selectLineup.keyArray;
	} else {
		console.log("「/carpettile/js/tc_common.js」を読み込んでください。");
	}
	return this;
};

Items.prototype.setOutputConfig = function() {
	var self=this;
	if(self.config) {
		self.outputConfig = $.extend(true, self.config.selectLineup.outputConfig, self.outputConfig);
	} else {
		console.log("「/carpettile/js/tc_common.js」を読み込んでください。");
	}
	return this;
};

Items.prototype.setDefaultSort = function() {
	this.sort("price","asc");
	return this;
}
*/

Items.prototype.outputTC = function() {
	var self = this;
	var util = self._utility;

	// カテゴリのアイテムがあれば...
	if(self.selectedItems.length!=0) {
		//アイテム表示の「始まり」と「終わり」の番号
		var startNum = self.currentPage * self.displayLength;
		var endNum = startNum + self.displayLength;
		var config = self.config;
		var slConfig = self.slConfig;
		var tax = config.taxRate;
		var output = self.outputConfig;
		var kinouIcons = self.kinouIcons;
		var target = {
			elem : $(self.elem).is(".items") ? $(self.elem) : $(".items", self.elem),
			isGrid : function() { return $(this.elem).hasClass("grid"); },
			isUl : function() { return $(this.elem).is("ul") },
		};
		var isColumn03 = (self.column==3);
		var html = "";
		if(!target.isGrid()) {
			html+='<'+(!target.isUl()?'ul':'div')+' class="grid gutter10'+(isColumn03?' fix-height md-target-item md-column-03 md-sp-column-02':'')+'">';
		}
		//Items.selectedItemsの中で、表示する範囲内をfor処理
		for(var i=startNum; i<endNum; i++) {
			//Items.selectedItemsの終わりまで来たらfor処理終了
			if(i==self.selectedItems.length) { break; }
			var item = self.selectedItems[i];

			html+='<'+(!target.isGrid()||target.isUl()?'li':'div')+' class="'+(isColumn03?'g04 sp-g06':'g03')+'"><a href="'+item.url+'" class="item">';
			html+='<span class="el-thumb"><img src="'+item.thumb+'" alt="'+item.itemName+'" class="el-thumb-img sp-h150">';
			if(output.label) {
				// 商品ラベル「New!」「おすすめ」「人気商品」...
				var label = config.label[item.label];
				if(label) {
					html+='<img src="'+label.img.left.m+'" alt="'+label.name+'" width="'+(isColumn03?'80':'70')+'" class="img-label sp-w70">';
				}
			}
			html+='<span class="labels md-bottom-left ml05 mb02">';
			//カラー数
			if(util.isSet(item.colorLength)) {
				html+='<span class="label md-txt-label md-gray-border t14 t-bold">全'+item.colorLength+'色</span>';
			}
			html+='</span>';	//.labels
			html+='</span>';	//.el-thumb
			html+='<span class="el-body">';
			if (util.isSet(item.makerName)&&output.makerName) {
				html+='<span class="el-maker ellipsis">'+item.makerName+'</span>';
			}
			html+='<span class="el-name ellipsis">'+item.itemName+(util.isSet(output.itemCodes) ? '<span class="el-code t-supplement t11 t-normal block">'+item.itemCodes+'</span>' : '')+'</span>';
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
				html+='<span class="labels">';
				if(util.isSet(item.size)) {
					var size = String(item.size).replace("-","&times;");
					html+='<span class="label md-txt-label md-spec">'+size+'cm</span>';
				}
				if(util.isSet(item.quantity)) {
					html+='<span class="label md-txt-label md-spec">'+item.quantity+'枚入</span>';
				}
				//歩行量
				$(slConfig.stamina).each(function() {
					var map = config.stamina;
					if(util.isSet(item.stamina, String(this))) {
						html+='<span class="label md-txt-label md-spec">'+map[this].name+'</span>';
					}
				});
				//パイル
				$(slConfig.pile).each(function() {
					var map = config.pile;
					if(util.isSet(item.pile, String(this))) {
						html+='<span class="label md-txt-label md-spec">'+map[this].name+'</span>';
					}
				});
				//素材
				$(slConfig.material).each(function() {
					var map = config.material;
					if(util.isSet(item.material, String(this))) {
						html+='<span class="label md-txt-label md-spec">'+map[this].name+'</span>';
					}
				});
				//原着
				if(util.isSet(item.material, "genchaku")) {
					html+='<span class="label md-txt-label md-spec md-pink">原着</span>';
				}
				//のり付き
				if(util.isSet(item.type, "sticky")) {
					html+='<span class="label md-txt-label md-spec md-blue">のり付き</span>';
				}
				//滑り止め
				if(util.isSet(item.type, "grip")) {
					html+='<span class="label md-txt-label md-spec md-blue">滑り止め</span>';
				}
				//送料無料
				if(util.isSet(item.souryou) && item.souryou=="送料無料" && output.souryou) {
					html+='<span class="label md-txt-label md-basic-info mr02">'+item.souryou+'</span>';
				}
				html+='</span>';	//.labels
			}
			// 参考価格
			if(util.isSet(item.price)) {
				if(util.isNum(item.price)) {
					// item.priceは、1枚あたりの税別価格
//					var priceTaxed = util.taxPrice(item.price,tax);
					if(util.isSet(item.priceNote)) {
						html+='<span class="el-price-note t11 block">'+item.priceNote+'：</span>';
					}
					html+='<span class="el-price">'+util.putCommas(item.price)+'<span class="el-price-unit">'+(util.isSet(item.priceUnit)?item.priceUnit:'')+'</span><span class="t11 t-normal">(税別)</span></span>';
				} else {
					html+='<span class="el-price t15">'+String(item.price)+'</span>';
				}
			}
			// 参考価格
			if(util.isSet(item.price) && output.priceByCase) {
				if(util.isNum(item.price)) {
					html+='<span class="el-price t12 t-normal mh02">'+util.putCommas(item.price*item.quantity)+'<span class="el-price-unit">円/ケース</span><span class="t11 t-normal">(税別)</span></span>';
				}
			}
			//html+='<span class="block">'+item.popular+'</span>';
			html+='</span>';	//.el-body
			html+='</a></'+(!target.isGrid()||target.isUl()?'li':'div')+'>';
		}
		if(!target.isGrid()) {
			html+='</'+(!target.isUl()?'ul':'div')+'>';
		}
		$(target.elem).append(html);

		//.items-lengthにアイテム数を表示
		self.outputItemsLength(startNum,endNum,"<span class='t-supplement ml20 sp-block sp-ml00 sp-mt05'>(※表示価格は税抜価格)</span>");
		//ページャーの表示
		self.pagerOutput();
	} else { //カテゴリのアイテムがなければ...
		self.outputNoItems();
	}
};
