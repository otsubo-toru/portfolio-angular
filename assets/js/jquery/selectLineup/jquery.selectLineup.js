
(function($){
	$.fn.extend({
		selectLineup : function(options) {
			//オプション設定（デフォルト値を予め入れておく）
			var defaultOptions = {
				// 商材ジャンルを設定する。必須。
				// Stringオブジェクトにて。
				// 「cr」「cp_rug」「ps」「ac」など
				genre : "",
				// 商品一覧CSVファイルのURL
				// ルートから指定してください。
				fileUrl : "",
				// ローディング画像ファイルのURL。多分いじることはない。
				loadingImg : "/carpet.rug/img/common/loading_img01.gif",
				// itemsが設定されている時は、ajaxでデータを取りに行かない。
				items : [],
				// ギャラリーのメニュー要素
				navi : ".item-navi",
				// ページャー要素
				pager : ".pager",
				// 初期読み込みで絞り込むカテゴリー
				// 複数の場合["foo","bar"]
				// "all"または""なら、すべて表示
				category : "",
				// 初期読み込み時に掛けるフィルター
				// filter : {type:"foo",word:"bar"}
				// orフィルター{type:["foo01","foo02"],word:["bar01","bar02"]}
				// andフィルター[{type:"foo01",word:"bar01"},{type:"foo02",word:"bar02"}]
				filter : {},
				// 初期読み込み時に掛ける「除外フィルター」
				// exclude : {type:"foo",word:"bar"}
				// or除外フィルター{type:["foo01","foo02"],word:["bar01","bar02"]}
				// and除外フィルター[{type:"foo01",word:"bar01"},{type:"foo02",word:"bar02"}]
				exclude : {},
				// 初期読み込み時に掛ける「並び替え」
				// defaultSort : {type:"foo",order:"bar"}
				//メニューがセットされていれば、メニュー準拠
				defaultSort : {},
				// 商品を表示させるときのフェードスピード
				// フェードさせると動きがもっさりした印象になるので、
				// 「0」にしておくのが吉。
				fadeSpeed : 0,
				// ディスプレイモード
				// デフォルトでは「タイル式」に表示
				// "tile", "list"
				displayMode : "",
				//表示するアイテム数
				displayLength : 20,
				//ページャーのページ数。多分いじらない。
				pagerLength : 0,
				//現在のページャー。多分いじらない。
				currentPage : 0,
				//出力時、どれを表示させるか？させないか？
				outputConfig : {},
				//表示させる機能アイコン
				kinouIcons : [],
				column : 4,
				ignoreShowFlag : false,
			}
			options.outputConfig = $.extend(true,defaultOptions.outputConfig,options.outputConfig);
			var options = $.extend(defaultOptions, options);

			return this.each(function () {
				var items = new Items(this,options);

				//キューを管理するオブジェクト
				//ajax処理が終わった時点でキュー
				if(!items.items.length) {
					//ファイルからデータを取得
					items.ajax(items.fileUrl);
				} else {
					items.onLoad();
					items.df.resolve();
				}
				//キューItems.df.resolve()されたタイミングで実行
				items.df.done(function() {
					//「Items.category」と「Items.defaultFilter」で選別したものを
					//Items.selectedItemsに格納
					//selectedItemsをバックアップ
					items.selectItems().backupSelectedItems();
					//メニューの動作設定
					items.setMenu();
					items._cookie.initHistory();
					//「フィルター・ソート」の以前の状態を復元
					items._cookie.applyBtnHistory();
					//ディスプレイモード等の適用
					items._cookie.applyConfig();
					//データ整形
					items.setItems();
					//ページャーの長さを登録
					items.setPagerLength();
					//「ページャー」の以前の状態を復元
					items._cookie.applyPagerHistory();
					//アウトプット
					items.output(items.elem);
				});
			});
		}
	});
})(jQuery);






var Items = function(elem,options){
	//指定するジャンル(重要！)
	this.genre = options.genre;
	//要素
	this.elem = elem;
	this._core = new SL_Core(this);
	this._cookie = new SL_Cookie(this);
	this._utility;
	this.ds;
	this.config;
	this.slConfig;
	//取得するファイルのURL
	this.fileUrl = options.fileUrl;
	//文字列を配列に分割格納したい項目
	this.keyArray = [];
	this.outputConfig = options.outputConfig;
	this.kinouIcons = options.kinouIcons;

	//ローディング画像URL
	this.loadingImg = options.loadingImg;
	//showFlagによる選別の設定
	this.ignoreShowFlag = options.ignoreShowFlag;
	//ギャラリーのメニュー要素
	this.navi = options.navi;
	//ページャー
	this.pager = options.pager;
	//ページャーのページ数
	this.pagerLength = 0;
	//現在のページャー
	this.currentPage = 0;
	this.fadeSpeed = options.fadeSpeed;
	this.column = options.column;
	//表示形式
	this.displayMode;
	this.defaultDisplayMode = options.displayMode;
	//表示するアイテム数
	this.displayLength = options.displayLength;
	//指定するカテゴリ
	this.category = options.category;
	//デフォルトのフィルター・ソート
	this.defaultFilter = options.filter;
	this.defaultExclude = options.exclude;
	this.defaultSort = options.defaultSort;
	//アイテムの項目名
	this.itemKey = [];
	//全アイテム
	if(options.items.length) {
		this.items = options.items;
	} else {
		this.items = [];
	}
	//カテゴリに合致するアイテム
	this.selectedItems = [];
	this.SLConfig = {};
	this.SLHistory = {};
	this.backupItems = [];//アイテムバックアップ
	this.fadeSpeed = 0;
	this.df = $.Deferred();
	// コンフィグの設定
	// 「this.config」「this.slConfig」ほか
	this.initConfig();
};

