

Items.prototype.setKeyArray = function() {
	var self=this;
	if(self.config) {
		self.keyArray = self.config.selectLineup.keyArray;
	} else {
		self.keyArray = ["makerCode","category","type","fit","size","sizeNote","material","weight","campaign"];
		console.log("「/curtainrail/js/pr_common.js」を読み込んでください。");
	}
	return this;
};


Items.prototype.setOutputConfig = function() {
	var self=this;
	if(self.config) {
		self.outputConfig = $.extend(true, self.config.selectLineup.outputConfig, self.outputConfig);
	} else {
		console.log("「/curtainrail/js/pr_common.js」を読み込んでください。");
	}
	return this;
};


Items.prototype.setDefaultSort = function() {
	this.sort("popular","desc");
	return this;
}


Items.prototype.outputPR = function() {
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
					html+='<img src="/images/label/bar_s01/'+String(item.label).replace(/-/g,'_')+'.gif" alt="" class="label md-img-bar md-top-left">';
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
				/*
				// 装飾レール：キャップ数
				if(util.isSet(item.capLength)) {
					html+='<span class="label md-txt-label md-gray">キャップ'+item.capLength+'種類</span>';
				}
				*/
				// 耐荷重
				if(util.isSet(item.weight)) {
					var weight = (item.weight.length>=2) ? (item.weight[0]+"～"+item.weight[item.weight.length-1]) : item.weight;
					html+='<span class="label md-txt-label md-gray">耐荷重'+weight+'kg</span>';
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
				/*
				// 電動レール：赤外線リモコン
				if(util.isSet(item.type,"controller-infrared")) {
					html+='<span class="label md-txt-label bg-blue01">赤外線</span>';
				}
				// 電動レール：FMリモコン
				if(util.isSet(item.type,"controller-FM")) {
					html+='<span class="label md-txt-label bg-blue01">FM</span>';
				}
				// 電動レール：RFリモコン
				if(util.isSet(item.type,"controller-RF")) {
					html+='<span class="label md-txt-label bg-blue01">RF</span>';
				}
				if(util.isSet(item.sizeNote,"cut")) {
					html+='<span class="label md-txt-label md-green">カットOK</span>';
				}
				if(util.isSet(item.sizeNote,"kikaku")) {
					html+='<span class="label md-txt-label md-orange">規格サイズ</span>';
				}
				if(util.isSet(item.sizeNote,"sinsyuku")) {
					html+='<span class="label md-txt-label md-orange">伸縮レール</span>';
				}
				*/
				if(util.isSet(item.type,"hekimen")) {
					html+='<span class="label md-txt-label md-gray">壁付</span>';
				}
				if(util.isSet(item.type,"tenjou")) {
					html+='<span class="label md-txt-label md-gray">天井付</span>';
					$(".items > .grid:last-child > .g03:last-child .el-body .labels", self.elem).append(
						$("<span/>").addClass("label md-txt-label md-gray").html("天井付")
					);
				}
				if(util.isSet(item.fit,"saki")) {
					html+='<span class="label md-txt-label md-gray">先付</span>';
				}
				if(util.isSet(item.fit,"ato")) {
					html+='<span class="label md-txt-label md-gray">後付</span>';
				}
				if(util.isSet(item.category,"plaster")) {
					html+='<span class="label md-txt-label md-brown">石膏ボードOK</span>';
				}
				if(util.isSet(item.category,"storage")) {
					html+='<span class="label md-txt-label md-blue">壁面収納</span>';
				}
				if(util.isSet(item.set,"set")) {
					html+='<span class="label md-txt-label md-orange">セット品あり</span>';
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
	return this;
};


//サイズによって価格表示を変えるためのメソッド
Items.prototype.setPrice = function() {
	var self = this;
	// カテゴリのアイテムがあれば...
	if(self.selectedItems.length!=0) {
		//アイテム表示の「始まり」と「終わり」の番号
		var startNum = self.currentPage * self.displayLength;
		var endNum = startNum + self.displayLength;
		//Items.selectedItemsの中で、表示する範囲内をfor処理
		var cnt = 0;
		for(var i=0; i<self.selectedItems.length; i++) {
			var item = self.selectedItems[i];
			//ボタンメニュー「レールサイズで選ぶ」
			var sizeNav = $(".navi-filter.md-size",self.elem);
			if(sizeNav.length>0) {
				//sizeOrder：「md-order-」の「-」で区切られた最後の値
				var activeBtn = $(sizeNav).find(".active");
				var sizeOrder = String(self._utility.pickupWords(activeBtn,"md-order-"));
				sizeOrder = String(sizeOrder).split("-");
				sizeOrder = sizeOrder[sizeOrder.length-1];
			}
			//「レールサイズで選ぶ」があり、「すべて表示」ではなく、sizeOrderがNumberなら、価格を切替
			if(sizeNav.length>0 && sizeOrder!="all" && !isNaN(Number(sizeOrder))) {
				//CSV商品データ「size」の配列を小さい順にソート
				item.size.sort(
					function(a,b){
						if( Number(a) < Number(b) ) {return -1;}
						if( Number(a) > Number(b) ) {return 1;}
						return 0;
					}
				);
				//CSV商品データ「size」欄のゴミ(空の値)除去
				if($.inArray("",item.size)>=0) {
					for(var j=0; $.inArray("",item.size)>=0; j++) {
						item.size.splice($.inArray("",item.size),1);
					}
				}
				//sizeIdx：「price◯◯」の番号
				var sizeIdx = 0;
				for(var j=0; j<item.size.length; j++) {
					if(Number(item.size[j]) <= Number(sizeOrder)) {
						sizeIdx++;
					}
				}
				item.price = item["price0"+sizeIdx];
				if(self._utility.isSet(item.priceNote)) {
					var priceNote = String(item.priceNote).replace(/[0-9]/g,"");
					item.priceNote = item.size[sizeIdx-1] + priceNote;
				}
			}
		}
	}
}
