
var DataSelect = function() {
	this._utility = new DS_Utility();
	this.fileUrl = ""; //取得するファイルのURL
	this.keyArray = []; //文字列を配列に分割格納したい項目
	this.category = ""; //指定するカテゴリ
	this.itemKey = []; //アイテムの項目名
	this.items = []; //全アイテム
	this.selectedItems = []; //カテゴリに合致するアイテム
	this.defaultFilter = [];
	this.defaultExclude = [];
	this.defaultSort = [];
	this.ignoreShowFlag = false;
};



DataSelect.prototype = {
	openData : function(options,func) {
		var util = this._utility;
		var options = $.extend({
			genre:"",
			obj:false,
			url:"",
			keyArray:[],
			fileType:"csv",
			async : true,
			ignoreShowFlag:false,
			errorFunc:function() {},
		}, options);
		var self=this;
		if(util.isSet(options.genre)) {
			try {
				this.fileUrl = commonConfig.selectLineup[options.genre].fileUrl;
				this.keyArray = commonConfig.selectLineup[options.genre].keyArray;
			} catch(e) {
				console.log("「/js/common.js」を読み込んでください。");
			}
		} else if(options.obj) {
			this.fileUrl = options.obj.fileUrl;
			this.keyArray = options.obj.keyArray;
		} else {
			this.fileUrl = options.url;
			this.keyArray = options.keyArray;
		}
		this.ignoreShowFlag = options.ignoreShowFlag;
		if(options.fileType=="csv") {
			$(this.loadCsv(this.fileUrl)).on("doneLoadCsv",function() {
				func.apply(this,[this]);
				return this;
			});
		} else if(options.fileType=="txt"||options.fileType=="text"||options.fileType=="html") {
			$.ajax({
				url : self.fileUrl,
				cache : true,
				dataType : "html",
				async : options.async,
				error : function(e){
					options.errorFunc.apply(self,[e]);
				},
				success : function(htmlTxt,status,xhr){
					func.apply(self,[htmlTxt]);
					return this;
				}
			});
		} else if(options.fileType=="script") {
			$.ajax({
				url : self.fileUrl,
				cache : true,
				dataType : "script",
				async : options.async,
				error : function(e){
					options.errorFunc.apply(self,[e]);
				},
				success : function(script,status,xhr){
					func.apply(self,script);
					return this;
				}
			});
		}
		return this;
	},
	loadCsv : function(url) {
		var self=this;
		this.fileUrl = url;
		this.df = $.Deferred();
		this.ajax(this.fileUrl);
		this.df.done(function() {
			self.selectItems();
			$(self).triggerHandler("doneLoadCsv");
		});
		return this;
	},
	ajax : function(fileUrl) {
		$.ajax({
			url : fileUrl,
			cache : true,
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
		return this;
	},
	onError : function() {
	},
	onLoad : function() {
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
							val[i] = $.trim(String(this).replace(/\/\[,\]\//g,",").replace(/""/g,'"'));
						});
					} else {
						val = $.trim(String(val).replace(/\/\[,\]\//g,",").replace(/""/g,'"'));
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
		for(var i=0;i<this.items.length;i++) {
			//アイテムのshowFlagが0なら除外
			if(this.ignoreShowFlag==true || this.items[i].showFlag!=0) {
				this.selectedItems.push(this.items[i]);
			}
		}
		//optionで設定した「filter(defaultFilter)」「exclude(defaultExclude)」の処理
		if(this.defaultFilter!=[]) { this.setFilter(this.defaultFilter); }
		if(this.defaultExclude!=[]) { this.setExclude(this.defaultExclude); }
		this.setSort();
		return this;
	},
	setSelectedItems : function(items) {
		this.selectedItems = $.extend(true,[],items);
		return this;
	},
	backupSelectedItems : function() {
		this.items = $.extend(true,[],this.selectedItems);
		return this;
	},
	resetFilter : function() {
		this.selectedItems = $.extend(true,[],this.items);
		return this;
	},
	setFilter : function(filterMap) {
		var self=this;
		/*
		if(this.selectedItems.length===0 && this.items.length!==0) {
			this.selectedItems = $.extend(true,[],this.items);
		}
		*/
		//-------------------------------------------
		// filterMap {
		// 		type:"foo",
		// 		word:"bar",
		// 		sign:{signType:"range",signOrder:[10,30]}	※任意
		// }
		//-------------------------------------------
		if($.type(filterMap)=="object") {
			filterMap = [filterMap];
		} else if(!filterMap) {
			filterMap = [];
		}
		if(filterMap[0] && filterMap[0].type) {
			$(filterMap).each(function(i) {
				if(this.sign) {
					self.filter(this.type,this.word,this.sign);
				} else {
					self.filter(this.type,this.word);
				}
			});
		}
		return this;
	},
	setExclude : function(excludeMap) {
		if($.type(excludeMap)=="object") {
			excludeMap = [excludeMap];
		} else if(!excludeMap) {
			excludeMap = [];
		}
		if(excludeMap[0] && excludeMap[0].type) {
			for(var i=0; i<excludeMap.length; i++) {
				this.exclude(excludeMap[i].type,excludeMap[i].word);
			}
		}
		return this;
	},
	/*------------------------------------------------*/
	//【並び替えの優先順位（1>3）】
	// 1. 並び替えボタン
	// 2. options.defaultSort
	// 3. Items.setDefaultSort
	/*------------------------------------------------*/
	setSort : function(sortMap) {
		var self = this;
		if(sortMap) {
			this.sort(sortMap.type,sortMap.order);
		} else {
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
		}
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
				if( isNaN(Number(aVal)) ) { aVal=encodeURI(aVal); } else { aVal=Number(aVal); }
				if( isNaN(Number(bVal)) ) { bVal=encodeURI(bVal); } else { bVal=Number(bVal); }
				//ソート処理
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
	countLength : function(key) {
		var util=this._utility;
		var num=0;
		$(this.selectedItems).each(function() {
			var targetLength=this[key];
			if(util.isNum(targetLength)) {
				num+=Number(targetLength);
			}
		});
		return num;
	},
};







var DS_Utility = function() {
	this.dir = this.fUrlToDir(location.pathname);
	this.path = $.trim(location.pathname).replace("index.html","").replace("index.htm","").replace("index.php","");
	this.pathArr = String(this.path).split("/");
	this.htmlName = this.pathArr[this.pathArr.length-1];
	this.fileName = (this.htmlName!="") ? String(this.htmlName).replace(".html","") : "index";
	this.hash = location.hash;
	this.paramStr = location.search.substring(1);
	var obj = {};
	$(this.paramStr.split("&")).each(function() {
		var a = this.split("=");
		obj[a[0]] = a[1];
	});
	this.params = obj;
};

DS_Utility.prototype = {
	initConfig : function(genreConfig) {
		var config;
		try {
			if(genreConfig) {
				config = $.extend(true,$.extend(true,{},commonConfig),genreConfig);
			} else {
				config = commonConfig;
			}
		} catch(e) {}
		return config;
	},
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
	//objの中から、arr内の値をキーとするものをピックアップし、配列で返す
	pickupItem : function(obj,arr) {
		if($.type(obj)!="object") {return;}
		var items = [];
		$(arr).each(function() {
			var key = String(this);
			if(obj[key]) {
				items.push(obj[key]);
			}
		});
		return items;
	},

	//CSV商品データのkeyの項目が設定されているか？
	isSet : function(key,word) {
		if(!word) {
			// wordが設定されていなければ
			if($.type(key)!="array") {
				key = $.trim(key);
				if(key && key!="-" && key!="") { return true; } else { return false; }
			} else if(key.length && key[0]!="" && key[0]!="-") {
				return true;
			} else {
				return false;
			}
		} else {
			// wordが設定されていたら
			if($.type(key)!="array") {
				if($.type(word)=="array") {
					var flag=false;
					$(word).each(function() {
						if(String(this)==key) { flag=true; }
					});
					return flag;
				} else {
					if(word==key) { return true; }
				}
			} else {
				if($.type(word)=="array") {
					var flag=false;
					$(word).each(function() {
						if($.inArray(String(this),key)>=0) { flag=true; }
					});
					return flag;
				} else if($.inArray(word,key)>=0) {
					return true;
				} else {
					return false;
				}
			}
		}
	},
	// 値が「true」を示すものか？
	isTrue : function(val) {
		if(!this.isSet(val) || val=="0" || val=="false" || val==false) {
			return false;
		} else {
			return true;
		}
	},
	//「{{◯◯◯}}」で囲った部分の文字列を
	//「replacements」で指定した文字列に置換する
	// ※現時点では、入れ子は不可
	replaceWords : function(options) {
		var options = $.extend({
			htmlTxt : "",
			replacements : {}
		}, options);
		var self = this;
		var htmlTxt = options.htmlTxt;
		var keys = htmlTxt.match(/{{*(.*?)}}*/g);
		var hasReplacements = Object.keys(options.replacements).length;
		$(keys).each(function() {
			var key = this.replace(/{{|}}/g,"");
			var defaultEmpty = false;
			// keyが「$」で始まっている時は、デフォルトの文字列を表示しない
			if(key.slice(0,1)=="$") { defaultEmpty = true; }
			//置換設定がある時
			if(hasReplacements){
				var txt = options.replacements[key];
				if(txt) {
					htmlTxt = htmlTxt.replace(this, txt);
				} else {
					htmlTxt = htmlTxt.replace(this, defaultEmpty?"":key);
				}
			//置換設定がない時
			} else {
				htmlTxt = htmlTxt.replace(this, defaultEmpty?"":key);
			}
		});
		return htmlTxt;
	},
	selectMap : function(val,map,options) {
		var options = $.extend({
			key : ""
		}, options);
		var obj = "";
		$(map).each(function() {
			var mapVal;
			if(options.key=="") {
				mapVal=this.val;
			} else {
				mapVal=this[options.key];
			}
			if(mapVal) {
				if(mapVal==val) { obj=this; }
			} else if(this.list) {
				$(this.list).each(function() {
					if(this.val==val) { obj=this; }
				});
			}
		});
		return obj;
	},
	countMapLength : function(map,filter) {
		var ds = new DataSelect();
		ds.items = map;
		ds.setFilter(filter);
		return ds.selectedItems.length;
	},

	pickupGroupName : function(groupMap) {
		if($.type(groupMap)!="array") {return;}
		var items = [];
		var key = "group";
		$(groupMap).each(function() {
			if(this[key]) {
				items.push(this[key]);
			}
		});
		return items;
	},
	makeGroupMap : function(options) {
		var options = $.extend({
			data : [],
			//どの項目でグループ分けするか？
			groupKey : "",
			//valに代入したい項目(キー)を設定する。
			makeVal : false
		}, options);
		var map = [];
		$(options.data).each(function(i) {
			var self=this;
			var groupVal = self[options.groupKey];
			if(options.makeVal && $.type(options.makeVal)=="string") { self.val=self[options.makeVal]; }
			var obj = { group:groupVal, list:[self] };
			if(map.length==0) {
				map.push(obj);
			} else {
				var flag=true;
				$(map).each(function() {
					if(this.group==groupVal) {
						this.list.push(self);
						flag=true;
						return;
					} else {
						flag=false;
					}
				});
				if(!flag) { map.push(obj); }
			}
		});
		return map;
	},
	isNum : function(a) {
		return !isNaN(Number(a));
	},
	taxPrice : function(price,taxRate) {
		if(!this.isNum(price)) { return price; }
		return Math.floor(Number(price)*(1+Number(taxRate)));
	},
	untaxPrice : function(price,taxRate) {
		if(!this.isNum(price)) { return price; }
		return Math.ceil(Number(price)/(1+Number(taxRate)));
	},
	putCommas : function(num) {
		if(!this.isNum(num)) { return num; }
		return String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
	},
	discountPrice : function(price,discountRate,options) {
		if(!this.isNum(price)) { return price; }
		var options = $.extend({
			type : ""
		}, options);
		if(options.type=="" || options.type=="basic") {
			return Math.ceil(Number(price)*(Number(discountRate)/100)/10)*10;
		}
	},
	culcPrice : function(items,options) {
		var self = this;
		var options = $.extend({
			price : "price",
			makerPrice : "makerPrice",
			discountRate : "discountRate",
		}, options);
		$(items).each(function() {
			if(self.isSet(this[options.price])) { return; }
			if(self.isSet(this[options.makerPrice]) && self.isSet(this[options.discountRate])) {
				this[options.price] = self.discountPrice(this[options.makerPrice],this[options.discountRate]);
			}
		});
		return items;
	},


	/*=============================================================
	// ユーザエージェント条件分岐便利スニペット
	// 以下は用途に合わせて必要な部分のみを使えばよいと思う

	if(ua.ltIE6){
		//IE6以下での処理
	}else if(ua.ltIE7){
		//IE7以下での処理
	}else if(ua.ltIE8){
		//IE8以下での処理
	}else if(ua.Trident && !ua.ltIE8){
		//IE9での処理
	}else if( (ua.Trident && !ua.ltIE9 ) || ua.gtIE10){
		//IE10以上での処理★ IE11 で試したところ「IE9」と表示される
	}else if(ua.Blink && !ua.Mobile){
		//デスクトップ版Chrome/Operaでの処理
	}else if(ua.Blink && ua.Mobile){
		//Chrome for Androidでの処理
		if(ua.ltAd4_4){
			//Chrome for Android（バージョン Android4.4未満）での処理
		}
	}else if(ua.Webkit && !ua.Mobile){
		//デスクトップ版Safariでの処理
	}else if(ua.Webkit && ua.Mobile){
		//モバイルでWebkitベースでの処理
		if(ua.ltAd4_4){
			//モバイルでWebkitベース（バージョン Android4.4未満）での処理
		}
	}else if(ua.Gecko && !ua.Mobile){
		//デスクトップ版Firefoxでの処理
	}else if(ua.Gecko && ua.Mobile){
		//モバイル版Firefoxでの処理
	}else if(ua.Presto){
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


	fUrlToDir : function(url) {
		return $.trim(url).slice(0,String(url).lastIndexOf("/")+1);
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

	/*--- スネークケースをハイフンケースにする ---*/
	// 引数 p = foo_bar
	// 返値 文字列(foo-bar)
	fSnakeToHyphen : function(p) {
		return String(p).replace(/_./g, "-");
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

	/*--- キャメルケースをハイフンケースにする ---*/
	// 引数 p = fooBar
	// 返値 文字列(foo-bar)
	fCamelToHyphen : function(p) {
		//大文字を_+小文字にする(例:A を _a)
		return p.replace(/([A-Z])/g, function(s) {
			return '-' + s.charAt(0).toLowerCase();
		});
	},

	/*--- ハイフンケースをキャメルケースにする ---*/
	// 引数 p = foo-bar
	// 返値 文字列(fooBar)
	fHyphenToCamel : function(p) {
		//「-」＋小文字を大文字にする(例:-a を A)
		return p.replace(/-./g, function(s) {
			return s.charAt(1).toUpperCase();
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
	},

	/*--- ハイフンケースをスネークケースにする ---*/
	// 引数 p = foo-bar
	// 返値 文字列(FooBar)
	fHyphenToSnake : function(p) {
		p = String(p);
		//「-」＋小文字を大文字にする(例:_a を A)
		return p.replace(/-./g, function(s) {
			return '_' + s.charAt(1).toLowerCase();
		});
	},
};
