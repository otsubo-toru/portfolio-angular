
//---------------------------------------------------------------------------------------------------
// 【「jquery.fn.sendMitumori」独自イベント一覧 】
//
// 「failSubmit」：「見積もり」ボタンを押して、バリデーターに引っ掛かった時
// 「sendForm」：「見積もり」ボタンを押して、フォームが送信された直後
//
// ※イベントは「this(sendMitumoriを登録したjQueryオブジェクト)」に対して発火されます。
//---------------------------------------------------------------------------------------------------


(function($){
	$.fn.extend({
		sendMitumori : function(options){
			var self = this;
			//オプション設定（デフォルト値を予め設定しておく）
			var options = $.extend({
				// 元要素（指定要素すべて）
				elems : self,
				submitBtn : ".submit",
				errorClass : "is-error-validate",
				validateAlert : "validate-alert",
				dummyInput : "dummy-input",
				//----------------------------------------------------------
				// 項目名の連想配列
				// ※エラー時「○○は必須項目です。」などのように表示させるために使用。
				// 　無ければ「必須項目です。」などのように表示される。
				// nameList : { "pd_vendor":"メーカー名", "pd_color":"生地品番", ... }
				//----------------------------------------------------------
				nameList : {},
				opScroll : true,
				// カラー一覧の見積もりボタン。削除予定。使わないこと！
				//「colorClick」「colorBtn」
				colorClick : true,
				colorBtn : ".color-ck",
			}, options);
			return this.each(function () {
				var v = new MitumoriForm(this,options).init();
			});
		},
		MF_OptionList : function(options) {
			var self = this;
			//オプション設定（デフォルト値を予め設定しておく）
			var options = $.extend({
				// 元要素（指定要素すべて）
				elems : self,
				//----------------------------------------------------------
				// オプション部品一覧の配列
				// optionMap : [ {val:"foo", (colorMap:["a","b","c",...],) valueUnit:"コ" }, ... ]
				//----------------------------------------------------------
				optionMap : [],
				elemBody : ".option-list-body",
				toggleBtn : "[name=select_option]",
				headingTxt : "【オプション部品】",
				addItemBtnTxt : "さらにオプションを追加",
				//「オプション部品のみ注文」要素
				optionOnlyBtn : "[name=option_only]",
				// 「optionOnlyBtn」をONにした時に実行される関数
				fnOptionOnly : function() { return; },
				// 「optionOnlyBtn」をOFFにした時に実行される関数
				fnCancelOptionOnly : function() { return; },
				//----------------------------------------------------------
				// 1度選んだオプション・部品を重複して選べなくする
				// （selectの一覧から除外する）
				//----------------------------------------------------------
				optionUpdate : false,
			}, options);
			return this.each(function () {
				var o = new MF_OptionList(this,options).init();
			});
		},
		resetMitumoriForm : function(options) {
			//オプション設定（デフォルト値を予め設定しておく）
			var options = $.extend({}, options);
			return this.each(function () {
				var v = $(this).data("validate");
				v.resetForm(this).resetErrorAlert($("."+v.errorClass,this));
				$("."+v.validateAlert,this).remove();
			});
		},
		switchValidateClass : function(classHead,val) { return new MF_Utility().switchValidateClass(this,classHead,val); },
		fillSelectOptions : function(options) { return new MF_Utility().fillSelectOptions(this,options); },
		MF_FillColorImg : function(options) { return new MF_Utility().fillColorImg(this,options); },
	});
})(jQuery);







/*---------------------------------------------*/
/* 見積もりフォーム 基本動作                   */
/*---------------------------------------------*/
var MitumoriForm = function(elem,options) {
	this._utility = new MF_Utility(this);
	this.elem = elem;
	this.form = ($(this.elem).is("form")) ? this.elem : $("form",this.elem);
	this.elems = options.elems;
	this.otherElems = $(this.elems).not($(this.elem));
	this.submitBtn = options.submitBtn;
	this.errorClass = options.errorClass;
	this.validateAlert = options.validateAlert;
	this.dummyInput = options.dummyInput;
	this.nameList = options.nameList;
	this.opScroll = ($(this.submitBtn, this.elem).hasClass("md-no-opscroll"))?false:options.opScroll;
	this.submitCnt = 0;
	this.allItems;
	this.findAllItems();
	this.colorClick = options.colorClick;
	this.colorBtn = options.colorBtn;
};