Items.prototype = {
	init : function() {
		return this;
	},
	initConfig : function() {
		var self = this;
		var genreConfig = {};
		// Items.ds, Items._utility
		try {
			this.ds = new DataSelect();
			this._utility = this.ds._utility;
		} catch(e) {
			this._utility = new SL_Utility();
			this.ds = false;
			console.log("「/js/DataSelect.js」を読み込んでください。");
		}
		// Items.commonConfig
		try {
			if(commonConfig) {
				this.config = commonConfig;
			} else {
				console.log("「/js/common.js」を読み込んでください。");
			}
		} catch(e) {
			console.log("「/js/common.js」を読み込んでください。");
		}
		// genreConfig
		try {
			genreConfig = eval(String(this.genre).replace("_","")+"Config");
		} catch(e) {
			try {
				$.ajax({
					url : this.config.selectLineup[this.genre].configFile,
					cache : true,
					dataType : "script",
					async : false,
					error : function(e){
					},
					success : function(script,status,xhr){
						return this;
					}
				});
				genreConfig = eval(String(self.genre).replace("_","")+"Config");
				if(!genreConfig.code) {
					console.log("「"+String(this.genre).replace("_","")+"Config"+"」が見つかりません。");
				}
			} catch(e) {
				console.log("「"+String(this.genre).replace("_","")+"Config"+"」が見つかりません。");
			}
		}
		// 各種設定
		if(this.config) {
			this.config = $.extend(true,$.extend({},this.config),genreConfig);
			if(this.config.selectLineup[this.genre]) {
				this.slConfig = this.config.selectLineup[this.genre];
			} else if(this.config.selectLineup.fileUrl) {
				this.slConfig = this.config.selectLineup;
			}
			if(this.slConfig) {
				if(this.fileUrl=="") {
					this.fileUrl = this.slConfig.fileUrl;
				}
				this.keyArray = this.slConfig.keyArray;
				this.outputConfig = $.extend(true, this.slConfig.outputConfig, this.outputConfig);
				if(!this.kinouIcons.length && this.slConfig.kinouIcons) {
					this.kinouIcons = this.slConfig.kinouIcons;
				}
				if(this.slConfig.setDefaultSort) {
					this.setDefaultSort = this.slConfig.setDefaultSort;
				}
			}
		}
		if(!this.keyArray.length && this.setKeyArray) { this.setKeyArray(); }
		return this;
	},
	ajax : function(fileUrl) {
		$.ajax({
			url : fileUrl,
			cache : false,
			context : this,
			beforeSend : function(csv,status,xhr){
				this.onLoad(csv,status,xhr);
			},
			error : function(e){
				this.onError(e);
			},
			success : function(csv,status,xhr){
				this.onSuccess(csv,status,xhr);
			}
		});
	},
	onError : function(e) {
		$(".loading-box", this.elem).remove();
		$(this.elem).append(
			$("<div>").attr("class","error-box").css({
				"display" : "none",
				"margin" : "10px",
				"color" : "#F00"
			}).text("読み込みエラー").fadeIn("slow")
		);
		console.log(e);
	},
	onLoad : function() {
		$("<div class='loading-box'>").append($("<img>").attr("src",this.loadingImg)).css({
			"height" : "200px",
			"text-align" : "center",
			"padding-top" : "190px",
			"color" : "#666"
		}).append("ロード中。しばらくお待ちください...").appendTo($(".items",this.elem)).hide().fadeIn(this.fadeSpeed);
	},
	onSuccess : function(csv,status,xhr) {
		//取得したCSVをオブジェクトの配列に変換（jquery.csv.js）
		var obj = $.csv(",", "", "\r")(csv);
		//CSVの表の一番上の部分から、項目名を取得
		for(var i=0;i<obj[0].length;i++) {
			this.itemKey.push(obj[0][i]);
		}
		//Items.itemsにアイテムを格納
		for (var i=0;i< obj.length;i++) {
			if (i != 0) {
				var item = {};
				for (var j=0;j<obj[i].length;j++) {
					var key = this.itemKey[j];
					var val = obj[i][j];
					if($.inArray(key, this.keyArray) >= 0) {
						val = val.split(" ");
						$(val).each(function(i) {
							val[i] = $.trim(String(this).replace(/\/\[,\]\//g,","));
						});
					} else {
						val = $.trim(String(val).replace(/\/\[,\]\//g,","));
					}
					if(val && val!="" && val!=[]) {
						item[key] = val;
					}
				}
				if(Object.keys(item).length) {
					this.items.push(item);
				}
			}
		}
		//キュー（Items.df.done～を実行させる）
		this.df.resolve();
		return this;
	},
	selectItems : function() {
		//Items.selectedItemsをリセット
		this.selectedItems = [];
		//this.itemsから指定のカテゴリに合致するアイテムをthis.selectedItemsに格納
		for(var i=0;i<this.items.length;i++) {
			//アイテムのshowFlagが0なら除外
			if(this.items[i].showFlag!=0 || this.ignoreShowFlag) {
				if($.type(this.category)=="string") {
					this.category = [this.category];
				}
				//this.category：Arrayオブジェクト
				//this.items[i].category：Arrayオブジェクト
				if(this.category[0]=="" || this.category[0]=="all") {
					this.selectedItems.push(this.items[i]);
				} else {
					for(var j=0;j<this.category.length;j++) {
						if($.inArray(this.category[j], this.items[i].category) >= 0) {
							this.selectedItems.push(this.items[i]);
							break;
						}
					}
				}
			}
		}
		//処理が終わって不要になったので、this.itemsを空にする
		this.items = [];
		//optionで設定した「filter(defaultFilter)」「exclude(defaultExclude)」の処理
		this.setDefaultFilter().setDefaultExclude();
		//価格の計算を行う
		try {
			if(this.slConfig.culcPrice) {
				this.culcPrice();
			}
		} catch(e) {}
		return this;
	},
	setItems : function() {
		//サイズによる価格切り替え処理
		if(this.setPrice) {
			this.setPrice();
		}
		//絞り込み
		this.setFilter();
		//並び替え
		if(this._utility.pickupWords($(".navi-sort .active", this.elem),"md-sort-")!="default") {
			this.setSort();
		}
		return this;
	},
	backupSelectedItems : function() {
		this.backupItems = $.extend(true,[],this.selectedItems);
	},
	setMenu : function() {
		//イベントハンドラにthis（Itemsオブジェクト）を渡す
		var self = this;
		var initState = true;
		$(this.navi+" .btn",this.elem).on("click", function(evt) {
			self.onClickNaviBtn(evt);
		});
		self.resetFilterBtn();
		return this;
	},
	onClickNaviBtn : function(evt) {
		var self = this;
		var target = evt.target;
		self.currentPage = 0;
		//選択されたボタンをアクティブにする
		if($(target).hasClass("sort")) {
			$(target).parents(self.navi).find(".active").removeClass("active");
			$(target).addClass("active");
		} else if($(target).hasClass("filter")) {
			$(target).parent().find(".active").removeClass("active");
			$(target).addClass("active");
		}
		//selectedItemsを復旧
		self.selectedItems = $.extend(true,[],self.backupItems);
		//データ整形＆アウトプット
		self.setItems().setPagerLength().output();
	},
	setDisplayMode : function() {
		var self=this;
		//【displayModeの優先順位（1>3）】
		// 1. Items.defaultDisplayMode
		// 2. $.cookie("itemsDisplayMode")
		// 3. $(self.elem)のHTML上のクラス設定「md-list」「md-tile」
		if($(this.elem).hasClass("md-list")) {
			this.displayMode = "list";
		} else if($(self.elem).hasClass("md-tile")) {
			this.displayMode = "tile";
		}
		this.SLConfig = this._cookie.getConfig();
		if(this.SLConfig.displayMode) {
			this.displayMode = this.SLConfig.displayMode;
		}
		if(this.defaultDisplayMode!="") {
			this.displayMode = this.defaultDisplayMode;
		}
		//表示形式の設定ボタン
		$(".btn.display-switch",this.elem).on("click", function(evt) {
			self.onClickDisplaySwitch(evt)
		});
		//ディスプレイモードの実行
		if(this.displayMode=="tile" || this.displayMode=="" || !this.displayMode) {
			this.displayMode = "tile";
			this.setTileMode();
		} else if(this.displayMode=="list") {
			this.setListMode();
		}
	},
	onClickDisplaySwitch : function(evt) {
		var self = this;
		var target = evt.target;
		if($(target).hasClass("md-tile")) {
			this.displayMode = "tile";
			self.setTileMode();
		} else if($(target).hasClass("md-list")) {
			this.displayMode = "list";
			self.setListMode();
		}
		//fixHeight用イベント
		$(".items", self.elem).trigger("refreshFH");
		//ディスプレイモードをクッキーに登録
		this._cookie.writeConfig();
	},
	setTileMode : function() {
		$(".btn.display-switch",this.elem).removeClass("active");
		$(".btn.display-switch.md-tile",this.elem).addClass("active");
		$(this.elem).removeClass("md-list").addClass("md-tile");
	},
	setListMode : function() {
		$(".btn.display-switch",this.elem).removeClass("active");
		$(".btn.display-switch.md-list",this.elem).addClass("active");
		$(this.elem).removeClass("md-tile").addClass("md-list");
	},
	setDefaultFilter : function() {
		if($.type(this.defaultFilter)=="object") {
			this.defaultFilter = [this.defaultFilter];
		} else if(!this.defaultFilter) {
			this.defaultFilter = [];
		}
		if(this.defaultFilter[0] && this.defaultFilter[0].type) {
			//this.defaultFilter：Arrayオブジェクト
			for(var i=0; i<this.defaultFilter.length; i++) {
				this.filter(this.defaultFilter[i].type,this.defaultFilter[i].word,this.defaultFilter[i].sign);
			}
		}
		return this;
	},
	setDefaultExclude : function() {
		if($.type(this.defaultExclude)=="object") {
			this.defaultExclude = [this.defaultExclude];
		} else if(!this.defaultExclude) {
			this.defaultExclude = [];
		}
		if(this.defaultExclude[0] && this.defaultExclude[0].type) {
			//this.defaultExclude：Arrayオブジェクト
			for(var i=0; i<this.defaultExclude.length; i++) {
				this.exclude(this.defaultExclude[i].type,this.defaultExclude[i].word);
			}
		}
		return this;
	},
	setFilter : function() {
		var self = this;
		//絞り込み
		$(".navi-filter", self.elem).each(function() {
			var filterTarget = self._utility.pickupWords($(".active",this),"md-filter-");
			var filterOrder = self._utility.pickupWords($(".active",this),"md-order-");
			var filterSign = {};
			for(var i=0; i<filterOrder.length; i++) {
				//「範囲絞り込み」が設定されていると「filterSign」が生成される
				if(filterOrder[i].indexOf("range-") == 0) {
					filterSign = {
						signType : "range",
						signOrder : filterOrder[i].replace("range-","").split("-")
					};
				} else if(filterOrder[i].indexOf("gt-") == 0) {
					filterSign = {
						signType : "gt",
						signOrder : Number(filterOrder[i].replace("gt-",""))
					};
				} else if(filterOrder[i].indexOf("lt-") == 0) {
					filterSign = {
						signType : "lt",
						signOrder : Number(filterOrder[i].replace("lt-",""))
					};
				}
				self.filter(filterTarget,filterOrder,filterSign);
			}
		});
	},
	/*------------------------------------------------*/
	//【並び替えの優先順位（1>3）】
	// 1. 並び替えボタン
	// 2. options.defaultSort
	// 3. Items.setDefaultSort
	/*------------------------------------------------*/
	setSort : function() {
		var self = this;
		//Items.setDefaultSort
		if(this.setDefaultSort && this.defaultSort.type!="default") {
			this.setDefaultSort();
		}
		//デフフォルトの設定で並び替え
		if(this.defaultSort.type && this.defaultSort.type!="default" && this.defaultSort.order) {
			this.sort(this.defaultSort.type,this.defaultSort.order);
		} else if(this.defaultSort.type=="default" && this.defaultSort.order=="desc") {
			this.selectedItems.reverse();
		}
		//「並び替えボタン」に合わせて並び替え
		if($(".navi-sort", this.elem).length) {
			$(".navi-sort", this.elem).each(function() {
				var sortTarget = self._utility.pickupWords($(".active",this),"md-sort-");
				var sortOrder = self._utility.pickupWords($(".active",this),"md-order-");
				self.sort(sortTarget[0],sortOrder[0]);
			});
		}
	},
	setPagerLength : function() {
		//ページの長さを設定
		this.pagerLength = Math.ceil(this.selectedItems.length / this.displayLength);
		return this;
	},
	output : function() {
		//イベントハンドラにthis（Itemsオブジェクト）を渡す
		var self = this;
		//ギャラリーをfadeOut（非表示）させる
		$(".items, "+self.pager, this.elem).fadeOut(this.fadeSpeed);
		//fadeOut（非表示）アニメーションが完了したら実行される
		$.when(this.elem).done(function(){
			//アイテムの表示をリセット
			$(".items", self.elem).html("");
			/*----------------------------------------------------------------*/
			// それぞれのジャンルのアウトプットメソッドを実行
			// メソッド名は「output＋ジャンル名(大文字＋「_」除外)」
			// 例）outputCR, outputCPRUG
			/*----------------------------------------------------------------*/
			var a = "output"+String(self.genre).toUpperCase().replace("_","");
			if(self[a]) {self[a]();} else {console.log("「Items.prototype."+a+"」が未設定です。")}
			//ローディングを削除
			$(".loading-box", self.elem).remove();
			//ギャラリーをfadeIn（表示）させる
			$(".items, "+self.pager, self.elem).fadeIn(self.fadeSpeed);
			//「jquery.fixHeight.js」が読み込まれていたら
			if($.fn.fixHeight) {
				var elem = $(self.elem).is(".items") ? $(self.elem) : $(".items", self.elem);
				$(elem).fixHeight({
					column:4,
					fhTarget:".item"
				});
			}
			self._cookie.writeHistory();
		});
		return this;
	},
	outputNoItems : function() {
		$(".items-length", this.elem).html(this.selectedItems.length + "アイテム");
		$(".items", this.elem).html("<p class='t16 t-center t-gray666 pb10'>お探しの商品はありません。</p>");
		$(this.pager, this.elem).html("");
		return this;
	},
	outputItemsLength : function(startNum,endNum,txtNote) {
		endNum = endNum<this.selectedItems.length ? endNum : this.selectedItems.length;
		//アイテム件数の表示
		$(".items-length", this.elem).html(this.selectedItems.length + "アイテム中、" + (startNum+1) + "-" + endNum + "件を表示"+(txtNote ? txtNote : "<span class='t-supplement ml20 sp-block sp-ml00 sp-mt05'>(※表示価格は税込価格)</span>"));
		return this;
	},
	pagerOutput : function() {
		var self = this;
		var displayedPagerLength = 0
		$(self.pager, self.elem).html("").append("<ul>");
		for(var i = 0; i < self.pagerLength; i++) {
			if(self.pagerLength!=1) {
				$(self.pager+" > ul", self.elem).append($("<li>").append(
					$("<a>").attr("href","#").addClass("pager-btn page"+(i+1)+" no-smooth").html(i+1)
				));
			}
			displayedPagerLength++;
			//ページャーは10件までしか表示しない
			if(self.currentPage>5 && i<self.currentPage-5 && i<self.pagerLength-10) {
				$(self.pager+" > ul li:last-child", self.elem).remove();
				displayedPagerLength--;
			}
			if(displayedPagerLength > 10) {
				$(self.pager+" > ul li:last-child", self.elem).remove();
			}
		}
		if(self.currentPage!=0) {
			$(self.pager+" > ul", self.elem).prepend($("<li>").append(
				$("<a>").attr("href","#").addClass("pager-btn prev no-smooth").html("&laquo; 前へ")
			));
		}
		if(self.currentPage!=self.pagerLength-1) {
			$(self.pager+" > ul", self.elem).append($("<li>").append(
				$("<a>").attr("href","#").addClass("pager-btn next no-smooth").html("次へ &raquo;")
			));
		}
		$(self.pager+" > ul a", self.elem).on("click", function(evt) {
			self.onPagerClick(evt);
			return false;
		});

		//選択されているページャーボタンにクラスactiveを追加
		var a = self.currentPage+1
		$(self.pager+" .page"+a, self.elem).addClass("active");
	},
	onPagerClick : function(evt) {
		var self = this;
		//ページャークリックで呼び出される関数
		//表示箇所を登録
		if($(evt.target).hasClass("prev")) {
			self.currentPage = self.currentPage-1;
		} else if($(evt.target).hasClass("next")) {
			self.currentPage = self.currentPage+1;
		} else {
			self.currentPage = $(evt.target).html()-1;
		}
		self.pagerClickScroll();
		//ページの長さを設定
		self.setPagerLength();
		//表示
		self.output();
	},
	pagerClickScroll : function() {
		var self=this;
		//「表示順」メニューの位置までスクロールで戻す
		var posTarget;
		if($(".item-navi .navi-sort",this.elem).length) {
			posTarget = $(".item-navi .navi-sort",this.elem);
		} else {
			posTarget = $(this.elem);
		}
		var sortMenuPos = $(posTarget).offset().top-40;
		var scrollSpace = $("body,html").scrollTop()-sortMenuPos;
		if(scrollSpace>200 || scrollSpace<-400) {
			$("body,html").animate({
				scrollTop: sortMenuPos
			}, 600);
		}
	},
	resetFilterBtn : function() {
		var self=this;
		$(".reset-filter").on("click",function() {
			$(".navi-filter").each(function() {
				$(".md-order-all",this).trigger("click");
			});
			$(".navi-sort").each(function() {
				$(".btn.sort:first-child",this).trigger("click");
			});
			return false;
		});
		return this;
	},
	filter : function(key, word, sign) {
		//.md-filter-allならそのまま返す
		if(word=="all") { return this; }
		if($.type(word)=="string") { word=[word]; }
		if($.type(key)=="string" || $.type(key)=="number") { key=[key]; }
		var a = this.selectedItems.length;
		for(var i=0; i<a; i++) {
			var item = this.selectedItems[0];
			var flag = false;
			//検索項目(filter)：Arrayオブジェクト
			for(var j=0; j<key.length; j++) {
				var itemWord = item[key[j]];
				if($.type(itemWord)!="array") { itemWord = [$.trim(itemWord)]; }
				// filterが「url」の場合、targetワードの「#」以下は検索対象外
				if(key[j]=="url" && String(itemWord[0]).indexOf("#")>=0) {
					itemWord = [String(itemWord[0]).slice(0,String(itemWord[0]).indexOf("#"))];
				}
				if(word) {
					//検索文字列（word）：Arrayオブジェクト
					for (var k=0;k<word.length;k++) {
						var thisWord = String(word[k]);
						//検索対象の値(targetItem[filter])：Arrayオブジェクト
						if($.inArray(thisWord, itemWord)>=0) { flag=true; }
					}
				}
				//「範囲絞り込み」設定がある場合
				if(sign) { filterSign(itemWord,sign); }
			}
			if(flag) { this.selectedItems.push(item); }
			this.selectedItems.shift();
		}
		return this;
		//「範囲絞り込み」フィルター用関数
		function filterSign(target,sign) {
			/*----------------------------------------*/
			// sign : { signType:"gt", signOrder:10 }
			// sign : { signType:"range", signOrder:[10,30]または"10-30" }
			/*----------------------------------------*/
			$(target).each(function(){
				var q;
				switch(sign.signType) {
					//「範囲絞り込み」設定の場合
					case "range" :
						if($.type(sign.signOrder)=="string") { sign.signOrder=String(sign.signOrder).split("-"); }
						q = (Number(this) >= Number(sign.signOrder[0])) && (Number(this) <= Number(sign.signOrder[1]));
						break;
					//「～以上絞り込み」設定の場合
					case "gt" :
						q = (Number(this) >= sign.signOrder);
						break;
					//「～以下絞り込み」設定の場合
					case "lt" :
						q = (Number(this) <= sign.signOrder);
						break;
				}
				if(q) { flag=true; return; }
				return;
			});
		}
	},
	exclude : function(key, word) {
		//.md-exclude-allならすべて除外
		if(word=="all") { this.selectedItems=[]; return; }
		if($.type(word)=="string") { word=[word]; }
		if($.type(key)=="string" || $.type(key)=="number") { key=[key]; }
		var a = this.selectedItems.length;
		for(var i=0; i<a; i++) {
			var item = this.selectedItems[0];
			var flag = false;
			//検索項目(filter)：Arrayオブジェクト
			for(var j=0; j<key.length; j++) {
				var itemWord = item[key[j]];
				if($.type(itemWord)!="array") { itemWord = [$.trim(itemWord)]; }
				// filterが「url」の場合、targetワードの「#」以下は検索対象外
				if(key[j]=="url" && String(itemWord[0]).indexOf("#")>=0) {
					itemWord = [String(itemWord[0]).slice(0,String(itemWord[0]).indexOf("#"))];
				}
				if(word) {
					//検索文字列（word）：Arrayオブジェクト
					for (var k=0;k<word.length;k++) {
						var thisWord = String(word[k]);
						//検索対象の値(targetItem[filter])：Arrayオブジェクト
						if($.inArray(thisWord, itemWord)>=0) { flag=true; }
					}
				}
			}
			if(!flag) { this.selectedItems.push(item); }
			this.selectedItems.shift();
		}
		return this;
	},
	sort : function(req,type) {
		var self = this;
		var util = self._utility;
		var sortArr = [];
		for (var i=0; i<this.selectedItems.length; i++) {
			sortArr[i] = { sortKey:i, obj:this.selectedItems[i] };
		}
		sortArr.sort(
			function(a,b){
				var aVal = a.obj[req];
				var bVal = b.obj[req];
				if($.type(aVal)=="array") { aVal=aVal[0]; }
				if($.type(bVal)=="array") { bVal=bVal[0]; }
				if( util.isNum(aVal) ) { aVal=Number(aVal); } else { aVal=encodeURI(aVal); }
				if( util.isNum(bVal) ) { bVal=Number(bVal); } else { bVal=encodeURI(bVal); }
				//ソート処理
				//数字でなければ、後ろへ
				if(!util.isNum(aVal)) { return 1; } else if(!util.isNum(bVal))  { return -1; }
				if( aVal < bVal ) {
					if(type=="asc") { return -1; } else if(type=="desc") { return 1; }
				}
				if( aVal > bVal ) {
					if(type=="asc") { return 1; } else if(type=="desc") { return -1; }
				}
				//return 0;
				return a.sortKey-b.sortKey;
			}
		);
		for (var i=0; i<this.selectedItems.length; i++) {
			this.selectedItems[i] = sortArr[i].obj;
		}
		return this;
	},
	culcPrice : function() {
		var self = this;
		var util = self._utility;
		$(this.selectedItems).each(function() {
			if(util.isSet(this.price)) { return; }
			if(util.isSet(this.makerPrice) && util.isSet(this.discountRate)) {
				this.price = util.discountPrice(this.makerPrice,this.discountRate);
			}
		});
		return this;
	},
};




var SL_Core = function(slObj) {
	this._sl = slObj;
};

SL_Core.prototype = {
	sort : function(req,type) {
		return this;
	},
	end : function() {
		return this._sl;
	}
};




var SL_Cookie = function(slObj) {
	this._sl = slObj;
}

SL_Cookie.prototype = {
	writeHistory : function() {
		var self = this;
		var sl = this._sl;
		//IEは、クッキーのパス設定で挙動がおかしいので弾く（ファイル単位で設定できない）
		if(sl._utility.ua.gtIE10 || sl._utility.ua.ltIE9) {return;}
		//jquery.cookie.jsが読み込まれていなければ弾く
		if(!$.cookie) {return;}
		//商品一覧ID
		var elemID = self.makeElemID(sl.elem).replace(".md-tile","").replace(".md-list","");
		sl.SLHistory = self.getHistory();
		if(!sl.SLHistory[elemID]) { sl.SLHistory[elemID]={}; }
		//ボタン設定
		var navis = $(sl.navi, sl.elem).find(".navi-filter, .navi-sort");
		sl.SLHistory[elemID]["activeBtns"] = [];
		$(navis).each(function() {
			var activeBtnID = self.makeElemID($(this).find(".active")).replace(".active","");
			sl.SLHistory[elemID]["activeBtns"].push({
				btnID : activeBtnID,
				btnTxt : $(activeBtnID,this).text()
			})
		});
		//ページャー設定
		sl.SLHistory[elemID]["currentPage"] = sl.currentPage;
		//クッキーに書き込み
		$.cookie("SLHistory", JSON.stringify(sl.SLHistory), {
			expires : 1,
			path : location.pathname
		});
		return this;
	},
	initHistory : function() {
		var self = this;
		var sl = this._sl;
		//IEは、クッキーのパス設定で挙動がおかしいので弾く（ファイル単位で設定できない）
		if(sl._utility.ua.gtIE10 || sl._utility.ua.ltIE9) {return;}
		sl.SLHistory = self.getHistory();
		return this;
	},
	applyBtnHistory : function() {
		var self = this;
		var sl = this._sl;
		if(!sl.SLHistory) {return;}
		var thisHistory = sl.SLHistory[self.makeElemID(sl.elem)];
		if(!thisHistory) {return;}

		//ボタン履歴の適用
		var btnArr = thisHistory.activeBtns;
		if(btnArr) {
			var navis = $(sl.navi, sl.elem).find(".navi-filter, .navi-sort");
			if(btnArr.length!=0 && btnArr.length==navis.length) {
				$(navis).find(".active").removeClass("active").end().each(function(i) {
					if(!$(btnArr[i].btnID, this).length) { sl.SLHistory={}; return; }
					$(btnArr[i].btnID, this).addClass("active");
				});
			}
		}
		return this;
	},
	applyPagerHistory : function() {
		var self = this;
		var sl = this._sl;
		if(!sl.SLHistory) {return;}
		var thisHistory = sl.SLHistory[self.makeElemID(sl.elem)];
		if(!thisHistory) {return;}
		//ページャー履歴の適用
		var pageNum = thisHistory.currentPage;
		if(pageNum>0 && pageNum<sl.pagerLength) {
			sl.currentPage = pageNum;
			//sl.output();
		}
		return this;
	},
	writeConfig : function() {
		var self = this;
		var sl = this._sl;
		if($.cookie) {
			//ディスプレイモード設定
			sl.SLConfig["displayMode"] = sl.displayMode;
			//クッキーに書き込み
			$.cookie("SLConfig", JSON.stringify(sl.SLConfig), {
				expires : 7,
				path : (sl._utility.ua.gtIE10 || sl._utility.ua.ltIE9) ? "" : "/"
			});
		}
		return this;
	},
	applyConfig : function() {
		var self = this;
		var sl = this._sl;
		if($.cookie) {
			//ディスプレイモードの適用
			if($(".navi-display", sl.elem).length) {
				sl.setDisplayMode();
			}
		}
		return this;
	},
	getHistory : function() {
		var c = {};
		if($.cookie && $.cookie("SLHistory")) {
			try {
				c = $.parseJSON($.cookie("SLHistory"));
			} catch(e) {
				sl.SLHistory = {};
				console.log(e);
			}
		}
		return c;
	},
	getConfig : function() {
		var c = {};
		if($.cookie && $.cookie("SLConfig")) {
			try {
				c = $.parseJSON($.cookie("SLConfig"));
			} catch(e) {
				sl.SLHistory = {};
				console.log(e);
			}
		}
		return c;
	},
	makeElemID : function(elem) {
		var id = $(elem).attr("id");
		var elemClass = String($(elem).attr("class")).replace(" md-tile","").replace(" md-list","");
		elemClass = $.trim(elemClass).replace(/ /g,".");
		return (id ? "#"+id : "") + (elemClass ? "."+elemClass : "");
	},
	end : function() {
		return this._sl;
	}
};






var SL_Utility = function() {
};

SL_Utility.prototype = {
	//elem要素内の「.active」クラスがある要素の中に
	//keyから始まるクラスが有るか調べて、有ればkey以降の文字列を配列で返す
	pickupWords : function(elem,key) {
		if(!$(elem).attr("class")) {return;}
		var arr = $(elem).attr("class").split(" ");
		var words = [];
		for(var i in arr) {
			if(arr[i].indexOf(key) >= 0) {
				words.push(arr[i].replace(key,""));
			}
		}
		return words;
	},

	//CSV商品データのkeyの項目が設定されているか？
	isSet : function(key,word) {
		if($.type(key)!="array") {
			key = $.trim(key);
			if(key && key!="-" && key!="") {
				return true;
			} else {
				return false;
			}
		} else {
			if(word) {
				if($.type(word)=="array") {
					var flag=false;
					$(word).each(function() {
						if($.inArray(String(this),key)>=0) {
							flag=true;
						}
					});
					return flag;
				} else if($.inArray(word,key)>=0) {
					return true;
				} else {
					return false;
				}
			} else if(!word && key.length && key[0]!="" && key[0]!="-") {
				return true;
			} else {
				return false;
			}
		}
	},
	isNum : function(a) {
		return !isNaN(Number(a));
	},
	taxPrice : function(price,taxRate) {
		return Math.floor(Number(price)*(1+Number(taxRate)));
	},
	untaxPrice : function(price,taxRate) {
		return Math.ceil(Number(price)/(1+Number(taxRate)));
	},
	putCommas : function(num) {
		return String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
	},

	/*=============================================================
	// ユーザエージェント条件分岐便利スニペット
	// 以下は用途に合わせて必要な部分のみを使えばよいと思う

	if(_ua.ltIE6){
		//IE6以下での処理
	}else if(_ua.ltIE7){
		//IE7以下での処理
	}else if(_ua.ltIE8){
		//IE8以下での処理
	}else if(_ua.Trident && !_ua.ltIE8){
		//IE9での処理
	}else if( (_ua.Trident && !_ua.ltIE9 ) || _ua.gtIE10){
		//IE10以上での処理★ IE11 で試したところ「IE9」と表示される
	}else if(_ua.Blink && !_ua.Mobile){
		//デスクトップ版Chrome/Operaでの処理
	}else if(_ua.Blink && _ua.Mobile){
		//Chrome for Androidでの処理
		if(_ua.ltAd4_4){
			//Chrome for Android（バージョン Android4.4未満）での処理
		}
	}else if(_ua.Webkit && !_ua.Mobile){
		//デスクトップ版Safariでの処理
	}else if(_ua.Webkit && _ua.Mobile){
		//モバイルでWebkitベースでの処理
		if(_ua.ltAd4_4){
			//モバイルでWebkitベース（バージョン Android4.4未満）での処理
		}
	}else if(_ua.Gecko && !_ua.Mobile){
		//デスクトップ版Firefoxでの処理
	}else if(_ua.Gecko && _ua.Mobile){
		//モバイル版Firefoxでの処理
	}else if(_ua.Presto){
		//旧Presto OperaまたはOpera Miniでの処理
	}
	=============================================================*/
	ua : {
		ltIE6 : typeof window.addEventListener == "undefined" && typeof document.documentElement.style.maxHeight == "undefined",
		ltIE7 : typeof window.addEventListener == "undefined" && typeof document.querySelectorAll == "undefined",
		ltIE8 : typeof window.addEventListener == "undefined" && typeof document.getElementsByClassName == "undefined",
		ltIE9 : document.uniqueID && typeof window.matchMedia == "undefined",
		gtIE10 : document.uniqueID && window.matchMedia,
		Trident : document.uniqueID,
		Gecko : 'MozAppearance' in document.documentElement.style,
		Presto : window.opera,
		Blink : window.chrome,
		Webkit : typeof window.chrome == "undefined" && 'WebkitAppearance' in document.documentElement.style,
		Touch : typeof document.ontouchstart != "undefined",
		Mobile : typeof window.orientation != "undefined",
		ltAd4_4 : typeof window.orientation != "undefined" && typeof(EventSource) == "undefined",
		Pointer : window.navigator.pointerEnabled,
		MSPoniter : window.navigator.msPointerEnabled
	},

	/*--- スネークケースをキャメルケースにする ---*/
	// 引数 p = foo_bar
	// 返値 文字列(fooBar)
	fSnakeToCamel : function(p) {
		//「_」＋小文字を大文字にする(例:_a を A)
		return p.replace(/_./g, function(s) {
			return s.charAt(1).toUpperCase();
		});
	},

	/*--- キャメルケースをスネークケースにする ---*/
	// 引数 p = fooBar
	// 返値 文字列(foo_bar)
	fCamelToSnake : function(p) {
		//大文字を_+小文字にする(例:A を _a)
		return p.replace(/([A-Z])/g, function(s) {
			return '_' + s.charAt(0).toLowerCase();
		});
	},

	/*--- ハイフンケースをパスカルケースにする ---*/
	// 引数 p = foo-bar
	// 返値 文字列(FooBar)
	fHyphenToPascal : function(p) {
		p = String(p).charAt(0).toUpperCase()+ String(p).slice(1);
		//「-」＋小文字を大文字にする(例:_a を A)
		return p.replace(/-./g, function(s) {
			return s.charAt(1).toUpperCase();
		});
	}
};
