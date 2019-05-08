
$(function() {
	// スマホ対応
	$(window).spSwitch();

	//loadComponents読み込み
	if($.fn.loadComponents) {
		$(".aside.md-bb").loadComponents({
			fileUrl : "/js/bb_induction_area.txt"
		});
	}

	// AOS
  AOS.init();
	// モーダル
	baguetteBox.run('.baguette-box',{
		caption: true,
		buttons: true,
	});
  // スライダー
  $(".swiper-container").setSwiper();

  // ヘッダーの切り替えようクラスのトグル
  (function() {
    var $window = $(window);
    var $header = $('.header');
    var triggerPoint = 100;
    $window.on('scroll',function() {
      if($window.scrollTop() > triggerPoint){
        $header.addClass('transform');
      } else {
        $header.removeClass('transform');
      }
    });
    $window.trigger('scroll');
  })();

	//highslide設定
	try {
		hs.graphicsDir = '/js/highslide/graphics/';
		hs.outlineType = 'rounded-white';
		hs.captionEval = 'this.thumb.alt';
	} catch(e) {
		console.log(e);
	}
});




document.mtsw = {};
var commonConfig = {
	"taxRate" : 0.08,
	"selectLineup" : {
		"oc" : {
			"fileUrl" : "/curtain/js/oc.csv",
			"configFile" : "/curtain/js/oc_config.js",
			"keyArray" : ["makerCode","category","chapterName","chapterCode","type","taste","kinou","color","use","style","commonCloth","gara","effectiveWidth","clothDirection","material"],
			"culcPrice" : true,
			"kinouIcons" : ["bouen","washable","syakou","syanetu","seiden","hassui","bouo","boukabi",/*"sg","sh","sr",*/"syousyu","koukin","sek-red","sek-yellow","virus","bouon","syaon","kyuuon","hoon","hoon-a","hoon-b","hoon-c","uv","mirror"],
			"outputConfig" : {
				"itemName" : true,
				"makerName" : true,
				"comment" : true,
				"kinouIcons" : true,
				"label" : true,
				"labels" : true,
				"size" : true,
				"makerPrice" : false,
				"price" : true,
				"washable" : false,
				"syanetu" : false,
				"syakou" : true,
				"sheer" : true,
				"hirohaba" : true,
				"souryou" : false,
				"priceCategory" : "",
				"colorThumb" : true,
			},
			"setDefaultSort" : function() {
				this.sort("popular","desc");
				return this;
			},
		},
		"cr" : {
			"fileUrl" : "/curtainrail/js/cr.csv",
			"configFile" : "/curtainrail/js/cr_config.js",
			"keyArray" : ["makerCode","category","type","size","sizeNote","taste","material","weight","campaign"],
			"outputConfig" : {
				"itemName" : true,
				"labels" : true
			},
			"setDefaultSort" : function() {
				this.sort("popular","desc");
				return this;
			},
		},
		"rs" : {
			"fileUrl" : "/rollscreen/js/rs.csv",
			"keyArray" : ["makerCode","category","chapterName","chapterCode","commonCloth","type","touka","material","kinou","color","gara","option"],
			"outputConfig" : {
				"itemName" : true,
				"makerName" : true,
				"labels" : true,
				"price" : true,
				"syanetu" : true,
				"syakou" : true,
				"sheer" : true,
				"hirohaba" : true
			}
		},
		"ps" : {
			"fileUrl" : "/pleat/js/ps.csv",
			"keyArray" : ["makerCode","category","type","taste","kinou","color","style","commonCloth","gara"],
			"outputConfig" : {
				"itemName" : true,
				"makerName" : true,
				"comment" : true,
				"labels" : true,
				"price" : true,
				"syanetu" : true,
				"syakou" : true,
				"sheer" : true,
				"hirohaba" : true,
				"souryou" : false,
			}
		},
		"ac" : {
			"fileUrl" : "/accordion/js/ac.csv",
			"fileName" : "/accordion/js/ac.csv",
			"keyArray" : ["makerCode","category","taste","kinou","use"],
			"outputConfig" : {
				"itemName" : true,
				"makerName" : true,
				"comment" : true,
				"labels" : true,
				"price" : true,
				"syanetu" : true,
				"syakou" : true,
				"koukin" : true,
				"bouo" : true,
				"souryou" : false,
			}
		},
		"ft" : {
			"fileUrl" : "/floortile/js/ft.csv",
			"configFile" : "/floortile/js/ft_config.js",
			"keyArray" : [],
			"outputConfig" : {
				"itemName" : true,
				"labels" : true
			},
			"setDefaultSort" : function() {
				this.sort("popular","desc");
				return this;
			},
		},
		"cp_rug" : {
			"fileUrl" : "/carpet.rug/js/cp_rug.csv",
			"keyArray" : ["makerCode","category","type","size","taste","kinou","gara","color","shape","pile","stamina","popular","campaign"],
			"kinou" : ["bouen","bouo","koukin","sek-blue","sek-red","sek-orange","hassui","syaon","bouon","wool-mark","br-wool","washable","boudani"],
			//"material" : ["polyester","polypropylene","wool","nylon"],
			"stamina" : ["home","middle","heavy","s-heavy"],
			"pile" : ["cut","loop","cut-loop","saxony","shaggy","syokumou","weave"],
			"campaign" : [],
			"outputConfig" : {
				"itemName" : true,
				"labels" : true
			}
		},
		"tc" : {
			"fileUrl" : "/carpettile/js/tc.csv",
			"keyArray" : ["makerCode","category","type","size","pile","material","stamina","kinou","color","gara","sekouMethod","pdUnitCode","use"],
			"kinou" : ["rief","bouo","sek-blue","sek-red"],
			"kinouIcons" : ["bouen","washable","seiden","hassui","hassui-unofficial","bouo","boukabi","boudani","syousyu","koukin","sek-red","sek-yellow","virus","bouon","tearai","rief"],
			"material" : ["polyester","polypropylene","wool","nylon"],
			"stamina" : ["home","light","middle","heavy","s-heavy"],
			"pile" : ["cut","loop","cut-loop","saxony","shaggy","syokumou","weave"],
			"outputConfig" : {
				"itemName" : true,
				"makerName" : true,
				"label" : true,
				"labels" : true,
				"kinouIcons" : true,
				"syanetu" : true,
				"syakou" : true,
				"souryou" : true,
				"priceByCase" : false,
			}
		},
		"bond" : {
			"fileUrl" : "/carpettile/00_bond/data/bond.csv",
			"keyArray" : ["makerCode","category","type","size","pile","material","stamina","kinou","color","gara","sekouMethod","pdUnitCode"],
			"kinou" : ["rief","bouo","sek-blue","sek-red"],
			"kinouIcons" : ["bouen","washable","seiden","hassui","bouo","boukabi","boudani","syousyu","koukin","sek-red","sek-yellow","virus","bouon","tearai","rief"],
			"material" : ["polyester","polypropylene","wool","nylon"],
			"stamina" : ["home","light","middle","heavy","s-heavy"],
			"pile" : ["cut","loop","cut-loop","saxony","shaggy","syokumou","weave"],
			"outputConfig" : {
				"itemName" : true,
				"makerName" : true,
				"label" : true,
				"labels" : true,
				"kinou" : true,
				"kinouIcons" : true,
				"syanetu" : true,
				"syakou" : true,
				"souryou" : true,
				"priceByCase" : false,
			}
		},
	},
	"size" : {
		"order" : { name:"オーダーサイズ" },
		"kikaku" : { name:"規格サイズ" },
	},
	"material" : {
		"pl" : { name:"ポリエステル" },
		"pe" : { name:"ポリエチレン" },
		"pp" : { name:"ポリプロピレン" },
		"ny" : { name:"ナイロン" },
		"wool" : { name:"ウール" },
	},
	"zaiko" : {
		"ok" : { name:"" },
		"few" : { name:"在庫僅少" },
		"no" : { name:"入荷待ち" },
		"end" : { name:"廃番" },
	},
	"label" : {
		"new" : {
			name : "新発売！",
			img : {
				left : {
					m : "/images/label/label_newitem01_left_m.png",
					l : "/images/label/label_newitem01_left_l.png"
				},
				right : {
					l : "/images/label/label_newitem01_right_l.png"
				}
			}
		},
		"renewal" : {
			name : "リニューアル！",
			img : {
				left : {
					m : "/images/label/label_renewal01_left_m.png",
					l : "/images/label/label_renewal01_left_l.png"
				},
				right : {
					l : "/images/label/label_renewal01_right_l.png"
				}
			}
		},
		"sale" : {
			name : "セール中",
			img : {
				left : {
					m : "/images/label/label_sale01_left_m.png",
				},
				right : {
					l : "/images/label/label_sale01_right_l.png"
				}
			}
		},
		"popular" : {
			name : "人気商品",
			img : {
				left : {
					m : "/images/label/label_popular01_left_m.png"
				},
				right : {
					l : "/images/label/label_popular01_right_l.png"
				}
			}
		},
		"recomend" : {
			name : "おすすめ",
			img : {
				left : {
					m : "/images/label/label_recomend01_left_m.png",
					l : "/images/label/label_recomend01_left_l.png"
				},
				right : {
					l : "/images/label/label_recomend01_right_l.png"
				}
			}
		}
	},
	"kinou" : {
		"bouen" : {
			name : "防炎",
			description : "日本防炎協会の防炎性能試験に合格した「燃えにくい」製品。不特定多数の人が出入りする公共的建造物（病院、診療所、助産所、老人福祉施設）などでは防炎物品の使用が義務付けられています。詳細については、最寄の消防署にお問合せください。",
			icon : {
				s : "/images/icon/spec/spec_icon_bouen_s.png",
				s01 : "/images/icon/spec/spec_icon_bouen_s01.png",
				m : "/images/icon/spec/spec_icon_bouen.png"
			}
		},
		"washable" : {
			name : "ウォッシャブル",
			description : "家庭用洗濯機で洗濯できる(洗濯ネット使用)ことを示すマークです。洗濯による伸縮も少なく、シワにもなりにくい製品です。",
			icon : {
				s : "/images/icon/spec/spec_icon_washable_s.png",
				m : "/images/icon/spec/spec_icon_washable.png"
			}
		},
		"seiden" : {
			name : "制電",
			description : "帯電防止加工を施した、または繊維自体に制電性能を有した素材を使った製品です。静電気によるホコリの付着を防ぎます。",
			icon : {
				s : "/images/icon/spec/spec_icon_seiden_s.png",
				m : "/images/icon/spec/spec_icon_seiden.png"
			}
		},
		"f4" : {
			name : "F☆☆☆☆(ホルムアルデヒド対策品)",
			description : "JIS規格で規定された「ホルムアルデヒド(VOC)放散速度5μg/m2h以下」の基準を満たす商品。",
			icon : {
				m : "/images/icon/spec/spec_icon_f4.png"
			}
		},
		"syakou" : {
			name : "遮光",
			description : "NIF(日本インテリアファブリックス協会)により、遮光性能を有することが認められた製品です。",
			icon : {
				s : "/images/icon/spec/spec_icon_shakou_s.png",
				m : "/images/icon/spec/spec_icon_shakou.png"
			}
		},
		"syanetu" : {
			name : "遮熱",
			description : "窓からの熱の出入りを抑制し、冷暖房の空調効率を上げる、省エネ効果が期待できます。",
			icon : {
				s : "/images/icon/spec/spec_icon_syanetsu_s01.png",
				m : "/images/icon/spec/spec_icon_syanetsu.png",
			}
		},
		"hoon" : {
			name : "保温",
			description : "窓からの熱の出入りを抑制し、冷暖房の空調効率を上げる、省エネ効果が期待できます。",
			icon : {
				s : "/images/icon/spec/spec_icon_hoon_s01.png",
				m : "/images/icon/spec/spec_icon_hoon.png",
			}
		},
		"hoon-a" : {
			name : "保温(Aランク)",
			description : "窓からの熱の出入りを抑制し、冷暖房の空調効率を上げる、省エネ効果が期待できます。省エネ効果：高(15～20％以上)",
			icon : {
				s : "/images/icon/spec/spec_icon_hoon_s01.png",
				m : "/images/icon/spec/spec_icon_hoon_a.png",
			}
		},
		"hoon-b" : {
			name : "保温(Bランク)",
			description : "窓からの熱の出入りを抑制し、冷暖房の空調効率を上げる、省エネ効果が期待できます。省エネ効果：中(10～15％)",
			icon : {
				s : "/images/icon/spec/spec_icon_hoon_s01.png",
				m : "/images/icon/spec/spec_icon_hoon_b.png",
			}
		},
		"hoon-c" : {
			name : "保温(Cランク)",
			description : "窓からの熱の出入りを抑制し、冷暖房の空調効率を上げる、省エネ効果が期待できます。省エネ効果：小",
			icon : {
				s : "/images/icon/spec/spec_icon_hoon_s01.png",
				m : "/images/icon/spec/spec_icon_hoon_c.png",
			}
		},
		"hassui" : {
			name : "はっ水",
			description : "水を弾き落とす「撥水加工」を施した製品。カビや細菌のもととなる、生地が水に濡れた状態を防ぎ、清潔さを保ちます。洗濯による機能劣化も、殆どありません。",
			icon : {
				s : "/images/icon/spec/spec_icon_hassui_s.png",
				m : "/images/icon/spec/spec_icon_hassui.png"
			}
		},
		"hassui-unofficial" : {
			name : "はっ水",
			description : "水を弾き落とす「撥水加工」を施した製品。カビや細菌のもととなる、生地が水に濡れた状態を防ぎ、清潔さを保ちます。洗濯による機能劣化も、殆どありません。",
			icon : {
				s : "/images/icon/spec/spec_icon_hassui_s.png",
				m : "/images/icon/spec/spec_icon_hassui_unofficial.png"
			}
		},
		"bouo" : {
			name : "防汚",
			description : "汚れが目立ちにくくなっていたり(防汚性)、汚れをつきにくくする処理(防汚加工)を施した製品です。",
			icon : {
				s : "/images/icon/spec/spec_icon_bouo_s.png",
				m : "/images/icon/spec/spec_icon_bouo.png"
			}
		},
		"sg" : {
			name : "防汚(SG)",
			description : "ほこり・汚れが付きにくく、洗濯などで汚れが落ちやすいことを示すマークです。",
			icon : {
				s : "/images/icon/spec/spec_icon_bouo_sg_s.png",
				m : "/images/icon/spec/spec_icon_bouo_sg.png"
			}
		},
		"sh" : {
			name : "防汚(SH)",
			description : "「ソイルハイド(Soil Hide)」は、繊維の畏敬構造により、光を反射・吸収・透過させ、汚れを目立たなくする機能性を示すマークです。",
			icon : {
				s : "/images/icon/spec/spec_icon_bouo_sh_s.png",
				m : "/images/icon/spec/spec_icon_bouo_sh.png"
			}
		},
		"sr" : {
			name : "防汚(SR)",
			description : "洗濯などで汚れが落ちやすく、さらに洗濯時の逆汚染による「黒ずみ」を防止する加工を施してあることを示すマークです。",
			icon : {
				s : "/images/icon/spec/spec_icon_bouo_sr_s.png",
				m : "/images/icon/spec/spec_icon_bouo_sr.png"
			}
		},
		"boukabi" : {
			name : "防カビ",
			description : "",
			icon : {
				s : "/images/icon/spec/spec_icon_boukabi_s01.png"
			}
		},
		"syousyu" : {
			name : "消臭",
			description : "生活臭やペット臭、タバコ臭、ホルムアルデヒドなどの悪臭原因物質を吸着・分解する製品です。",
			icon : {
				s : "/images/icon/spec/spec_icon_syousyu_s01.png",
				s01 : "/images/icon/spec/spec_icon_syousyu_s.png",
				m : "/images/icon/spec/spec_icon_syousyu.png"
			}
		},
		"koukin" : {
			name : "抗菌",
			description : "細菌の増殖を抑制する働きのある製品です。",
			icon : {
				s : "/images/icon/spec/spec_icon_koukin_s01.png",
				m : "/images/icon/spec/spec_icon_koukin.png"
			}
		},
		"sek-red" : {
			name : "SEKマーク(制菌加工・特定用途)",
			description : "(社)繊維評価技術評議会の「制菌加工(特定用途)」の基準をクリアした製品で、繊維上の細菌の増殖を抑制する効果があります。医療機関・介護施設および行政機関が必要と認めて指定する場所におすすめです。その他の場所にはご使用になれませんので、SEK(制菌加工・一般用途)をお求め下さい。",
			icon : {
				s : "/images/icon/spec/spec_icon_sek_red_s.png",
				m : "/images/icon/spec/spec_icon_sek_red.png"
			}
		},
		"sek-orange" : {
			name : "SEKマーク(制菌加工・一般用途)",
			description : "(社)繊維評価技術評議会の「制菌加工(一般用途)」の基準をクリアした製品で、繊維上の細菌の増殖を抑制する効果があります。幼稚園や保育園などの免疫力が低い方が出入りする場所や、学校・公共機関など不特定多数の方が出入りする場所におすすめです。",
			icon : {
				s : "/images/icon/spec/spec_icon_sek_orange_s.png",
				m : "/images/icon/spec/spec_icon_sek_orange.png"
			}
		},
		"sek-yellow" : {
			name : "SEKマーク(抗ウイルス加工)",
			description : "(社)繊維評価技術評議会の「抗ウイルス加工」の基準をクリアした製品で、繊維上の特定のウイルスの数を減少させる効果があります。",
			icon : {
				s : "/images/icon/spec/spec_icon_sek_yellow_s.png",
				m : "/images/icon/spec/spec_icon_sek_yellow.png"
			}
		},
		"sek-blue" : {
			name : "SEKマーク(抗菌防臭加工)",
			description : "(社)繊維評価技術評議会の基準をクリアした製品で、抗菌防臭加工の品質と安全性を保証します。",
			icon : {
				s : "/images/icon/spec/spec_icon_sek_blue_s.png",
				m : "/images/icon/spec/spec_icon_sek_blue.png"
			}
		},
		"virus" : {
			name : "抗ウイルス",
			description : "特定のウイルスを減少させる機能があります。",
			icon : {
				s : "/images/icon/spec/spec_icon_virus_s01.png",
				m : "/images/icon/spec/spec_icon_virus.png",
			}
		},
		/*
		"cleanse" : {
			name : "CLEANSE(クレンゼ・抗ウイルス)",
			description : "固定化抗菌成分「Etak&reg;」を繊維表面に強力に固定化する加工技術で、表面に付着したウイルスを減少させる効果があります。",
			icon : {
				m : "/images/icon/spec/spec_icon_cleanse.png",
			}
		},
		*/
		"uv" : {
			name : "UVカット",
			description : "",
			icon : {
				s : "/images/icon/spec/spec_icon_uv_s01.png",
			}
		},
		"mirror" : {
			name : "ミラーレース",
			description : "",
			icon : {
				s : "/images/icon/spec/spec_icon_mirror_lace_s.png",
			}
		},
		"bouon" : {
			name : "防音",
			description : "遮音製品の中でも、特に遮音性能に特化した製品です。より本格的な音対策が求められる場所におすすめ。",
			icon : {
				s : "/images/icon/spec/spec_icon_bouon_s01.png",
				m : "/images/icon/spec/spec_icon_bouon.png",
			}
		},
		"syaon" : {
			name : "遮音",
			description : "裏面等にコーティングやラミネート加工を施すことで、遮音効果を高めた製品。車の騒音や踏み切り音など室外からの騒音対策、特に高音域に効果を発揮します。音が室外へ漏れるのも緩和するため、ペットの鳴き声やお子様のいるお部屋にも効果的です。",
			icon : {
				s : "/images/icon/spec/spec_icon_syaon_s.png",
				m : "/images/icon/spec/spec_icon_syaon.png",
			}
		},
		"kyuuon" : {
			name : "吸音",
			description : "",
			icon : {
				s : "/images/icon/spec/spec_icon_kyuuon_s01.png",
				m : "/images/icon/spec/spec_icon_kyuuon.png",
			}
		},
		"ecomark" : {
			name : "エコマーク認定商品",
			description : "環境保全型商品として(公財)日本環境協会エコマーク事業局の認定を受けた製品です。",
			icon : {
				m : "/images/icon/spec/spec_icon_ecomark.png"
			}
		},
		"green" : {
			name : "グリーン購入法適合品",
			description : "(財)日本環境協会により環境保全に役立つと認められた製品につけられるマーク。",
			icon : {
				m : "/images/icon/spec/spec_icon_green.png"
			}
		},
		"green-guard" : {
			name : "グリーンガード",
			description : "",
			icon : {
				m : "/images/icon/spec/spec_icon_greenguard.png"
			}
		},
		"green-guard-children" : {
			name : "グリーンガード(チルドレン＆スクール)",
			description : "",
			icon : {
				m : "/images/icon/spec/spec_icon_greenguard_children.png"
			}
		},
		"rief" : {
			name : "学校施設優良部品推奨品",
			description : "(社)文教施設協会により認定された、学校施設等での使用に適した製品。教育施設での活動を支え、安全・安心性の担保された製品であることを示します。",
			icon : {
				s : "/images/icon/spec/spec_icon_rief_s.png",
				m : "/images/icon/spec/spec_icon_rief.png"
			}
		},
		"cri" : {
			name : "CRIグリーンラベル＋",
			description : "GREEN LABEL PLUSは、米国CRI(カーペット＆ラグ協会)が承認する認証制度で、ホルムアルデヒドといった13種類の揮発性物質等の放散量を測定し、室内空気環境の厳格な基準をクリアした商品に与えられるマークです。ビルの環境負荷の評価基準であるLEEDポイントを取得することができます。",
			icon : {
				m : "/images/icon/spec/spec_icon_cri.png"
			}
		}
	}
};