MitumoriForm.prototype = {
	init : function() {
		var self=this;
		// resetForm：フォームをリセット
		// checkHtml：見積フォームのHTMLコードをチェック・整形
		// setLabelBtn：サムネイル付きラジオ選択ボタンの設定
		self.resetForm(self.elem).checkHtml().setLabelBtn();
		// カラー一覧の見積もりボタン。削除予定。使わないこと！
		if(self.colorClick){ $(self.colorBtn).on("click",function(evt) { self.onClickColorBtn(evt); }); }
		// 見積フォームのデータをセットする
		$(self.elem).data("validate",self);
		// フォームのサブミットボタンを押したら...
		$(self.submitBtn,self.form).on("click", function(evt) {
			self.onClickSubmitBtn(evt);
			return false;
		});
		return this;
	},
	//----------------------------------------------------
	//「見積フォーム」内のサブミットボタンを押したら...
	// 入力項目チェックをして、OKなら送信
	//----------------------------------------------------
	onClickSubmitBtn : function(e) {
		var self=this;
		var util=self._utility;
		$(self.findAllItems().allItems).off("change.runValidate").on("change.runValidate",function() {
			self.runValidate();
		});
		self.submitCnt++;
		//バリデートがOKなら、フォーム送信
		if(self.runValidate()) {
			if(!util.isInputNothing()) { self.sendForm(); }
		} else {
			self.failSubmit();
		}
		return this;
	},
	runValidate : function() {
		var self=this;
		var flag=true;
		//一度エラーをリセットする
		$(self.findAllItems().allItems).each(function() {
			self.resetErrorAlert(this);
		});
		/*----------------------------------------------------
		//  バリデータ処理
		// 「.validate」：バリデート掛けたい項目全てに設定する
		// 「.md-required」：必須項目
		// 「.md-validate-num」：半角数字のみ(自然数)
		// 「.md-validate-int」：半角数字のみ(整数)
		// 「.md-validate-1mm」：半角数字のみ(1mm単位)
		// 「.md-validate-5mm」：半角数字のみ(5mm単位)
		// 「.md-validate-1cm」：半角数字のみ(1cm単位)
		// 「.md-validate-5cm」：半角数字のみ(5cm単位)
		// 「.md-validate-10cm」：半角数字のみ(10cm単位)
		//「md-validate-range-◯◯-◯◯」：範囲チェック
		----------------------------------------------------*/
		//テキスト
		$("input:text.validate, textarea.validate",self.elem)
			.each(function() { self.validateTextInput(this); })
			.on("change.validateTextInput", function(){ self.validateTextInput(this); });
		//セレクトボタン
		$("select.validate",self.elem)
			.each(function() {self.validateSelectBtn(this)})
			.on("change.validateSelectBtn", function(){ self.validateSelectBtn(this); });
		//チェックボックス 未設定
//		$("input:checkbox.validate",this).each(function(){});
		//ラジオボタン
		self.validateRadioBtn();
		if($("."+self.errorClass, self.elem).length) { flag=false; }

		// 文字数制限
		if(!self.checkStrLimit()) { flag=false; }

		if(flag) { return true; } else { return false; }
	},
	stopValidate : function() {
		var self=this;
		//一度エラーをリセットする
		$(self.findAllItems().allItems).each(function() {
			self.resetErrorAlert(this);
		});
		$(self.findAllItems().allItems).off("change.runValidate");
		//テキスト
		$("input:text.validate, textarea.validate",self.elem).off("change.validateTextInput");
		//セレクトボタン
		$("select.validate",self.elem).off("change.validateSelectBtn");
		//チェックボックス 未設定
//		$("input:checkbox.validate",this).each(function() {});
		//ラジオボタン
		self.stopValidataRadioBtn();
		return this;
	},
	failSubmit : function() {
		var self = this;
		//該当の見積もりフォーム以外をリセットする
		this.resetOtherForms();
		alert("「お見積もりフォーム」のご入力に不備があります。");
		//「お見積もりフォーム」の位置までスクロールで戻す（デフォルト）
		if(this.opScroll && $("#MITUMORI_FORM").length) {
			var sortMenuPos = $("#MITUMORI_FORM").offset().top;
			$("body,html").animate({ scrollTop:sortMenuPos }, 600);
		}
		// 「failSubmit」イベントを発火
		$(this.elem).trigger("failSubmit");
		return this;
	},
	sendForm : function() {
		var self=this;
		// *** シリアル値をセット ***
		var now = new Date();
		$("[name='serial']").val(now * 1);
		// 「name=other」のインプット要素の「name」プロパティを消す（パラメーターから除外）
		var elemOther = $("[name=other]",this.elem).each(function() {
			$(this).data("mf-attr-name",$(this).attr("name")).removeAttr("name");
		});
		// 見積送信
		$(this.form).trigger("submit");
		alert("「お見積り」に追加しました。");
		// 「name=other」のインプット要素の「name」プロパティを元に戻す
		$(elemOther).each(function() {
			$(this).attr("name",$(this).data("mf-attr-name"));
		});
		//該当の見積もりフォームをリセットする
		this.resetForm(this.elem);
		//該当の見積もりフォーム以外をリセットする
		this.resetOtherForms();
		// バリデーターをストップする
		this.stopValidate();
		// 「sendForm」イベントを発火
		$(this.elem).trigger("sendForm");
		return this;
	},
	//フォームのリセット処理
	resetForm : function(elem) {
		var self = this;
		$(elem).each(function() {
			//インプット、セレクトボックス
			//ヒドゥンは、挙動仕様が特殊で、デフォルトの値を取得できないのでNG！
			$("input:text, input:checkbox, textarea, select",this).each(function() {
				var d;
				if($(this).is("input:checkbox")) {
					d = $(this)[0].defaultChecked;
					$(this).prop("checked", d).parent(".input-label").removeClass("checked");
				} else {
					d = $(this)[0].defaultValue;
					$(this).val(d);
				}
			});
			//ヒドゥン
			$("input:hidden."+self.dummyInput,this).val("");
			//チェックボックス
			$("input:checkbox",this).prop('checked', false).parent(".input-label").removeClass("checked");
			//ラジオボタン
			self.resetRadioBtn(this);
			self.resetRadioValidate(this);
			//画像
			$(".input-image",this).html("");
		});
		return this;
	},
	resetOtherForms : function() {
		this.resetForm(this.otherElems);
		this.resetErrorAlert($("."+this.errorClass, this.otherElems));
		return this;
	},
	//----------------------------------------------------------
	// カラー一覧の見積もりボタンを押したときに
	// ラジオボタンをチェック状態にする
	// ※削除予定。使わないこと！
	//----------------------------------------------------------
	onClickColorBtn : function(evt) {
		var self=this;
		var idx = $(self.colorBtn).index(evt.target);
		//ラジオボタンにチェック
		$("input:radio:checked", self.elem).parent(".input-label").removeClass("checked").trigger("change");
		$("input:radio[name='pd_color_code']").eq(idx).prop("checked", "checked");
		$("input:radio:checked", self.elem).parent(".input-label").addClass("checked").trigger("change");
	},
	addErrorAlert : function(target,errorTxt,order) {
		var name = $(target).prop("name");
		var q = !$("."+this.validateAlert+".md-"+name+".md-"+order,$(target).parents(".input-item")).length;
		//セレクトボタンは「.input-item」内にnameごとに一纏めにしておくこと
		if($(target).is("input:text, textarea, select")) {
			$(target).addClass(this.errorClass);
		} else if($(target).is("input:radio")) {
			$(target).parents(".input-item").eq(0).addClass(this.errorClass);
		} else {
			return this;
		}
		if(q) {
			$(target).parents(".input-item").eq(0).append('<p class="'+this.validateAlert+' md-'+name+' md-'+order+'">'+errorTxt+'</p>');
		}
		return this;
	},
	//入力の不備があった際のエラー表示の解除
	removeErrorAlert : function(target,order) {
		var name = $(target).prop("name");
		var inputItem = $(target).parents(".input-item").eq(0);
		if($(target).is("input:text, textarea, select")) {
			$(inputItem).find("."+this.validateAlert+".md-"+name+".md-"+order).remove();
			if(!$(inputItem).find("."+this.validateAlert+".md-"+name).length) {
				$(target).removeClass(this.errorClass);
			}
		} else if($(target).is("input:radio")) {
			$(inputItem).find("."+this.validateAlert+".md-"+name+".md-"+order).remove();
			if(!$(inputItem).find("."+this.validateAlert+".md-"+name).length) {
				$(inputItem).removeClass(this.errorClass);
			}
		}
		return this;
	},
	resetErrorAlert : function(target) {
		$(target).removeClass(this.errorClass)
			.parents(".input-item").eq(0).removeClass(this.errorClass)
			.find("."+this.validateAlert).remove();
		return this;
	},
	checkRequired : function(target,radio) {
		var itemName = this.getItemName(target);
		var isSetItemName = (itemName&&itemName!="");
		var q;
		if($(target).is("input:text ,select, textarea")) {
			q = $(target).hasClass("md-required") && $(target).val()=="";
		} else if($(target).is("input:radio") && radio) {
			q = radio.required && !radio.val;
		}
		if(q) {
			errorTxt = "※"+(isSetItemName ? itemName+"は、" : "")+"必須項目です。";
			this.addErrorAlert(target,errorTxt,"required");
		} else {
			this.removeErrorAlert(target,"required");
		}
		return this;
	},
	validateTextInput : function(target) {
		var name = $(target).prop("name");
		var val = $(target).val();
		var validateOrder = [];
		var errorTxt = "";
		//必須項目が入力されているかチェック
		this.checkRequired(target);
		//入力条件を満たしているかチェック
		if(val!="") {
			validateOrder = this.pickupWords(target,"md-validate-");
			if(validateOrder.length) {
				for(var i=0; i<validateOrder.length; i++) {
					this.validateText(target,val,validateOrder[i]);
				}
			}
		}
		return this;
	},
	//テキストのバリデート処理
	validateText : function(target,val,order) {
		var itemName = this.getItemName(target);
		var isSetItemName = (itemName&&itemName!="");
		var errorTxt = "";
		var q,u;
		switch(order) {
			case "num" : q="natural"; u="1cm"; break;
			case "int" : q="int"; u="1cm"; break;
			case "1mm" : q="1mm"; u="0.1cm"; break;
			case "5mm" : q="5mm"; u="0.5cm"; break;
			case "1cm" : q="1cm"; u="1cm"; break;
			case "5cm" : q="5cm"; u="5cm"; break;
			case "10cm" : q="10cm"; u="10cm"; break;
			default : break;
		}
		if(q && !this.judgeNum(val,q)) {
			errorTxt = "※"+(isSetItemName ? itemName+"は、" : "")+u+"単位で半角数字にてご入力ください。";
			this.addErrorAlert(target,errorTxt,order);
		} else {
			this.removeErrorAlert(target,order);
			$(target).val(this.makeNum(val));
		}
		//「md-validate-range-◯◯-◯◯」が設定されている場合（範囲チェック）
		if(order.search(/range-/)==0) {
			var range = String(order).replace("range-","").split("-");
			if(val<Number(range[0]) || val>Number(range[1])) {
				errorTxt = "※"+(isSetItemName ? itemName+"は、" : "")+range[0]+"～"+range[1]+"の間でご指定ください。";
				this.addErrorAlert(target,errorTxt,order);
			} else {
				this.removeErrorAlert(target,order);
			}
		}
		return this;
	},
	validateSelectBtn : function(target) {
		var name = $(target).prop("name");
		var val = $(target).val();
		var errorTxt = "";
		//必須項目が入力されているかチェック
		this.checkRequired(target);
		return this;
	},
	validateRadioBtn : function() {
		var self = this;
		var radio = this.lookRadio();
		var errorTxt = "";
		for(var i=0; i<radio.length; i++) {
			var target = $("input:radio[name='"+radio[i].name+"'].validate",this.elem);
			//必須項目が入力されているかチェック
			this.checkRequired(target,radio[i]);
			$(target).on("change.validateRadioBtn", function() {self.validateRadioBtn(this);});
		}
		return this;
	},
	stopValidataRadioBtn : function() {
		var self = this;
		var radio = this.lookRadio();
		for(var i=0; i<radio.length; i++) {
			var target = $("input:radio[name='"+radio[i].name+"'].validate",this.elem);
			$(target).off("change.validateRadioBtn");
		}
		return this;
	},
	resetRadioBtn : function(elem) {
		var radios = $(".input-item .input-label input:radio", elem);
		var flag = false;
		if(!radios.length && $(elem).is("input:radio")) { radios=$(elem); flag=true; }
		$(radios).each(function() {
			var defaultChecked = $(this)[0].defaultChecked;
			$(this).prop("checked", defaultChecked);
			if(defaultChecked) {
				$(this).parent(".input-label").addClass("checked");
			} else {
				$(this).parent(".input-label").removeClass("checked");
			}
		});
		return flag?elem:this;
	},
	resetRadioValidate : function(elem) {
		$(".input-item .input-label input:radio", elem).each(function() {
			$(this).off("change.validateRadioBtn");
		});
		return this;
	},
	//----------------------------------------------------------
	// サムネイル付きラジオ選択ボタンの設定
	// ラジオボタンは「.input-item」内にnameごとに一纏めにしておくこと
	// ラジオボタンごとに「label.input-label」で囲うようにすること
	//----------------------------------------------------------
	setLabelBtn : function(elem) {
		this.setRadioUncheckable();
		var elem = elem?elem:this.elem;
		$(".input-label input:radio:checked, .input-label input:checkbox:checked", elem).parent(".input-label").addClass("checked").trigger("change");
		$(".input-label input:radio, .input-label input:checkbox", elem).on("click change", function(evt) {
			var inputLabels = $(this).parents(".input-item").eq(0).find(".input-label");
			var inputLabel = $(this).parents(".input-label").eq(0);
			var q=true;
			if(evt.type=="change") {
				$(inputLabels).each(function() {
					if($(this).find("input").attr("name")!=$(evt.target).attr("name")) { q=false; }
				});
				if(q) { $(inputLabels).removeClass("checked"); }
				if(!$(evt.target).is(":checked")) { $(inputLabel).removeClass("checked"); }
				if($(this).is("input:radio")) {
					$(inputLabel).addClass("checked");
				} else if($(this).is("input:checkbox")) {
					if($(this).is(":checked")) { $(inputLabel).addClass("checked"); }
				}
			} else if(evt.type=="click") {
				//「input:radio.uncheckable」用
				if($(this).hasClass("uncheckable")&&!$(this).prop("checked")) { $(inputLabel).removeClass("checked"); }
			}
		});
		return this;
	},
	//----------------------------------------------------------
	// ラジオボタンのチェックを外せるようにする
	//「input:radio.uncheckable」に適用
	//----------------------------------------------------------
	setRadioUncheckable : function() {
		var arr = [];
		$("input:radio.uncheckable",this.elem).each(function() {
			var name = $(this).prop("name");
			if($.inArray(name, arr)<0) { arr.push(name); }
		});
		$(arr).each(function() {
			var nowChecked = $("input:radio[name="+this+"]:checked").val();
			$("input:radio[name="+this+"]").on("click.setRadioUncheckable", function(evt) {
				var val = $(this).val();
				if(val==nowChecked) {
					$(this).prop("checked",false);
					nowChecked = false;
				} else {
					nowChecked = $(this).val();
				}
			});
		});
		return this;
	},
	//----------------------------------------------------------
	// バリデートプラグイン使用に必要なクラスなどが設定されているかチェック
	// 設定されていなければ、必要なクラスを割り当てる
	//----------------------------------------------------------
	checkHtml : function() {
		var self=this;
		var inputs = $("input:text, textarea, select, input:checkbox, input:radio",self.elem);
		if(!$(inputs).is(".input-item") || !$(inputs).parents(".input-item").length) {
			$("input:text, textarea",self.elem).parents("td").eq(0).addClass(".input-item");
		}
		$("input:hidden",self.elem).each(function() {
			if($(this).val()=="") { $(this).addClass(self.dummyInput); }
		});
		return this;
	},
	// 文字数制限チェック
	checkStrLimit : function() {
		var self=this;
		var util=this._utility;
		var ua = util.ua;
		var isIE = (ua.ltIE9 || ua.gtIE10 || ua.Edge);
		var strLength = 0;
		var strLimit = (isIE)?1800:10000;
		var strLimitTxt = (isIE) ?
			"入力項目が限界に達しました。\n入力数を減らして、小分けにして送信するか、\n「InternetExplorer」「Microsoft Edge」以外のブラウザをご利用ください。" :
			"入力項目が限界に達しました。\n入力数を減らして、小分けにして送信してください。";
		$("[name]",self.elem).not("[name=other]").each(function() {
			strLength+=encodeURIComponent(String($(this).val())).length;
		});
		if(strLength>strLimit) {
			alert(strLimitTxt+"\n（ "+strLength+" / "+strLimit+" ）");
			return false;
		}
		return true;
	},
	findAllItems : function() {
		this.allItems = $("input:text.validate, textarea.validate, select.validate, input:checkbox.validate, input:radio.validate",this.form);
		return this;
	},
	getItemName : function(target) { return this._utility.getItemName(target); },
	selectMap : function(val,map,key) { return this._utility.selectMap(val,map,key); },
	pickupWords : function(target,key) { return this._utility.pickupWords(target,key); },
	makeNum : function(val) { return this._utility.makeNum(val); },
	judgeNum : function(val,order) { return this._utility.judgeNum(val,order); },
	lookRadio : function(name) { return this._utility.lookRadio(name); },
};







