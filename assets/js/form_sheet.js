


$(function(){
	var clothMap = [
		{ val:"FRL30", thumbPath:"/curtain/hsn/img/cloth/", thumb:"frl30.jpg", sheetW:"183cm", sheetL:"50m", cut:false, roll:true },
		{ val:"FRL50", thumbPath:"/curtain/hsn/img/cloth/", thumb:"frl50.jpg", sheetW:"183cm", sheetL:"30m", cut:false, roll:true },
		{ val:"SDC30", thumbPath:"/curtain/hsn/img/cloth/", thumb:"sdc30.jpg", sheetW:"183cm", sheetL:"50m", cut:false, roll:true },
		{ val:"SDC50", thumbPath:"/curtain/hsn/img/cloth/", thumb:"sdc50.jpg", sheetW:"137cm", sheetL:"20m", cut:false, roll:true },
		{ val:"350A", thumbPath:"/curtain/hsn/img/cloth/", thumb:"350a.jpg", sheetW:"205cm", sheetL:"50m乱", cut:true, roll:true },
		{ val:"350T", thumbPath:"/curtain/hsn/img/cloth/", thumb:"350t.jpg", sheetW:"205cm", sheetL:"50m乱", cut:true, roll:true },
		{ val:"350H", thumbPath:"/curtain/hsn/img/cloth/", thumb:"350h.jpg", sheetW:"205cm", sheetL:"50m乱", cut:true, roll:true },
		{ val:"350寒", thumbPath:"/curtain/hsn/img/cloth/", thumb:"350kan.jpg", sheetW:"205cm", sheetL:"50m乱", cut:true, roll:true },
		{ val:"350B2", thumbPath:"/curtain/hsn/img/cloth/", thumb:"350b2.jpg", sheetW:"203cm", sheetL:"50m乱", cut:true, roll:true },
		{ val:"3300FT", thumbPath:"/curtain/hsn/img/cloth/", thumb:"3300ft.jpg", sheetW:"203cm", sheetL:"50m乱", cut:true, roll:true },
		{ val:"380", thumbPath:"/curtain/hsn/img/cloth/", thumb:"380.jpg", sheetW:"203cm", sheetL:"50m乱", cut:true, roll:true },
		{ val:"1205TN", thumbPath:"/curtain/hsn/img/cloth/", thumb:"1205tn.jpg", sheetW:"205cm", sheetL:"30m乱", cut:true, roll:true },
		{ val:"550A", thumbPath:"/curtain/hsn/img/cloth/", thumb:"550a.jpg", sheetW:"205cm", sheetL:"30m乱", cut:true, roll:true },
		{ val:"550H", thumbPath:"/curtain/hsn/img/cloth/", thumb:"550h.jpg", sheetW:"205cm", sheetL:"30m乱", cut:true, roll:true },
		{ val:"580T", thumbPath:"/curtain/hsn/img/cloth/", thumb:"580t.jpg", sheetW:"203cm", sheetL:"30m乱", cut:true, roll:true },
		{ val:"1600S", thumbPath:"/curtain/hsn/img/cloth/", thumb:"1600s.jpg", sheetW:"204cm", sheetL:"30m乱", cut:true, roll:true },
		{ val:"1600OR", thumbPath:"/curtain/hsn/img/cloth/", thumb:"1600or.jpg", sheetW:"204cm", sheetL:"30m乱", cut:true, roll:true },
		{ val:"1000F", thumbPath:"/curtain/hsn/img/cloth/", thumb:"1000f.jpg", sheetW:"190cm", sheetL:"26m乱", cut:true, roll:true },
		{
			val : "400SF",
			thumbPath:"/curtain/hsn/tarpaulin/img/color/",
			thumb : "400sf_l_ivory.jpg",
			sheetW : "188cm",
			sheetL : "50m乱",
			cut : true,
			roll : true,
			color : [
				{ val:"グレー", thumb:"400sf_gray.jpg" },
				{ val:"ライトアイボリー", thumb:"400sf_l_ivory.jpg" }
			]
		},
		{
			val : "RG4200FD",
			thumbPath:"/curtain/hsn/tarpaulin/img/color/",
			thumb : "rg4200fd_snow_white.jpg",
			sheetW : "204cm",
			sheetL : "30m乱",
			cut : true,
			roll : true,
			color : [
				{ val:"スノーホワイト", thumb:"rg4200fd_snow_white.jpg" },
				{ val:"ライトグレー", thumb:"rg4200fd_l_gray.jpg" },
				{ val:"ライトアイボリー", thumb:"rg4200fd_l_ivory.jpg" }
			]
		},
		{
			val : "RG3200F",
			thumbPath:"/curtain/hsn/tarpaulin/img/color/",
			thumb : "rg3200f_blue_crystal.jpg",
			sheetW : "110cm",
			sheetL : "50m乱",
			cut : true,
			roll : true,
			color : [
				{ val:"ブルークリスタル", thumb:"rg3200f_blue_crystal.jpg" },
				{ val:"クリアブライト", thumb:"rg3200f_clear_bright.jpg" }
			]
		},
		{
			val : "PLCA",
			thumbPath:"/curtain/hsn/tarpaulin/img/color/",
			sheetW : "195cm",
			sheetL : "30m乱",
			cut : true,
			roll : true,
			thumb : "plca.jpg"
		},
		{
			val : "V2000",
			thumbPath:"/curtain/hsn/tarpaulin/img/color/",
			sheetW : "196cm",
			sheetL : "50m乱",
			cut : true,
			roll : true,
			thumb : "v2000.jpg"
		},
		{
			val : "ユークリアシートW",
			thumbPath:"/curtain/hsn/tarpaulin/img/color/",
			sheetW : "102cm",
			sheetL : "30m乱",
			cut : false,
			roll : true,
			thumb : "uclear_w.jpg"
		},
		{
			val : "カラーターポリン1類",
			thumbPath:"/curtain/hsn/tarpaulin/img/color/",
			thumb : "oneup01.jpg",
			sheetW : "188cm",
			sheetL : "50m乱",
			cut : true,
			roll : true,
			color : [
				{ val:"M-101(ホワイト)", thumb:"oneup_m101.jpg" },
				{ val:"M-102(クリアホワイト)", thumb:"oneup_m102.jpg" },
				{ val:"M-103(イエロー)", thumb:"oneup_m103.jpg" },
				{ val:"M-104(オレンジ)", thumb:"oneup_m104.jpg" },
				{ val:"M-105(レッド)", thumb:"oneup_m105.jpg" },
				{ val:"M-106(ライトグリーン)", thumb:"oneup_m106.jpg" },
				{ val:"M-107(ワカクサ)", thumb:"oneup_m107.jpg" },
				{ val:"M-108(グリーン)", thumb:"oneup_m108.jpg" },
				{ val:"M-109(ライトブルー)", thumb:"oneup_m109.jpg" },
				{ val:"M-110(ブルー)", thumb:"oneup_m110.jpg" },
				{ val:"M-111(ネイビーブルー)", thumb:"oneup_m111.jpg" },
				{ val:"M-112(グレイ)", thumb:"oneup_m112.jpg" },
				{ val:"M-113(ブラック)", thumb:"oneup_m113.jpg" },
				{ val:"M-114(アイボリー)", thumb:"oneup_m114.jpg" }
			]
		},
		{
			val : "カラーターポリン2類",
			thumbPath:"/curtain/hsn/tarpaulin/img/color/",
			thumb : "oneup02.jpg",
			sheetW : "188cm",
			sheetL : "50m乱",
			cut : true,
			roll : true,
			color : [
				{ val:"OU-01(ホワイト)", thumb:"oneup_ou01.jpg" },
				{ val:"OU-02(クリアホワイト)", thumb:"oneup_ou02.jpg" },
				{ val:"OU-03(アイボリー)", thumb:"oneup_ou03.jpg" },
				{ val:"OU-04(イエロー)", thumb:"oneup_ou04.jpg" },
				{ val:"OU-05(オレンジ)", thumb:"oneup_ou05.jpg" },
				{ val:"OU-06(レッド)", thumb:"oneup_ou06.jpg" },
				{ val:"OU-07(ライトグリーン)", thumb:"oneup_ou07.jpg" },
				{ val:"OU-08(ワカクサ)", thumb:"oneup_ou08.jpg" },
				{ val:"OU-09(グリーン)", thumb:"oneup_ou09.jpg" },
				{ val:"OU-10(ライトブルー)", thumb:"oneup_ou10.jpg" },
				{ val:"OU-11(ブルー)", thumb:"oneup_ou11.jpg" },
				{ val:"OU-12(ネイビーブルー)", thumb:"oneup_ou12.jpg" },
				{ val:"OU-13(ライトグレイ)", thumb:"oneup_ou13.jpg" },
				{ val:"OU-14(グレイ)", thumb:"oneup_ou14.jpg" },
				{ val:"OU-15(シルバー)", thumb:"oneup_ou15.jpg" },
				{ val:"OU-16(ブラック)", thumb:"oneup_ou16.jpg" },
				{ val:"OU-17(ピンク)", thumb:"oneup_ou17.jpg" },
				{ val:"OU-18(ダンジェリンオレンジ)", thumb:"oneup_ou18.jpg" },
				{ val:"OU-19(ブラウン)", thumb:"oneup_ou19.jpg" }
			]
		},
		{
			val : "ウルトラマックス",
			thumbPath:"/curtain/hsn/tarpaulin/img/color/",
			thumb : "ultramax.jpg",
			sheetW : "103cm",
			sheetL : "50m乱",
			cut : true,
			roll : true,
			color : [
				{ val:"U-01(ロイヤルブルー)", thumb:"ultramax_u01.jpg" },
				{ val:"U-02(ライトブルー)", thumb:"ultramax_u02.jpg" },
				{ val:"U-03(アクアブルー)", thumb:"ultramax_u03.jpg" },
				{ val:"U-04(エメラルドグリーン)", thumb:"ultramax_u04.jpg" },
				{ val:"U-26(ワサビ)", thumb:"ultramax_u26.jpg" },
				{ val:"U-06(ダークグリーン)", thumb:"ultramax_u06.jpg" },
				{ val:"U-07(グリーン)", thumb:"ultramax_u07.jpg" },
				{ val:"U-08(スカイグリーン)", thumb:"ultramax_u08.jpg" },
				{ val:"U-09(フォレストグリーン)", thumb:"ultramax_u09.jpg" },
				{ val:"U-10(ライトグリーン)", thumb:"ultramax_u10.jpg" },
				{ val:"U-11(イエロー)", thumb:"ultramax_u11.jpg" },
				{ val:"U-12(オレンジ)", thumb:"ultramax_u12.jpg" },
				{ val:"U-13(レッド)", thumb:"ultramax_u13.jpg" },
				{ val:"U-28(ピーチ)", thumb:"ultramax_u28.jpg" },
				{ val:"U-30(ワインレッド)", thumb:"ultramax_u30.jpg" },
				{ val:"U-27(ブラウン)", thumb:"ultramax_u27.jpg" },
				{ val:"U-16(ベージュ)", thumb:"ultramax_u16.jpg" },
				{ val:"U-31(クリーム)", thumb:"ultramax_u31.jpg" },
				{ val:"U-17(アイボリー)", thumb:"ultramax_u17.jpg" },
				{ val:"U-18(ホワイト)", thumb:"ultramax_u18.jpg" },
				{ val:"U-19(グレー)", thumb:"ultramax_u19.jpg" },
				{ val:"U-20(ブラック)", thumb:"ultramax_u20.jpg" },
				{ val:"U-21(シルバー)", thumb:"ultramax_u21.jpg" },
				{ val:"U-22(ホワイトシルバー)", thumb:"ultramax_u22.jpg" }
			]
		},
		{
			val : "ハリケーン",
			thumbPath:"/curtain/hsn/tarpaulin/img/color/",
			thumb : "hurricane.jpg",
			sheetW : "103cm",
			sheetL : "50m乱",
			cut : true,
			roll : true,
			color : [
				{ val:"ホワイト", thumb:"hurricane_white.jpg" },
				{ val:"ライトグレー", thumb:"hurricane_l_gray.jpg" },
				{ val:"ワサビ", thumb:"hurricane_wasabi.jpg" },
				{ val:"ライトアイボリー", thumb:"hurricane_l_ivory.jpg" },
				{ val:"グレー", thumb:"hurricane_gray.jpg" },
				{ val:"モスグリーン", thumb:"hurricane_mos_green.jpg" },
				{ val:"ベージュ", thumb:"hurricane_beige.jpg" },
				{ val:"シルバー", thumb:"hurricane_silver.jpg" },
				{ val:"エメラルド", thumb:"hurricane_emerald.jpg" },
				{ val:"アイボリー", thumb:"hurricane_ivory.jpg" },
				{ val:"スカイブルー", thumb:"hurricane_sky_blue.jpg" },
				{ val:"イエローグリーン", thumb:"hurricane_yellow_green.jpg" },
				{ val:"イエロー", thumb:"hurricane_yellow.jpg" },
				{ val:"ブルー", thumb:"hurricane_blue.jpg" },
				{ val:"ライトグリーン", thumb:"hurricane_l_green.jpg" },
				{ val:"オレンジ", thumb:"hurricane_orange.jpg" },
				{ val:"ネイビー", thumb:"hurricane_navy.jpg" },
				{ val:"グリーン", thumb:"hurricane_green.jpg" },
				{ val:"レッド", thumb:"hurricane_red.jpg" },
				{ val:"ブラック", thumb:"hurricane_black.jpg" },
				{ val:"ダークグリーン", thumb:"hurricane_d_green.jpg" },
				{ val:"ブリティッシュグリーン", thumb:"hurricane_brit_green.jpg" }
			]
		},
		{
			val : "#1003",
			thumbPath : "/curtain/hsn/tarpo_mesh/img/color/",
			thumb : "1003_lg.jpg",
			sheetW : "189cm",
			sheetL : "52m乱",
			cut : true,
			roll : true,
			color : [
				{ val:"ホワイト", thumb:"1003_wh.jpg" },
				{ val:"グレー", thumb:"1003_gr.jpg" },
				{ val:"スカイブルー", thumb : "1003_bl.jpg" },
				{ val:"ライトグリーン", thumb:"1003_lg.jpg" },
				{ val:"ダークグリーン", thumb:"1003_dg.jpg" }
			]
		},
		{
			val : "#1004",
			thumbPath : "/curtain/hsn/tarpo_mesh/img/color/",
			thumb : "1004_dg.jpg",
			sheetW : "189cm",
			sheetL : "52m乱",
			cut : true,
			roll : true,
			color : [
				{ val:"ホワイト", thumb:"1004_wh.jpg" },
				{ val:"グレー", thumb:"1004_gr.jpg" },
				{ val:"スカイブルー", thumb:"1004_bl.jpg" },
				{ val:"ライトグリーン", thumb:"1004_lg.jpg" },
				{ val:"ダークグリーン", thumb:"1004_dg.jpg" },
				{ val:"ブラック", thumb:"1004_bk.jpg" }
			]
		},
		{
			val : "#1034",
			thumbPath : "/curtain/hsn/tarpo_mesh/img/color/",
			thumb : "1034_gr.jpg",
			sheetW : "189cm",
			sheetL : "52m乱",
			cut : true,
			roll : true,
			color : [
				{ val:"ホワイト", thumb:"1034_wh.jpg" },
				{ val:"グレー", thumb:"1034_gr.jpg" }
			]
		},
		{
			val : "#1005",
			thumbPath : "/curtain/hsn/tarpo_mesh/img/color/",
			thumb : "1005_dg.jpg",
			sheetW : "187cm",
			sheetL : "50m乱",
			cut : true,
			roll : true,
			color : [
				{ val:"グレー", thumb:"1005_gr.jpg" },
				{ val:"ダークグリーン", thumb:"1005_dg.jpg" }
			]
		},
		{
			val : "#2014",
			thumbPath : "/curtain/hsn/tarpo_mesh/img/color/",
			thumb : "2014_wh.jpg",
			sheetW : "187cm",
			sheetL : "100m乱",
			cut : true,
			roll : true,
			color : [
				{ val:"ホワイト", thumb:"2014_wh.jpg" },
				{ val:"ダークグリーン", thumb:"2014_dg.jpg" }
			]
		},
		{
			val : "#2039",
			thumbPath : "/curtain/hsn/tarpo_mesh/img/color/",
			thumb : "2039_bl.jpg",
			sheetW : "189cm",
			sheetL : "52m乱",
			cut : true,
			roll : true,
			color : [
				{ val:"ホワイト", thumb:"2039_wh.jpg" },
				{ val:"グレー", thumb:"2039_gr.jpg" },
				{ val:"スカイブルー", thumb:"2039_bl.jpg" },
				{ val:"ライトグリーン", thumb:"2039_lg.jpg" },
				{ val:"ブラック", thumb:"2039_bk.jpg" }
			]
		},
		{
			val : "#2054",
			thumbPath : "/curtain/hsn/tarpo_mesh/img/color/",
			thumb : "2054_bk.jpg",
			sheetW : "189cm",
			sheetL : "52m乱",
			cut : true,
			roll : true,
			color : [
				{ val:"ホワイト", thumb:"2054_wh.jpg" },
				{ val:"グレー", thumb:"2054_gr.jpg" },
				{ val:"スカイブルー", thumb:"2054_bl.jpg" },
				{ val:"ライトグリーン", thumb:"2054_lg.jpg" },
				{ val:"ブラック", thumb:"2054_bk.jpg" }
			]
		}
	];
	var unitMap = [
		{ val:"原反", unit:"巻" },
		{ val:"カット", unit:"m" }
	];
	var maxValue = 50;
	
	//見積もりフォームの動作設定
	$(".mitumori-form.md-popup").sendMitumori({
		nameList : {
			"pd_vendor_code" : "メーカー名",
			"pd_name" : "商品名",
			"series" : "品番",
			"color" : "カラー",
			"unit" : "単位",
			"pd_color" : "品番",
			"pd_value" : "数量"
		}
	}).each(function() {
		var self = this;
		
		$("[name=color]", self).on("change", function() {
			var series = $("[name=series]", self).val();
			var cloth = selectMap(series,clothMap);
			var color = selectMap($(this).val(),cloth.color);
			var val = cloth.val + (color.val ? " "+color.val : "");
			$("[name=pd_color]", self).val(val);
			if(color.val) {
				fillColorImg(color.val, cloth.thumbPath+color.thumb);
			}
		});
			
		$("input:radio[name=unit]", self).on("change", function(evt) {
			var	val = $(evt.target).val();
			var series = $("[name=series]", self).val();
			var cloth = selectMap(series,clothMap);
			var map = selectMap(val,unitMap);
			var pdColor = $("[name=pd_color]", self).val();
			// 「商品名」を「◯◯◯（原反販売）」または「◯◯◯（カット販売）」にする
			$("[name=pd_name]", self).val($("[name=pd_name]", self)[0].defaultValue+"（"+val+"販売）");
			// 「数量」にシートの規格を表示
			$(".input-value-sub",self).html(cloth.sheetW+"&times;"+((val=="カット")?"&nbsp;":cloth.sheetL+"："));
			// カット販売なら、「数量」を「規格巻数-1」までにする
			$("select[name=pd_value]",self).fillSelectOptions({ min:1, max:(val=="カット")?parseInt(cloth.sheetL,10)-1:maxValue });
			//「数量」の単位を切り替え
			$("[name=pd_unit]",self).val(map.unit)
				.parents(".input-item").eq(0).find(".input-unit").text(map.unit);
		});
		
		//「数量」をセット
		$("select[name=pd_value]",self).fillSelectOptions({ min:1, max:maxValue });
		
		//「オプション他」欄に値をセット
		$("input:radio[name=unit], select[name=pd_value], textarea[name=other]",self).on("change", function() {
			var txt = "";
			var series = $("[name=series]", self).val();
			var cloth = selectMap(series,clothMap);
			if($("input:radio[name=unit]:checked", self).val()=="原反") {
				txt = "原反規格："+cloth.sheetW+"×"+cloth.sheetL;
			} else if($("input:radio[name=unit]:checked", self).val()=="カット")  {
				txt = "シートサイズ："+cloth.sheetW+"×"+$("[name=pd_value]",self).val()+"m";
			}
			if($("textarea[name=other]",self).val()!="") {
				if(txt!="") { txt+="\n\n【備考】\n"; }
				txt += $("textarea[name=other]",self).val();
			}
			$("textarea[name=pd_other]",self).val(txt);
		});
		
		//見積もりフォームのポップアップ時の動作設定
		var popup = new MF_Popup();
		popup.form = $(this);
		popup.triggerArea = $(".mitumori-form-trigger");
		popup.initForm();
		popup.setTriggerArea();
		$(popup.triggerArea).each(function() {
			//「無料お見積もり」ボタンを押した時、
			// 見積もりフォームがポップアップ表示
			$(".submit", this).on("click", function() {
				// 見積もりフォームをリセット
				$(popup.form).resetMitumoriForm()
					.find(".estimate-area.md-mitumori-form").scrollTop(0);
				$(".input-value-sub",self).html("");
				//フォーム情報を切り替え
				var val = $(this).parents(".input-item").eq(0).find("input[name=name]").val();
				var cloth = selectMap(val,clothMap);
				$(".input-series", popup.form).text(cloth.val);
				$("[name=pd_color], [name=series]", popup.form).val(cloth.val);
				fillColorImg(cloth.val, cloth.thumbPath+cloth.thumb);
				// カラーバリエーションがあれば...
				if(!cloth.color) {
					$("[name=color]").removeClass("validate")
						.parents(".el-input-block").hide();
				} else {
					$("[name=color]").addClass("validate").fillSelectOptions({ opList:cloth.color })
						.parents(".el-input-block").show();
				}
				// 原反・カット販売の有無による分岐
				if(!cloth.cut) {
					$("[name=unit]",self).filter("[value='原反']").trigger("click")
						.end().parent(".input-label").hide();
					$(".input-name",self).text($("[name=pd_name]",self)[0].defaultValue+"(原反販売)");
				} else if(!cloth.roll) {
					$("[name=unit]",self).filter("[value='カット']").trigger("click")
						.end().parent(".input-label").hide();
					$(".input-name",self).text($("[name=pd_name]",self)[0].defaultValue+"(カット販売)");
				} else {
					$("[name=unit]",self).parent(".input-label").show();
					$(".input-name",self).text($("[name=pd_name]",self)[0].defaultValue);
				}
				// フォームを表示
				popup.toggleForm();
				return false;
			});
		});
		$(this).on("sendForm", function() {
			popup.toggleForm();
		});
		
		/*使用関数
		-----------------------------------*/
		function selectMap(val,map) {
			var obj = "";
			$(map).each(function() {
				if(this.val==val) { obj=this; }
			});
			return obj;
		};
		function fillColorImg(val,thumb) {
			var imgElem = $("[name=pd_color]",self).parents(".input-item").eq(0).find(".input-image");
			$(imgElem).html("").append(
				$("<img class='mb05' width='100'/>").attr({
					"src" : thumb,
					"alt" : val
				})
			);
		};
	});
});



