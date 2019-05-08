

Items.prototype.setKeyArray = function() {
	var self=this;
	if(self.config) {
		self.keyArray = self.config.selectLineup.keyArray;
	} else {
		this.keyArray = ["makerCode","category","taste","func","use"];
		console.log("「/accordion/js/ac_config.js」を読み込んでください。");
	}
	return this;
};


Items.prototype.setOutputConfig = function() {
	var self=this;
	if(self.config) {
		self.outputConfig = $.extend(true, self.config.selectLineup.outputConfig, self.outputConfig);
	} else {
		console.log("「/accordion/js/ac_config.js」を読み込んでください。");
	}
	return this;
};

Items.prototype.setDefaultSort = function() {
	//this.sort("default","asc");
	return this;
};



Items.prototype.outputAC = function() {
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
			html+='<span class="el-name mb00">'+item.itemName+(output.itemCodes ? '<span class="el-code t-supplement t11 t-normal block">'+item.itemCodes+'</span>' : '')+'</span>';
			//コメント
			if(util.isSet(item.comment) && output.comment) {
				html+='<span class="el-txt">'+item.comment+'</span>';
			}
			//ラベル
			if(output.labels) {
				html+='<span class="labels">';
				//カラー数
				if(util.isSet(item.colorLength)) {
					html+='<span class="label md-txt-label">'+item.colorLength+'色</span>';
				}
				//遮光
				if(util.isSet(item.kinou,"syakou") && output.syakou) {
					html+='<span class="label md-txt-label">遮光</span>';
				}
				//防汚
				if(util.isSet(item.kinou,"bouo") && output.bouo) {
					html+='<span class="label md-txt-label">防汚</span>';
				}
				//抗菌
				if(util.isSet(item.kinou,"koukin") && output.koukin) {
					html+='<span class="label md-txt-label">抗菌</span>';
				}
				//遮熱
				if(util.isSet(item.kinou,"syanetu") && output.syanetu) {
					html+='<span class="label md-txt-label">遮熱</span>';
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
					if(util.isSet(item.priceNote)) {
						html+='<span class="el-price-note t11 block">'+item.priceNote+'：</span>';
					}
					html+='<span class="el-price">&yen;'+util.putCommas(item.price) + (util.isSet(item.priceUnit)?item.priceUnit:'') + '<span class="t11 t-normal">(税込)</span></span>';
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





/*
Items.prototype.outputAC = function() {
	var self=this;
	// カテゴリのアイテムがあれば...
	if(self.selectedItems.length!=0) {
		//アイテム表示の「始まり」と「終わり」の番号
		var startNum = self.currentPage * self.displayLength;
		var endNum = startNum + self.displayLength;
		//Items.selectedItemsの中で、表示する範囲内をfor処理
		var cnt = 0;
		for(var i = startNum; i < endNum; i++) {
			//Items.selectedItemsの終わりまで来たらfor処理終了
			if(i==self.selectedItems.length) { break; }
			var item = self.selectedItems[i];

			//機能アイコン部分
			var kinouVal = 0;
			var kinouValMax = 4;//最大4個まで、並び順
			icnlist = new String();

			if($.inArray('bouen',item.func) >= 0 && kinouVal < kinouValMax){
				icnlist = icnlist.concat('<span class="bouen">防炎</span>');
				kinouVal++;
			}
			if($.inArray('h_through',item.func) >= 0 && kinouVal < kinouValMax){
				icnlist = icnlist.concat('<span class="h_through">半透明</span>');
				kinouVal++;
			}
			if($.inArray('through',item.func) >= 0 && kinouVal < kinouValMax){
				icnlist = icnlist.concat('<span class="h_through">透明</span>');
				kinouVal++;
			}
			if($.inArray('koukin',item.func) >= 0 && kinouVal < kinouValMax){
				icnlist = icnlist.concat('<span class="kokin">抗菌</span>');
				kinouVal++;
			}
			if($.inArray('bouo',item.func) >= 0 && kinouVal < kinouValMax){
				icnlist = icnlist.concat('<span class="bouo">防汚</span>');
				kinouVal++;
			}
			if($.inArray('bouchu',item.func) >= 0 && kinouVal < kinouValMax){
				icnlist = icnlist.concat('<span class="bouchu">防虫</span>');
				kinouVal++;
			}



			//アイテムリストを表示
			if(cnt%4 == 0) {
				$(".items", self.elem).append($("<div/>").addClass("grid gutter15"));
			}
			cnt++;
			$(".items > .grid:last-child", self.elem).append(
				$("<div/>").addClass("g03").append(
					$("<div/>").addClass("item boxlink").append(
						$("<a/>").attr("href",item.url).html(item.itemName)
					).append(
						$("<div/>").addClass("el-thumb").append(
							$("<img/>").attr({
								src : item.thumb,
								alt : item.name,
								width : "168"
							}).addClass("el-thumb-img")
						).append(
							$("<span/>").addClass("icn").html(icnlist)
						)
					).append(
						$("<div/>").addClass("el-body").append(
							$("<p/>").addClass("name").html(item.itemName).append(
								$("<span/>").addClass("color").html(item.colorLength + '色')
							)
						).append(
							$("<p/>").addClass("number").html(item.number)
						).append(
							$("<p/>").addClass("price").html("参考価格：&yen;" + String(item.price).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'))
						)
					)
				)
			);
		}
		//.items-lengthにアイテム数を表示
		self.outputItemsLength(startNum,endNum);
		//ページャーの表示
		self.pagerOutput();
	} else { //カテゴリのアイテムがなければ...
		self.outputNoItems();
	}
};

*/