var MF_Utility = function(mfObj) {
	this._mf = mfObj;
};
MF_Utility.prototype = {
	fillColorImg : function(elem,options) {
		var self=this;
		//オプション設定（デフォルト値を予め設定しておく）
		var options = $.extend({
			val : $(elem).val(),
			thumb : "",
			width : 100,
		}, options);
		return elem.each(function () {
			var target=this;
			var imgElem = $(target).parents(".input-item").eq(0).find(".input-image");
			$(imgElem).html("");
			if(options.thumb=="" || options.val=="") {return;}
			$(imgElem).append('<img src="'+options.thumb+'" alt="'+options.val+'" width="'+options.width+'" class="mb05">');
		});
	},
	fillSelectOptions : function(elem,options) {
		var self=this;
		//オプション設定（デフォルト値を予め設定しておく）
		var options = $.extend({
			min : "",
			max : "",
			interval : "",
			//----------------------------------------------------------
			// opListを設定すれば、配列からオプションを作れる
			// opList : ["foo","bar",...]
			// opList : [ {val:"foo01",txt:"bar01"}, {val:"foo02",txt:"bar02"}, ... ]
			//----------------------------------------------------------
			// ※「<optgroup>」で区切りたい場合は...
			//	opList : [{
			//		group : "foo",
			// 		list : [ {val:"foo01",txt:"bar01"}, {val:"foo02",txt:"bar02"}, ... ]
			//	}]
			//----------------------------------------------------------
			// ※キー「val」「txt」を変更したい場合は、
			//　「altVal」「altTxt」を設定する
			//----------------------------------------------------------
			opList : [],
			altVal : "",
			altTxt : "",
			//「fnReset」がtrueの場合、初期状態にリセットする。
			fnReset : false,
			fillNum : true,
			triggerEvent : false,
			//「お選びください」などを消す。
			resetFirstOption : false,
			//----------------------------------------------------------
			// 選択肢が一つしかない場合、自動的に選択する。
			// ※「$.fillSelectOptions」を実行する時は、
			// 　イベントハンドラよりも後に実行されるように気をつけること！
			// 　（「autoSelect」適用時にイベントハンドラが実行されなくなるため）
			//----------------------------------------------------------
			autoSelect : true,
		}, options);
		return elem.each(function () {
			var target = this;
			if(!$(target).is("select")) { return; }
			if($(target)[0][0]) { $(target).html(String($(target)[0][0].outerHTML)); }
			if(options.resetFirstOption) { $(target).html(""); }
			if(options.fnReset) { return; }
			if(options.opList.length) {
				var val = options.altVal!=""?options.altVal:"val";
				var txt = options.altTxt!=""?options.altTxt:"txt";
				$(options.opList).each(function() {
					var opItem = this;
					if($.type(opItem)=="object") {
						if(!opItem.group || val=="group") {
							$(target).append('<option value="'+opItem[val]+'">'+(opItem[txt]?opItem[txt]:opItem[val])+'</option>');
						} else if(opItem.list && opItem.list.length) {
							$(target).append('<optgroup label="'+opItem.group+'"></optgroup>');
							var optgroup = $("optgroup:last-child",target);
							$(opItem.list).each(function() {
								$(target).append('<option value="'+this[val]+'">'+(this[txt]?this[txt]:this[val])+'</option>');
							});
						}
					} else {
						$(target).append('<option value="'+opItem+'">'+opItem+'</option>');
					}
				});
				// リストに選択項目が1つしかない場合、自動的に選択（デフォルト：ON）
				if(options.opList.length==1 && options.autoSelect) {
					opItem = options.opList[0];
					if($.type(opItem)=="object") {
						$(target).val(opItem[val]?opItem[val]:opItem.list[0][val]).trigger("change");
					} else {
						$(target).val(opItem).trigger("change");
					}
				}
			} else if($.type(options.min)=="number" && $.type(options.max)=="number") {
				if(options.fillNum) {
					var length = options.max - options.min + 1;
					var num = options.min;
					if($.type(options.interval)=="number") {
						for(var i=0; i<length; i+=options.interval) {
							num = options.min + i;
							$(target).append('<option value="'+num+'">'+num+'</option>');
						}
					} else {
						for(var i=0; i<length; i++) {
							num = options.min + i;
							$(target).append('<option value="'+num+'">'+num+'</option>');
						}
					}
				}
			}
			if(options.triggerEvent) { $(target).trigger("change"); }
		});
	},
	selectMap : function(val,map,key) {
		var obj = "";
		$(map).each(function() {
			var mapVal;
			if(!key) {
				if($.type(this)=="object"&&this.val) { mapVal=this.val; } else if(!this.list) { mapVal=String(this); }
			} else {
				mapVal=this[key];
			}
			if(mapVal) {
				if(mapVal==val) { obj=this; }
			} else if(this.group && this.list) {
				var group = this.group;
				$(this.list).each(function() {
					if(this.val==val) { obj=this; if(!obj.group){ obj.group=group; } }
				});
			}
		});
		if(val=="") { obj=false; }
		return obj;
	},
	//----------------------------------------------------------
	// 「製作可能サイズ」等を切り替えたい時に使用するメソッド
	// 例）
	// $("input:text[name=pd_width]",self).switchValidateClass("md-validate-range-",sizeMap[sousa].wRange);
	//----------------------------------------------------------
	switchValidateClass : function(elem,classHead,val) {
		//オプション設定（デフォルト値を予め設定しておく）
		var options = $.extend({}, options);
		return elem.each(function () {
			target = this;
			var arr = $(target).prop("class").split(" ");
			var reg = new RegExp(classHead);
			var flag = false;
			for(var i=0; i<arr.length; i++) {
				if(String(arr[i]).search(reg)==0) {
					flag = true;
					$(target).removeClass(arr[i]).addClass(classHead+val);
				}
			}
			if(!flag) { $(target).addClass(classHead+val); }
		});
	},
	//ラジオボタン項目の値をチェック
	//【nameを設定した場合】指定したnameを調べることができる {name,val,required}
	//【nameの設定なしの場合】ラジオボタンのnameごとの配列を返す
	// [{name01,val01,required01},{name02,val02,required02},{name03,val03,required03},...]
	lookRadio : function(name) {
		var mf=this._mf;
		var radioNameArr = [];
		var radioArr = [];
		$("input:radio",mf.elem).each(function() {
			if($.inArray($(this).prop("name"),radioNameArr)<0) { radioNameArr.push($(this).prop("name")); }
		});
		for(var i=0; i<radioNameArr.length; i++) {
			var itemName = this.getItemName($("input:radio[name='"+radioNameArr[i]+"']",mf.elem));
			var radio = {
				itemName : itemName,
				name : radioNameArr[i],
				val : $("input:radio[name='"+radioNameArr[i]+"']:checked",mf.elem).val(),
				required : $("input:radio[name='"+radioNameArr[i]+"']",mf.elem).eq(0).hasClass("md-required")
			}
			if(name && name==radioNameArr[i]) { return radio; }
			radioArr.push(radio);
		}
		return radioArr;
	},
	getItemName : function(target) {
		var mf=this._mf;
		var itemName="";
		if(mf.nameList=={}) {
			itemName = $(target).parents("tr").eq(0).find("th").text();
		} else {
			itemName = mf.nameList[$(target).prop("name")];
		}
		return itemName;
	},
	// order：nutural(自然数)、int(整数)、1mm、5mm、1cm、5cm、10cm
	judgeNum : function(val,order) {
		val = this.makeNum(val);
		if(!isNaN(Number(val))) {
			if(order=="natural" && Number(val)>0 && Number(val)%1==0) {return true;}
			if(order=="int" && Number(val)%1==0) {return true;}
			if(String(order)=="1mm" && Number(val)*10%1==0) {return true;}
			if(String(order)=="5mm" && Number(val)*10%5==0) {return true;}
			if(String(order)=="1cm" && Number(val)%1==0) {return true;}
			if(String(order)=="5cm" && Number(val)%5==0) {return true;}
			if(String(order)=="10cm" && Number(val)%10==0) {return true;}
			if(!order) {return true;}
			return false;
		} else {
			return false;
		}
	},
	// valを半角数字に整形する
	makeNum : function(val) {
		val = String(val).replace(/[０-９]/g, function(s) {
			return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
		}).replace(/。|、|．|・/g, ".");
		if(!isNaN(Number(val))) {
			var strLength = String(val).length;
			for(var i=0; i<strLength; i++) {
				if(Number(val)<1) { break; }
				if(String(val).charAt(0)=="0") { val=String(val).substr(1); }
			}
		}
		return val;
	},
	//クラス名チェック
	//key("md-validate-"など)を含むクラスを調べて、
	//key以降の文字列を配列で返す
	pickupWords : function(target,key) {
		var arr = $(target).prop("class").split(" ");
		var words = [];
		for(var i=0; i<arr.length; i++) {
			if(arr[i].indexOf(key) >= 0) { words.push(arr[i].replace(key,"")); }
		}
		return words;
	},
	// フォームに何も入力されていない状態か？
	isInputNothing : function() {
		var self=this;
		var mf = this._mf;
		var flag = true;
		$("input, select, textarea",mf.elem).not(".hidden, [type=hidden]").each(function() {
			if($(this).val()!="") { flag=false; }
		});
		return flag;
	},
	isNum : function(a) {
		return !isNaN(Number(a));
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
		Edge : (window.navigator.userAgent.toLowerCase().indexOf("edge") !== -1),
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
};



/*---------------------------------------------*/
/* 見積もりフォーム
/* オプション品選択用クラス
/*---------------------------------------------*/

MF_OptionList = function(elem,options) {
	this.elem = elem;
	this.elems = options.elems;
	this.form = $(this.elem).parents(".mitumori-form").eq(0);
	this.v = this.form.data("validate");
	this.elemBody = $(options.elemBody,this.elem);
	this.toggleBtn = $(options.toggleBtn,this.elem);
	this.optionOnlyBtn = $(options.optionOnlyBtn,this.elem);
	this.selectItemW;
	this.optionListTxt = "";
	this.fnOptionOnly = options.fnOptionOnly;
	this.fnCancelOptionOnly = options.fnCancelOptionOnly;
	this.addItemBtnTxt = options.addItemBtnTxt;
	this.headingTxt = options.headingTxt;
	this.optionUpdate = options.optionUpdate;
	this.optionMap = options.optionMap;
	this.selectedOptionMap = [];
	this.opIdx = 0;
};

MF_OptionList.prototype = {
	init : function() {
		var self = this;
		$(this.elemBody).hide();
		self.initOptionOnlyBtn();
		if($(this.toggleBtn,self.elem).length) {
			$(this.toggleBtn,self.elem).on("change", function(evt) {
				self.toggleOptionOnlyBtn();
				self.toggleBody(evt);
			});
		} else {
			self.toggleOptionOnlyBtn();
			self.toggleBody();
		}
		$(self.elem).data("option-list",self);
		$(self.elem).data("option-list-txt",self.optionListTxt);
	},
	initOptionOnlyBtn : function() {
		var self=this;
		self.hideOptionOnlyBtn();
		$(self.optionOnlyBtn).on("change", function() {
			if($(this).is(":checked")) {
				self.v.resetErrorAlert($("."+self.v.errorClass,self.v.elem));
				$("."+self.v.validateAlert,self.v.elem).remove();
				self.fnOptionOnly();
			} else {
				self.fnCancelOptionOnly();
			}
		});
	},
	showOptionOnlyBtn : function() {
		var self=this;
		var btn = $(self.optionOnlyBtn).parents(".input-label").eq(0);
		$(btn).show();
	},
	hideOptionOnlyBtn : function() {
		var self=this;
		var btn = $(self.optionOnlyBtn).parents(".input-label").eq(0);
		var d;
		if(!$(self.optionOnlyBtn).length) {return;}
		if($(self.optionOnlyBtn).is("input:checkbox")) {
			d = $(self.optionOnlyBtn)[0].defaultChecked;
			$(self.optionOnlyBtn).prop("checked", d).trigger("change")
				.parent(".input-label").removeClass("checked");
		} else {
			d = $(self.optionOnlyBtn)[0].defaultValue;
			$(self.optionOnlyBtn).val(d).trigger("change");
		}
		$(btn).hide();
	},
	toggleOptionOnlyBtn : function() {
		var self=this;
		var btn = $(self.optionOnlyBtn).parents(".input-label").eq(0);
		if($(btn).is(":hidden")) {
			self.showOptionOnlyBtn();
		} else {
			self.hideOptionOnlyBtn();
		}
	},
	toggleBody : function(evt) {
		var self = this;
		if(evt) {
			if($(evt.target).is(":checked")) {
				self.opIdx++;
				self.appendItem();
				$(self.elemBody,self.elem).show();
				self.selectItemW = $("[class^=mf-option-list-item-name-]",self.elemBody).eq(0)[0].clientWidth;
			} else {
				self.resetOptionList();
				self.writeOptionList();
			}
		} else {
			self.opIdx++;
			self.appendItem();
			$(self.elemBody).show();
			self.selectItemW = $("[class^=mf-option-list-item-name-]",self.elemBody).eq(0)[0].clientWidth;
		}
	},
	appendItem : function() {
		var self=this;
		$(".add-option-item",self.elem).remove();
		$('<div class="item">').append(
			$('<p class="input-block">').append(
				$('<select class="mf-option-list-item-name-'+self.opIdx+' validate md-required sp-mh05"/>').append(
					$('<option value="">お選びください</option>')
				).on("change",function(evt) {
					self.updateSelectOptions();
					self.onSelectItem(evt);
				}).data("opIdx",self.opIdx).fillSelectOptions({ opList:self.optionMap, autoSelect:false })
			).append(
				$('<select class="mf-option-list-item-value-'+self.opIdx+' validate md-required ml05"/>').append(
					$('<option value="">---</option>')
				).on("change", function(evt) {
					self.writeOptionList();
				}).data("opIdx",self.opIdx).fillSelectOptions({ min:1, max:100 })
			).append(
				$("<span class='el-unit md-value'/>").html("　")
			).append(
				$('<a href="#" class="delete-option-item no-smooth ml10">削除</a>').on("click", function(evt) {
					self.deleteItem(evt);
					return false;
				})
			)
		).appendTo($(self.elemBody,self.elem));
		self.appendAddItemBtn();
		self.updateSelectOptions();
	},
	appendAddItemBtn : function() {
		var self=this;
		var addBtn = $(".add-option-item",self.elemBody);
		$(addBtn).remove();
		if(self.optionUpdate && ($(".item",self.elemBody).length>=self.optionMap.length)) { return; }
		$(self.elemBody).append(
			$('<p class="t-right">').append(
				$('<a href="#" class="add-option-item no-smooth">'+self.addItemBtnTxt+'</a>').on("click", function() {
					self.opIdx++;
					self.appendItem();
					return false;
				})
			)
		);
	},
	onSelectItem : function(evt) {
		var self=this;
		var targetIdx = $(evt.target).data("opIdx");
		var item = self.v.selectMap($(evt.target).val(),self.optionMap);
		var opValue = $(".mf-option-list-item-value-"+targetIdx,self.elem);
		/*
		//オプションにサイズオーダーがある場合、サイズ入力を追加
		$(".mf-option-list-item-size-"+targetIdx,self.elem).remove();
		if(item.sizeOrder) {
			$(evt.target).after(
				$('<input value="" class="mf-option-list-item-size-'+targetIdx+' validate md-required md-validate-num w50 ml05"/>')
			);
		}
		*/
		//オプションにカラーがある場合、カラー入力を追加
		$(".mf-option-list-item-color-"+targetIdx,self.elem).remove();
		if(item.colorMap) {
			$(evt.target).after(
				$('<select class="mf-option-list-item-color-'+targetIdx+' validate md-required ml05"/>').append(
					$('<option value="">(カラーを選択)</option>')
				).on("change", function(evt) {
					self.writeOptionList();
				}).data("opIdx",self.opIdx).fillSelectOptions({ opList:item.colorMap })
			);
		}
		//数量をリセット
		if($(opValue).val()!="") { $(opValue).val(""); }
		//単位を切り替える
		$(evt.target).siblings(".el-unit.md-value").html(item.valueUnit);
	},
	deleteItem : function(evt) {
		var self=this;
		var targetItem = $(evt.target).parents(".item").eq(0);
		if($(".item",self.elemBody).length>1) {
			$(targetItem).remove();
		} else {
			$(self.elemBody).html("");
			self.opIdx = 0;
			self.appendItem();
		}
		self.updateSelectOptions();
		self.appendAddItemBtn(evt);
		self.writeOptionList();
	},
	//オプション部品のselect要素を更新
	updateSelectOptions : function() {
		if(!this.optionUpdate) {return;}
		var self=this;
		self.setSelectedOptionMap();
		$("[class^=mf-option-list-item-name-]",self.elem).each(function() {
			var opSelect = this;
			var val = $(this).val();
			$(opSelect).fillSelectOptions({ opList:self.optionMap, autoSelect:false }).val(val);
			//すでに選ばれているオプション部品を除外する
			$(self.selectedOptionMap).each(function(i) {
				var elemOption = $("option[value='"+this.val+"']",opSelect);
				//該当のoption要素が選択状態でなければ、削除
				if(this.val!=val) { $(elemOption).remove(); }
			});
			$(this).width(self.selectItemW);
		});
	},
	//選択されているオプション部品をまとめた配列マップを作成
	setSelectedOptionMap : function() {
		var self=this;
		self.selectedOptionMap=[];
		$(".item",self.elemBody).each(function() {
			var val = $("[class^=mf-option-list-item-name-]",this).val();
			$(self.optionMap).each(function(i) {
				if(this.val==val) { self.selectedOptionMap.push(this); }
			});
		});
	},
	writeOptionList : function() {
		var self=this;
		self.optionListTxt = "";
		var opItem = $(".item",self.elemBody);
		if($("[class^=mf-option-list-item-value-]",opItem).length) {
			self.optionListTxt += self.headingTxt;
			$(".item",self.elemBody).each(function() {
				var elemName = $("[class^=mf-option-list-item-name-]",this);
				var elemColor = $("[class^=mf-option-list-item-color-]",this);
				var elemValue = $("[class^=mf-option-list-item-value-]",this);
				if(self.optionListTxt!="") { self.optionListTxt+="\n"; }
				self.optionListTxt += $(elemName).val();
				self.optionListTxt += $(elemColor).length ? " "+$(elemColor).val() : "";
				self.optionListTxt += "：";
				self.optionListTxt += $(elemValue).val();
				self.optionListTxt += $(".el-unit.md-value",this).html();
			});
		}
		$(self.elem).data("option-list-txt",self.optionListTxt?self.optionListTxt:"");
		$(self.elem).triggerHandler("optionListUpdate");
	},
	resetOptionList : function() {
		var self=this;
		self.opIdx = 0;
		$(".validate-alert",self.elem).remove();
		$(self.elemBody).hide().html("");
		if($(this.toggleBtn,self.elem).length) {
			self.hideOptionOnlyBtn();
		} else {
			self.toggleBody();
		}
		self.selectedOptionMap=[];
	}
};





/*---------------------------------------------*/
/* 見積もりフォーム ポップアップ用             */
/*---------------------------------------------*/
var MF_Popup = function() {
	this.form;
	this.bgClass = "mitumori-form-bg";
	this.bg;
	this.triggerArea;
	this.closeBtn = '<a href="#" class="close-btn no-smooth"><i class="icon-cancel-circled"></i></a>';
	this.toggleSpeed = 350;
	this.formPos = { top:0, left:0 };
	this.formHideMargin = 1000;
	this.formHidePos = {
		top : window.innerHeight ? window.innerHeight : $(window).height()+this.formHideMargin,
	};
};
MF_Popup.prototype = {
	initForm : function() {
		var self=this;
		$(this.form).css({top:this.formHidePos.top}).addClass("is-hidden");
		this.createBG().createCloseBtn().cancelBodyScroll().setFormPos();
		$(window).on("resize switchPC switchSP readySP", function(evt) {
			self.setFormPos(evt);
		});
		return this;
	},
	createBG : function() {
		var self = this;
		$(self.form).after('<div class="'+self.bgClass+'">');
		self.bg = $("."+self.bgClass);
		$(self.bg).on("click", function() {
			self.toggleForm();
		});
		return this;
	},
	createCloseBtn : function() {
		var self = this;
		var btnSize = $(".heading.md-top",self.form).outerHeight();
		this.closeBtn = $(this.closeBtn).appendTo(this.form).on("click", function() {
			self.toggleForm();
			return false;
		}).find("i").css({
			height : btnSize+"px",
			width : btnSize+"px",
			display : "table-cell",
			verticalAlign : "middle"
		}).end();
		$(window).on("readySP switchSP", function() {
			var btnSize = $(".heading.md-top",self.form).outerHeight();
			$(self.closeBtn).find("i").css({
				height : btnSize+"px",
				width : btnSize+"px",
			});
		});
		return this;
	},
	cancelBodyScroll : function() {
		var self=this;
		// ブラウザ「IE9以下」なら何もしない
		if(document.uniqueID && typeof window.matchMedia == "undefined") { return this; }
		// ブラウザ「IE10以上」なら何もしない
		if(document.uniqueID && window.matchMedia) { return this; }
		//「jquery.mousewheel.min.js」を使用
		$(document).on("mousewheel", function(evt) {
			if($("select:focus").length && $("select:hover").length) { return; }
			var scrollTop = $(".estimate-area.md-mitumori-form",self.form).scrollTop();
			if(!$(self.form).hasClass("is-hidden")) {
				evt.preventDefault();
				if($(self.form).is(":hover")) {
					$(".estimate-area.md-mitumori-form",self.form).scrollTop(scrollTop-(evt.deltaY*30));
				}
			}
		});
		return this;
	},
	setTriggerArea : function() {
		var self = this;
		return this;
	},
	setFormPos : function(evt) {
		var self=this;
		var func = setInterval(function() {
			// IE8以下用
			if(typeof window.addEventListener == "undefined" && typeof document.getElementsByClassName == "undefined") {
				window.innerHeight = $(window).height();
				window.innerWidth = $(window).width();
			}
			if(window.innerWidth<$(self.form).width()) { return; }
			var hScale;
			if(window.responsiveMode=="PC") {
				hScale = 0.9;
			} else if(window.responsiveMode=="SP") {
				hScale = 0.95;
			}
			var heightTarget = $(".estimate-area.md-mitumori-form",self.form);
			var targetHeight = window.innerHeight * hScale;
			targetHeight -= $(".heading.md-top",self.form).outerHeight(true);
			targetHeight -= parseInt($(heightTarget).css("padding-top"),10);
			targetHeight -= parseInt($(heightTarget).css("padding-bottom"),10);
			targetHeight -= isNaN(parseInt($(heightTarget).css("border-top-width"),10)) ? 0 : parseInt($(heightTarget).css("border-top-width"),10);
			targetHeight -= isNaN(parseInt($(heightTarget).css("border-bottom-width"),10)) ? 0 : parseInt($(heightTarget).css("border-bottom-width"),10);
			targetHeight -= parseInt($(heightTarget).css("margin-top"),10);
			targetHeight -= parseInt($(heightTarget).css("margin-bottom"),10);
			$(heightTarget).height(targetHeight);

			self.formPos.top = ( window.innerHeight * (1-hScale) ) / 2;
			self.formPos.left = ( window.innerWidth - $(self.form).outerWidth(true) ) / 2;
			if(!$(self.form).hasClass("is-hidden")) {
				$(self.form).css({ "top" : self.formPos.top + "px" });
			}
			$(self.form).css({ "left" : self.formPos.left + "px" });

			clearInterval(func);
		},100);
		return this;
	},
	toggleForm : function() {
		this.formHidePos.top = window.innerHeight + this.formHideMargin;
		if($(this.form).hasClass("is-hidden")) {
			$(this.bg).fadeIn();
			$(this.form).animate({top:this.formPos.top},this.toggleSpeed,function(){$(this).removeClass("is-hidden");});
		} else {
			$(this.bg).fadeOut();
			$(this.form).animate({top:this.formHidePos.top},this.toggleSpeed,function(){$(this).addClass("is-hidden");});
		}
		return this;
	}
};
