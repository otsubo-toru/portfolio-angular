//Promiseで非同期通信の結果を取得する
//http://uhyohyo.net/javascript/16_5.html

//Promise polyfill（IE11、10用）
//https://www.promisejs.org/
//先にPromise polyfill(promise-7.0.4.min.js)を読み込んでおくこと

//SP版ヘッダーは当JS内に直接記述（gnSetSpHeader）
//SP時黒バックのソースは当JSに記述（spBgToggle）

window.addEventListener('DOMContentLoaded', function() {

	function xhrPromise(url){

		return new Promise(function(fulfill,reject){
			var xhr=new XMLHttpRequest();
			xhr.open("GET",url);
			xhr.send(null);

			//loadend=ie9 NG
//			xhr.addEventListener("loadend",function(e){
			xhr.addEventListener("load",function(e){
				// loadendイベントはリクエストが成功した場合も失敗した場合も呼び出される
				if(xhr.status===0){
					//失敗した場合はstatusが0。ここではとりあえずエラー内容は文字列で
					reject("failed");
				}else{
					//statusが0以外の場合リクエスト成功
					var f = document.getElementById("gnav");
//					f.innerHTML = xhr.responseText;
					f.insertAdjacentHTML('afterbegin', xhr.responseText);
					fulfill(xhr.responseText);
				}
			});
		});
	}
	var gnMenuObj=new xhrPromise("/js/gnav/global_navi.html");
	gnMenuObj.then(function(){
		//成功した場合
		gnMenuAction();
	})["catch"](function(err){
		//失敗した場合
		console.log('err');
	});

//	var gnMenuObj=new xhrPromise("/js/gnav/global_navi.html");
//	gnMenuObj.then(function(){
//		//成功した場合
//		gnMenuAction();
//	},function(err){
//		//失敗した場合
//		console.error('err');
//	});

	//------------------------------------------------------------------
	//グローバルナビ内処理
	function gnMenuAction(){
		//回転対応
		//SP時エレメントの移動を行っているので、横にしたとき戻すのより手っ取り早くリロード
		window.onorientationchange = function () {
			//タテヨコ取得する場合
			//		var deg = window.orientation;
			//		alert('回転：' + deg);
			//		if(deg == 90 || deg == -90){
			//			alert('回転2：' + deg);
			//			closeSmSp();
			//		}
//			closeSmSp();
//			delete_element('spBg');
			location.reload();
		}
		//PC時右端ランダム表示
//		gnRandgnSp();//2018/01 フォトコン固定化

		//スマホ化（リサイズ）処理
		//2018 0730版
		var spchk = 0;
		if(getSpMode()){
			gnSetSpHeader();//SPヘッダー記述
			gnSpMoveH1();//H1・ぱんくずの移動
			//			gnSpPageAdjust();//ヘッダー分高さ調整
			gnCompHeader();//ヘッダーの高さ圧縮
			spchk++;
		}
		if(!spchk){
			window.onresize = function(){
				if(getSpMode()){
					gnSetSpHeader();//SPヘッダー記述
					gnSpMoveH1();//H1・ぱんくずの移動
					gnCompHeader();//ヘッダーの高さ圧縮
				}
			}
		}
//2018 07以前
//		window.onresize = function(){
////			location.reload();
//			if(getSpMode()){
//				gnSetSpHeader();//SPヘッダー記述
//				gnSpMoveH1();//H1・ぱんくずの移動
//				//			gnSpPageAdjust();//ヘッダー分高さ調整
//				gnCompHeader();//ヘッダーの高さ圧縮
//			}
//		}
		//リサイズここまで
		
		
		//要素スクロール
		window.addEventListener('scroll', function(){
			if(getSpMode()){
				gnCompHeader();
			}
		}, false);

		
		//=======================================
		//全体クリック取得（クリック系のイベントはすべてこの中で処理すること）
		document.getElementsByTagName('body')[0].addEventListener('click', function(e){

			var orignal = e.target;
			var tmp = orignal;
			var flg = true;
			var u = 0;

			while(flg){//順に親要素をチェック

				//下層からチェック
				if(tmp.className == 'gn_child_body active'){
					flg = false;
				}else if(tmp.className == 'gn_item_area'){//メインエリア
					flg = false;
				}else if(tmp.className == 'gn_itemarea_close_btn'){//閉じるボタン1（メインエリア用）
					closeBtnAction(orignal);
					flg = false;
				}else if(tmp.classList.contains('gn_submenu_items')){//エリアメニューアクション
					areaMenuAction(orignal);
					flg = false;
				}else if(tmp.className == 'gn_submenu_close_btn'){//閉じるボタン2（商品以外サブメニュー用）
					closeBtnActionSm(orignal);
					flg = false;
				}else if(tmp.className == 'gn_itemcate_close_btn'){//閉じるボタン3（商品カテゴリ一覧）
					closeBtnActionIC(orignal);
					flg = false;
				}else if(tmp.id == 'gnItemsCate'){//商品カテゴリ一覧内のクリック
					itemsCateAction(orignal);
					flg = false;
				}else if(tmp.id == 'gnItems'){//サブメニューアクション
					subMenuAction(orignal);
					flg = false;
				}else if(tmp.id == 'gnMenu'){//メインメニューアクション
					mainMenuAction(orignal);
					flg = false;

					//以下SP
				}else if(tmp.id == 'gnSpCloseBtn'){//SP閉じるボタン
					closeSmSp();
					flg = false;
				}else if(tmp.className == 'icon-arr-left gn_sp_listback_area'){//エリア詳細からエリアメニューへ
					spAreaBack(orignal);
					flg = false;
				}else if(tmp.className == 'icon-arr-left gn_sp_listback_item'){//商品メニューから戻る
					spAreaMenuback();
					flg = false;
				}else if(tmp.id == 'gnSpItemBack'){//商品を探す からの＜
					spHMenuItem();
					flg = false;
				}else if(tmp.id == 'gnSpMenuItems'){//spメニュー(商品を探す)
					spHMenuItem();
					flg = false;
				}else if(tmp.id == 'gnSpSrBack' || tmp.id == 'gnSpDiyBack' || tmp.id == 'gnSpBbBack'){//spメニュー（他）から戻る
					spSubMenusClose();
					flg = false;
				}else if(tmp.id == 'pcBtn2'){//PC版に切り替えボタン
					setGnSpbtn();
					return false;
				}else if(tmp.id == 'gnSpMenu'){//spメニュー（他）
					spSubMenus(orignal);
					flg = false;
				}else if(tmp.id == 'gnHMenu'){//ハンバーガー
					spHMenu();
					flg = false;
				}else if(tmp.id == 'spBg'){//実質SP時の領域外
					closeSmSp();
					flg = false;
					//その他
				}else if(tmp.tagName == 'BODY'){//グローバルナビ以外（領域外）
					closeSm(orignal);
					flg = false;
				}else{
					tmp = tmp.parentNode;//次の親階層へ
				}
			}
		},false);
		//	mainMenuWidthFix();メインメニュー幅調整【未使用】

		//=======================================
		//サブメニュー展開+メインメニューactive
		function mainMenuAction(target){
			if(target.tagName != 'LI'){
				var tmp_tgt = target;
				var i = 0;
				while(i < 1){
					if(tmp_tgt.tagName == 'LI'){
						target = tmp_tgt;
						i++;
					}else{
						tmp_tgt = tmp_tgt.parentNode;
					}
				}
			}
			var tgtId = target.id;
			subMenuToggle(tgtId);

			//商品カテゴリ一覧
			function subMenuToggle(tgtId){
				var t_Id = tgtId + 's';
				var t1= document.getElementById(tgtId);//gnItem
				var t2 = document.getElementById(t_Id);//gnItems
				itemMenuOff();
				areaMenuOff();
				areaOff();
				if(t2.classList.contains('active')){
					subMenuOff();
				}else{
					subMenuOff();
					t2.classList.add('active');
				}
				if(t1.classList.contains('active')){
					itemsCateOff();
					mainMenuOff();
				}else{
					mainMenuOff();
					t1.classList.add('active');
					if(t1.id == 'gnItem'){
						itemsCateOnOff();
					}
				}
			}
		}

		/********************************************************/
		//子コンテンツエリア開閉（サブメニュークリック）
		function subMenuAction(target){
			//<li>内の画像やアイコンフォント回避
			//targetがliタグ以外なら親の階層をliタグまで遡る
			if(target.tagName != 'LI'){
				var tmp_tgt = target;
				var i = 0;
				while(i < 1){
					if(tmp_tgt.tagName == 'LI'){
						target = tmp_tgt;
						i++;
					}else{
						tmp_tgt = tmp_tgt.parentNode;
					}
				}
			}
			//SP時の見出し部分を除外
			if(target.className != 'gn_sp_menu_title'){
				itemsCateOff();
				itemMenuOff();
				spSubMenuToggle();//sp時サブメニュー表示トグル

				target.classList.add('selected');
				areaMenuOff();
				areaOff();
				var tgtId = target.id;
				var t_Id = tgtId + 'Child';
				itemAreaOff(t_Id);
				document.getElementById(t_Id).classList.add('active');//
				areaMenuNaviTxt(t_Id);

				//SP
				if(getSpMode()){
					delete_element('gnSpCloseBtn');
					closebtnSp(document.getElementById('childArea'));
					//SP overflow-y処理
					var tg = document.getElementById(t_Id);
					gnSetEleScroll(tg);
				}
			}

		}

		/********************************************************/
		//商品カテゴリー一覧をクリックした際のジャンプ処理
		function itemsCateAction(target){
			if(target.tagName != 'LI'){
				var tmp_tgt = target;
				var i = 0;
				while(i < 1){
					if(tmp_tgt.tagName == 'LI'){
						target = tmp_tgt;
						i++;
					}else{
						tmp_tgt = tmp_tgt.parentNode;
					}
				}
			}
			var tgtId = target.id;
			var flgs = tgtId.split('-');//gnCt-Window
			itemAreaOff('gnItem' + flgs[1] + 'Child');
			itemsCateOnOff();
			document.getElementById('gnItem' + flgs[1]).classList.add('selected');//サブメニュー選択状態に
			document.getElementById('gnItem' + flgs[1] + 'Child').classList.add('active');//メインエリア表示
			document.getElementById(flgs[0]).classList.add('gn_submenu_select');//エリアメニュー選択状態に
			document.getElementById(flgs[0] + 'Child').classList.add('active');//エリアコンテンツ表示
			areaMenuNaviTxtOff('gnItem' + flgs[1] + 'Child');//gnItemWindowChild
		}

		/********************************************************/
		//エリアメニュー（商材名）のオンオフクラス付与
		function areaMenuAction(target){
			if(target.tagName != 'LI'){
				var tmp_tgt = target;
				var i = 0;
				while(i < 1){
					if(tmp_tgt.tagName == 'LI'){
						target = tmp_tgt;
						i++;
					}else{
						tmp_tgt = tmp_tgt.parentNode;
					}
				}
			}
			areaMenuOff();
			target.classList.add('gn_submenu_select');

			//メインエリアの商材メニュー表示
			itemTypeToggle(target.id);//gnCt

			//***********************************//
			//SP対応
			var spflg = getSpMode();
			if(spflg){
				var tp = target.parentNode;
				var tpp = tp.parentNode;
				var tph = tp.clientHeight;
				var tpph = tpp.clientHeight;
				tp.classList.add('gn_sp_d_no');
				
				var kk = tp.previousElementSibling;//
				kk.classList.add('gn_sp_d_no');
				
				//「メーカーで選ぶ」を末尾の方に下げる
				spMoveElement('jsEleMoveCt');//カーテン
				spMoveElement('jsEleMoveCr');//カーテンレール
				spMoveElementBl();//ブラインド（2回入れ替える・専用）
				spMoveElement('jsEleMoveRs');//ロールスクリーン
				spMoveElement('jsEleMovePs');//プリーツスクリーン
				spMoveElement('jsEleMoveTc');//タイルカーペット
				spMoveElement('jsEleMovePr');//ピクチャーレール
				
				tpp.style.height = tpph - tph;//iOS hack
				
				var sid = target.id + 'Child';
				gnSetEleScroll(document.getElementById(sid));
				
			}
			//***********************************//

			function itemTypeToggle(tgtId){
				var t_Id = tgtId + 'Child';
				var ppId = document.getElementById(tgtId).parentNode.parentNode.id;//gnItemWindowChild
				areaMenuNaviTxtOff(ppId);
				itemAreaOff(ppId);
				//対象の商材を表示に
				document.getElementById(t_Id).classList.add('active');//active付与
			}
		}
		
		//=======================================
		//閉じるbutton(item)
		function closeBtnAction(target){
			var tid = target.parentNode.id;
			menuOff(tid, 'active');
			areaOff();
			itemMenuOff();
		}
		
		//=======================================
		//閉じるbutton(submenu)
		function closeBtnActionSm(target){
			target.parentNode.parentNode.classList.remove('active');
			mainMenuOff();
		}
		
		//=======================================
		//閉じるbutton(gnItemCate)
		function closeBtnActionIC(target){
			target.parentNode.classList.remove('active');
		}

		//=======================================
		//枠外クリックの挙動
		function closeSm(target){
			var f = document.getElementById('gnItems');

			if(f.classList.contains('active')){//商品サブメニューがアクティブ
				subMenuOff();//商品メニュー全閉じ版
				mainMenuOff();//商品メニュー全閉じ版

				//メインエリアがactiveの場合はメインエリアを非activeに
				itemMenuOff();
				areaMenuOff();
				areaOff();

			}else{//商品メニューが非アクティブ
				var subMenuIdArr = ['gnSrs','gnDiys','gnBbs'];
				var tmp_tgt = target;
				var sub_tgt = '';
				var flg = 0;
				var i = 0;
				while(i < 1){
					var t = tmp_tgt.id;
					
					if(t != ''){
						var len = subMenuIdArr.length;
						for(var j=0;j<len;j++){
							if(t == subMenuIdArr[j]){
								sub_tgt = t;
								flg++;
							}
						}
					}
					if(tmp_tgt.tagName == 'BODY'){
						i++;
					}
					if(flg != 0){
						i++;
					}else{
						tmp_tgt = tmp_tgt.parentNode;
					}
				}
				if(sub_tgt == ''){
					subMenuOff();
					mainMenuOff();
				}
			}
		}
		
		//=======================================
		//メインメニュー
		function mainMenuOff(){
			menuOff('gnMenu','active');
		}
		//サブメニュー
		function subMenuOff(){
			menuOff('gnSubMenu', 'active');
		}
		//商材メニュー（大カテゴリ）
		function itemMenuOff(){
			menuOff('gnItems','selected');
		}
		//エリアを非表示
		function areaOff(){
			menuOff('childArea','active');
		}
		//商品ごとのエリアリセット
		function itemAreaOff(id){
			menuOff(id + 'Area','active');
		}

		//=======================================
		//各メニューの表示フラグを外す（指定エレメントの一階層下の子要素からクラス除去）
		//親のIDと外すクラス名
		function menuOff(p_Id, className){
			var p = document.getElementById(p_Id);
			var child = p.children;
			var len = child.length;
			for(var i=0;i<len;i++){
				p.children[i].classList.remove(className);
			}
		}
		//=======================================
		//エリアメニューのアクティブクラスを外す（エリアメニュー専用）
		function areaMenuOff(){
			var p = document.getElementById('childArea');
			var len=p.children.length;
			for(var i=0;i<len;i++){
				var child = p.children[i];
				var lenC= child.children.length;
				for(var j=0;j<lenC;j++){
					gChild = child.children[j];
					var lenK = gChild.children.length;
					for(var k=0;k<lenK;k++){
						gChild.children[k].classList.remove('gn_submenu_select');
					}
				}
			}
		}
		//=======================================
		//メインエリアメニュー選択前の案内メッセージ
		//初期は表示、エリアメニュー展開時に非表示へ
		function areaMenuNaviTxt(id){
			var all = document.getElementById('childArea');
			var allTgt = all.getElementsByClassName('gn_area_menu_nav_txt');
			var len = allTgt.length;
			for(var i=0;i<len;i++){
				allTgt[i].classList.add('d_no');
			}
			var target = document.getElementById(id);
			var tgt = target.getElementsByClassName('gn_area_menu_nav_txt');
			tgt[0].classList.remove('d_no');
		}
		//=======================================
		//↑エリアメニュー展開時に非表示にする
		function areaMenuNaviTxtOff(id){//gnItemWindowChild  gnCtChild
			var target = document.getElementById(id);
			var tgt = target.getElementsByClassName('gn_area_menu_nav_txt');
			tgt[0].classList.add('d_no');
		}
		//=======================================
		//gnItemsCate開閉
		function itemsCateOnOff(){
			var c = document.getElementById('gnItemsCate');
			if(c.classList.contains('active')){
				itemsCateOff();
			}else{
				c.classList.add('active');
			}
		}
		//gnItemsCate閉じる専用
		//=======================================
		function itemsCateOff(){
			document.getElementById('gnItemsCate').classList.remove('active');
			//		areaOff();
		}
		//=======================================
		//【未使用】
		//メインメニュー お知らせ枠の幅調整
		//メインメニュー（id:gnMenu）にgngm1クラスが必要
		//幅自動調整する要素（1つのみ）にgngm1_wideクラスが必要
		function mainMenuWidthFix(){
			var mm = document.getElementById('gnMenu');
			if(mm.classList.contains('gngm1')){
				var mmw = mm.offsetWidth;
				var cw = 0;
				var mm_c = mm.children;
				var len = mm_c.length;
				for(var i=0;i<len;i++){
					if(mm_c[i].classList.contains('gngm1_wide')){
						var tmp = mm_c[i];
					}else{
						cw += mm_c[i].offsetWidth;
					}
				}
				var tmpws = 950 - cw;
				tmp.style.width = tmpws + 'px';
			}
		}
		
		//=======================================
		//PC版右端ランダム表示
		function gnRandgnSp(){
			var msg = '';
			var s = Math.floor( Math.random () * 10);
			if((s % 2) != 0){//奇数
				msg = '<a href="/original/"><span class="gn_mm_mark_link">◆</span>売れてます！ 松装オリジナル</a>';
			}else{//偶数
				msg = '<a href="/voc/photocon"><span class="gn_mm_mark_link">◆</span>フォトコンテスト開催中！</a>';
			}
			var t = document.getElementById('gnSp');
			t.innerHTML = '<div>' + msg + '</div>';
		}
		
		//=======================================
		//SP:ハンバーガーより（メインメニュートグル）
		function spHMenu(){
			var t = document.getElementById('gnSpMenu');
			var p = document.getElementById('gnHeaderSp');
			var pn = p.nextSibling;
			if(pn.id == 'spBg'){
				closeSmSp();
				gnBgFixed(false);//背景固定解除
			}else{
				document.getElementById('gnHMenu').classList.add('active');
				document.getElementById('gnSpMenu').classList.add('active');
				closebtnSp(t);//閉じるボタン設置
				spBgToggle();
				gnSetEleScroll(t);//要素内スクロール化
				gnBgFixed(true);//背景固定
			}
		}
		
		//=======================================
		//背景ブラックアウトトグル
		function spBgToggle(){
			var spflg = getSpMode();
			if(spflg){//SP時のみ
				var p = document.getElementById('gnHeaderSp');
				var pn = p.nextSibling;
				if(pn.id == 'spBg'){
					delete_element('spBg');
				}else{
					var ch = document.body.clientHeight;
					ch = ch + spGetHeaderHeight();
					var insert = '<div id="spBg" class="gn_spBgCover" style="height:' + ch + 'px;">&nbsp;</div>';
					p.insertAdjacentHTML('afterend',insert);

					//仮 gnavの位置調整
					var g = document.getElementById('gnav');
					var gt = g.offsetTop;
				}
			}
		}
		
		//=======================================
		//ヘッダーの高さ取得
		function spGetHeaderHeight(){
			var p = document.getElementById('gnHeaderSp');
			var ph = p.clientHeight;
			return ph;
		}

		//=======================================
		//SPサブメニュー（汎用）トグル
		function spSubMenus(orignal){
			var tIdA = orignal.id.split('-');
			//		var tIdA = tId.split('-');
			var t = document.getElementById(tIdA[0] + 's');
			if(t.classList.contains('active')){
				document.getElementById('gnSpMenu').classList.add('active');
				t.classList.remove('active');
				delete_element('gnSpCloseBtn');//閉じるボタン除去（初期化）
				closebtnSp(document.getElementById('gnSpMenu'));//サブメニューに閉じるボタン設置
			}else{
				document.getElementById('gnSpMenu').classList.remove('active');
				t.classList.add('active');
				delete_element('gnSpCloseBtn');//閉じるボタン除去（初期化）
				closebtnSp(document.getElementById('gnSubMenu'));//メインメニューに閉じるボタン設置
				
				gnSetEleScroll(t.children[0]);//サブメニュー内容スクロール化
			}
		}
		
		//=======================================
		//SPサブメニュー（汎用）閉じる
		function spSubMenusClose(){
			var t = document.getElementById('gnSubMenu');
			var len=t.children.length;
			for(var i=0;i<len;i++){
				var child = t.children[i];
				if(child.classList.contains('active')){
					child.classList.remove('active');
				}
			}
			document.getElementById('gnSpMenu').classList.add('active');//メインメニュー表示
			delete_element('gnSpCloseBtn');//閉じるボタン除去（初期化）
			closebtnSp(document.getElementById('gnSpMenu'));//メインメニューに閉じるボタン設置
		}

		//=======================================
		//SPサブメニュー（商品を探す）トグル
		function spHMenuItem(){
			var t = document.getElementById('gnSpMenu');
			if(t.classList.contains('active')){
				document.getElementById('gnSpMenu').classList.remove('active');
				document.getElementById('gnItems').classList.add('active');
				delete_element('gnSpCloseBtn');//閉じるボタン除去（初期化）
				closebtnSp(document.getElementById('gnSubMenu'));//サブメニューに閉じるボタン設置
			}else{
				document.getElementById('gnSpMenu').classList.add('active');
				document.getElementById('gnItems').classList.remove('active');
				delete_element('gnSpCloseBtn');//閉じるボタン除去（初期化）
				closebtnSp(document.getElementById('gnSpMenu'));//メインメニューに閉じるボタン設置
			}
		}

		//=======================================
		//SPメインメニュー閉じる
		function spHMenuItemClose(){
			var t = document.getElementById('gnSpMenu');
			if(t.classList.contains('active')){
				t.classList.remove('active');
			}
		}
		//=======================================
		//SPサブメニュー（商品を探す）閉じる
		function spSubMenuClose(){
			var t = document.getElementById('gnItems');
			if(t.classList.contains('active')){
				t.classList.remove('active');
			}
			if(t.classList.contains('gn_sp_d_no')){
				t.classList.remove('gn_sp_d_no');
			}
		}

		//=======================================
		//SP商品カテゴリメニュートグル
		function spAreaMenuback(){
			areaOff();
			spSubMenuToggle();
			itemMenuOff();

			delete_element('gnSpCloseBtn');
			closebtnSp(document.getElementById('gnSubMenu'));//メインメニューに閉じるボタン設置
		}

		//=======================================
		//SP商品詳細からメニューへ戻る
		function spAreaBack(orignal){

			//エリアメニューのdisplayをblockに
			var t = orignal.parentNode.parentNode.parentNode.parentNode;//gnItemWindowChildArea
			var tp = t.previousElementSibling;
			//		tp.style.display = 'block';
			tp.classList.remove('gn_sp_d_no');
			tp.previousElementSibling.classList.remove('gn_sp_d_no');//カテゴリ名（見出し）も表示へ
			
			areaMenuOff();
			//エリアコンテンツのactiveを外す（一括で外す手もあるか）
			var t2 = orignal.parentNode.parentNode.parentNode;
			t2.classList.remove('active');
		}

		//=======================================
		//SP時サブメニュー表示トグル（PC時は常時表示のため）
		function spSubMenuToggle(){
			var t = document.getElementById('gnItems');
			if(t.classList.contains('gn_sp_d_no')){
				t.classList.remove('gn_sp_d_no');
			}else{
				t.classList.add('gn_sp_d_no');
			}
		}

		//=======================================
		//sp時領域外処理（=背景クリック）
		//Android（chrome）ではOKだがiOSでは反応せず
		function closeSmSp(){
			//スマホ画面遷移の流れ
			//【SPメインメニュー表示】
			//①spBG追記（jsよりコード記述）
			//②gnSpMenuにactiveクラス追加（SPメインメニュー表示）

			//【SPサブメニュー表示（商品を探すの場合）】
			//③②のactiveクラスを削除（SPメインメニューを非表示に）
			//④gnSubMenu下gnItemsにactiveクラスを追加（SP商品大カテゴリ表示）
			//④+サブメニュー上部の「商品を探す」をクリックで反応しないように

			//【SPエリアメニュー表示】
			//⑤④にgn_sp_d_noクラス追加（SPサブメニューを非表示に）
			//（PC時は④＝サブメニューは常時表示だがスマホ時は消す）
			//⑥childArea下gnItemXXXChildにactiveクラス追加（SPエリアメニュー表示）
			//⑦④下、選択アイテム（例：gnItemWindow=窓まわり）にselectedクラス追加
			//（PC版の処理・SPサブメニューが表示されないので実質ここでは影響なし）

			//【SPエリアコンテンツ表示】
			//⑧⑥下のul.gn_submenu_itemsにgn_sp_d_noクラス追加（エリアメニュー非表示）
			//⑨gnItemXXXChildArea下、「⑧のID+Child」にactiveクラス追加（エリアコンテンツ表示）

			//------------------
			//以下すべて初期化
			//------------------

			//SP閉じるボタン除去
			delete_element('gnSpCloseBtn');

			//エリアコンテンツの初期化⑥～⑨
			// areaMenuOffの変形（childAea以下のすべての解除）
			var p = document.getElementById('childArea');
			//第一階層
			var len=p.children.length;
			for(var i=0;i<len;i++){
				var child = p.children[i];
				var lenC= child.children.length;
				delete_class(child,'active');//商品種類ごとエリア親要素（gnItemWindowChild）
				//第二階層
				for(var j=0;j<lenC;j++){
					gChild = child.children[j];
					//エリアメニュー親要素（UL）からgn_sp_d_no削除
					if(gChild.classList.contains('gn_submenu_items')){
						if(gChild.classList.contains('gn_sp_d_no')){
							gChild.classList.remove('gn_sp_d_no');
						}
					}
					//第三階層
					var lenK = gChild.children.length;
					for(var k=0;k<lenK;k++){
						delete_class(gChild.children[k],'gn_submenu_select');//エリアメニュー選択時class
						delete_class(gChild.children[k],'active');//エリアコンテンツ内容
					}
				}
			}
			//サブメニュー④・⑤
			menuOff('gnSubMenu','active');
			//⑤の初期化
			var s = document.getElementById('gnSubMenu');
			var len=s.children.length;
			for(var i=0;i<len;i++){
				var child = s.children[i];
				if(child.classList.contains('gn_sp_d_no')){
					child.classList.remove('gn_sp_d_no');
				}
				//④+サブメニュー項目のselected解除（before・afterの下矢印解除のため）
				var lenC = child.children.length;
				for(var j=0;j<lenC;j++){
					gChild = child.children[j];
					if(gChild.classList.contains('selected')){
						gChild.classList.remove('selected');
					}
				}
			}
			//メインメニュー②
			var t = document.getElementById('gnSpMenu');
			if(t.classList.contains('active')){
				t.classList.remove('active');
			}
			//bg①
			spBgToggle();//SP BGトグル
			//すべて初期化終了
			gnBgFixed(false);//画面固定解除
		}

		//=======================================
		//SP閉じるボタン記述
		//指定エレメントの中に追記
		//除去はdelete_elementを使用（id=gnSpCloseBtn）
		function closebtnSp(t){
			var f = getSpMode();
			if(f){
				var btn = document.createElement('p');
				btn.innerHTML = '<img src="/js/gnav/img/sp_close_btn.png">';
				btn.id = 'gnSpCloseBtn';
				t.insertBefore(btn, t.firstChild);
			}
		}

		//=======================================
		//SPエリアコンテンツの順番入れ替え（移動）
		//指定ID下の「gn_js_move_tgt」クラスを「gn_js_move_goto」クラスの下へ
		//指定ID下の階層問わず、「gn_js_move_tgt」「gn_js_move_goto」クラスは一つであること
		function spMoveElement(id){
			//カーテン
			var m = document.getElementById(id);
			var mTgt = m.getElementsByClassName('gn_js_move_tgt');
			var mGoto = m.getElementsByClassName('gn_js_move_goto');

			var tgtCopy = mTgt[0].cloneNode(true);
			
			var tdi = '';
			if(mTgt[0].id == ''){
				mTgt[0].id = 'gnTmpDel';
				tdi = 'gnTmpDel';
			}else{
				tdi = mTgt[0].id + 'del';
			}
			var mGotoP = mGoto[0].parentNode;
			mGotoP.insertBefore(tgtCopy, mGoto[0].nextElementSibling);
			delete_element(tdi);
		}

		//=======================================
		//SPエリアコンテンツの順番入れ替え（移動）：ブラインド専用
		function spMoveElementBl(){
			var m = document.getElementById('jsEleMoveBl');
			var mTgt = m.getElementsByClassName('gn_js_move_tgt');
			mTgt[0].id = 'tmpOrg';
			var tgtCopy = mTgt[0].cloneNode(true);
			tgtCopy.id = 'jsEleMoveBl2';
			m.appendChild(tgtCopy);
			delete_element('tmpOrg');
			
			//2回目
			var m2 = document.getElementById('jsEleMoveBl2');
			var mTgt2 = m2.getElementsByClassName('gn_js_move_tgt');
			mTgt2[0].id = 'tmpOrg';
			var tgtCopy2 = mTgt2[0].cloneNode(true);
			m2.appendChild(tgtCopy2);
			delete_element('tmpOrg');
		}

		//=======================================
		//SPヘッダー書き出し
		function gnSetSpHeader(){
			var gnHeader = '<div id="gnHeaderSp"><div><img src="/js/gnav/img/hamburger_menu.png" id="gnHMenu"><a href="/"><img src="/js/gnav/img/sp_hd_mtsw_logo.png" alt="matusou" class="gn_header_logo_sp"><img src="/js/gnav/img/sp_hd_mtsw_logo_comp.png" alt="matusou" class="gn_header_logo_sp_comp"></a><a href="https://www.matusou.co.jp/mm_form/mm_confirm.php"><img src="/js/gnav/img/cart.png"></a></div></div>';
			
			//旧PC切り替えボタン非表示
			document.getElementById('pc_switch').style.display = 'none';
			var p = document.getElementById('page');
			p.insertAdjacentHTML('beforebegin',gnHeader);
			//ヘッダー固定処理
			gnSpHeaderFixed();
		}
		
		//=======================================
		//SP時ヘッダー固定処理（下準備）
		function gnSpHeaderFixed(){
			//ナビ本体の移動
			var p = document.getElementById('page');
			var c = document.createElement('div');
			var g = document.getElementById('gnav');
			c.id = "gnav_outer";
			p.appendChild(c);
			p.insertBefore(c,g);//page直下にgnav_outer
			c.appendChild(g);//gnav_outerの中にgnav移動
		}
		
		//=======================================
		//スクロール時のヘッダー圧縮処理
		//ヘッダー圧縮と#gnav_outerのtop調整
		function gnCompHeader(){
			var h = document.getElementById('gnHeaderSp');
			var g = document.getElementById('gnav_outer');
			var y =  window.pageYOffset;
			if(y > 50){
				h.classList.add('gn_scroll_fixed');
				g.classList.add('gn_outer_comp');
			}else{
				delete_class(h,'gn_scroll_fixed');
				delete_class(g,'gn_outer_comp');
			}
		}
		
		//=======================================
		//背景固定化
		//引数：true=固定化、false=解除
		//それぞれページ最上部に移動する（見ていた場所から移動する）ので保留
		function gnBgFixed(m){
			var c = document.getElementById('contents');
			var f = document.getElementById('FOOTER_NEW');
			var w = window.innerHeight;
			var ch = c.scrollHeight;
			var h = document.getElementById('contents').pageYOffset;
			var hh = window.pageYOffset;
//			var hhh = c.scrollTop;
			var p = document.getElementById('page');
			if(m){
				c.classList.add('gn_scroll_fixed');
				c.style.height = w + 'px';
				f.style.position = 'fixed';
				f.style.top = ch + 'px';

				p.setAttribute('data',hh);
			}else{
				if(c.classList.contains('gn_scroll_fixed')){
					c.classList.remove('gn_scroll_fixed');
					c.style.height = '';
					f.style.position = 'relative';
					f.style.top = '';
					var pnd = p.getAttribute('data');
					window.scrollBy(0,pnd);
				}
			}
		}
		
		//=======================================
		//SP要素内スクロール(SP時専用)
		//引数：親要素
		//指定のタグがある要素にスクロール用タグ追加
		//高さ指定
		function gnSetEleScroll(p){
			var wh = window.innerHeight;//innerHeight outerHeight
			var y =  window.pageYOffset;
			
			//gnav_outerのtopの値（ヘッダーの状態によって可変）
			var go = document.getElementById('gnav_outer');
			var goStyle = document.defaultView.getComputedStyle(go, '');
			var goTop = goStyle['top'];
			var goTopN = goTop.substr(0,goTop.length-2) *1;
			
			//要素の高さ設定
			if(wh-goTopN < p.scrollHeight){
				var c = p.children;
				var len = c.length;
				for(var i=0;i<len;i++){
					var ci = c[i];
					if(c[i].classList.contains('gn_js_ovf')){
						if(!c[i].classList.contains('gn_comp_scroll')){
							c[i].classList.add('gn_comp_scroll');
						}
						var h = p.offsetHeight - c[i].clientHeight;
						var ch = wh-goTopN - h -30;//30は余白
						c[i].style.height = ch + 'px';
						
						var d1 = p.offsetHeight;//親要素高さ(スクロールバー込み)
						var d2 = c[i].clientHeight;//要素高さ
						var d3 = c[i].offsetHeight;//要素高さ
						//下↓（>）表示
						var cc = c[i].children;
						var lenC=cc.length;
						for(var i=0;i<lenC;i++){
							if(cc[i].classList.contains('gn_under_navi')){
								cc[i].style.display = 'block';
							}
						}
					}
				}
			}
			gnEleScrollNavi(p);
		}

		//=======================================
		//下↓（>）の監視（最下部までいったら消す）
		function gnEleScrollNavi(p){
			var c = p.children;
			var len = c.length;
			for(var i=0;i<len;i++){
				if(c[i].classList.contains('gn_js_ovf')){
					c[i].onscroll = function(){
//						var k = this.pageYOffset;//
//						var k1 = this.scrollY;//
						var k2 = this.scrollTop;
						var ch = this.scrollHeight;
						var ch2 = this.clientHeight;
						//>
						var n = this.nextElementSibling;
						var cc = this.children;
						var lenC = cc.length;
						for(var i=0;i<lenC;i++){
							if(cc[i].classList.contains('gn_under_navi')){
								n = cc[i];
								break;
							}
						}
						var p = this.scrollHeight - this.offsetHeight;
						var g1 = ch2/2;
						if(ch-ch2-10 > k2){//10は遊び
							n.style.display = 'block';
						}else{
							n.style.display = 'none';
						}
					}
				}
			}
		}
		
		//=======================================
		//ヘッダーが圧縮されているかどうか
		function gnHeaderCompMode(){
			var h = document.getElementById('gnHeaderSp');
			if(h.classList.contains('gn_scroll_fixed')){
				return true;
			}else{
				return false;
			}
		}
		
		//=======================================
		//SP時、H1とパンくずをfooter（#FOOTER_NEW）上に移動
		function gnSpMoveH1(){
			var spchk = getSpMode();
			if(spchk){
				var h1 = document.getElementsByTagName('H1');
				var pan = document.getElementById('path');
				var ft = document.getElementById('FOOTER_NEW');

				//各要素無かった場合に備えて
				if(ft){
					if(h1){
						ft.parentNode.insertBefore(h1[0],ft);
						h1[0].style.display = 'block';
						h1[0].style.clear = 'both';
						h1[0].style.width = '320px';
						h1[0].style.margin = '0 auto';
					}
					if(pan){//トップはぱんくず無い
						ft.parentNode.insertBefore(pan,ft);
						pan.style.display = 'block';
						pan.style.float = 'none';
						pan.style.width = '320px';
						pan.style.margin = '0 auto';
					}
				}
			}
		}


		//=======================================
		//指定のエレメントから指定のクラスを除く（あった場合）
		function delete_class(ele,className){
			if(ele.classList.contains(className)){
				ele.classList.remove(className);
			}
		}

		//=======================================
		//要素をID指定でまるごと削除する（1つ）
		function delete_element(id){
			tgt = document.getElementById(id);
			if(tgt){
				var tgtP = tgt.parentNode;
				tgtP.removeChild(tgt);
			}
		}

		//=======================================
		//SP時のコンテンツ高さ調整(未使用)
		function gnSpPageAdjust(){
			var p = document.getElementById('page');
			if(getSpMode()){
				var pp = spGetHeaderHeight();
				p.style.marginTop = pp + 'px';
			}else{
				p.style.marginTop = '';
			}
		}


		//=======================================
		//SP状態を取得
		//ページ内部がSP非対応のページがあるため、UA判別はまだNG
		function getSpMode(){
//			var s = getUA();//UAより判別
			var s = getWidthSp();//コンテンツ幅より判別
			if(s == 'sp'){
				return true;
			}else{
				return false;
			}
		}
		
		//=======================================
		//コンテンツ幅よりSP判別
		function getWidthSp(){
			var t = document.getElementById('page').clientWidth;
			if(t > 480){
				return 'pc';
			}else{
				return 'sp';
			}
		}
		//=======================================
		//UAよりSP判別（未使用）
		function getUA(){
			var getDevice = (function(){
				var ua = navigator.userAgent;
				if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
					return 'sp';
				}else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
					return 'tab';
				}else{
					return 'other';
				}
			})();
			return getDevice;
		}
		
		
		//=======================================
		//cookie関係
		//=======================================
		//PC表示に変更ボタンを押した場合
		function setGnSpbtn(){
//			var md = getCookie('switchScreen');
			setCookie('switchScreen',1);
			location.reload();
			return false;
		}
		//---------------------------------------------
		//名前・値・有効期限(日)を渡してcookieを書き込む
		function setCookie(n,v,t){
			if(navigator.cookieEnabled){
				var date = new Date();
				try{
					t = parseInt(t)
				}catch(e){
					t = 30;//デフォルト保存期間
				}
				date.setTime(date.getTime()+t*24*60*60*1000);
				document.cookie = n+'='+escape(v)+';expires='+date.toGMTString();
				return true;
			}else{
				return false;
			}
		}
		//---------------------------------------------
		//cookie内の指定キーの値を返す
		//なければ「nodata」を返す
		function getCookie(t){
			if(navigator.cookieEnabled){
				t = t+'=';
				var c = document.cookie + ';';
				var k = c.indexOf(t,0);
				if(k == -1){
					return 'nodata';
				}else{
					var e = c.indexOf(';', k);
					var r = unescape(c.substring(k+t.length,e));
				}
			}else{
				return 'nodata';
			}
		}
		//---------------------------------------------
		//cookie削除
		//削除するcookie名を渡す
		function delCookie(t){
			if(navigator.cookieEnabled){
				var date = new Date();
				date.setTime(0);
				document.cookie = t+'=;expires='+date.toGMTString();
				return true;
			}else{
				return false;
			}
		}
		

		//=======================================
		//sp debug
		//=======================================
		//サイズ取得テスト
		function spDebugHeader(){
			var p = document.getElementById('gnHeaderSp');
			var ph = p.clientHeight;
			var g = document.getElementById('gnav');
			var pleft = g.offsetTop;
			var pb = g.getBoundingClientRect();
			var pby = pb.top;

			var msg = 'header-height:' + ph + '<br>offsetTop:' + pleft + '<br>top(BoundingClientRect):' + pby;
			spDebugView(msg);
		}
		//=======================================
		//DEBUG表示用
		function spDebugView(msg){
			var p = document.getElementById('gnHeaderSp');
			var insert = '<div id="gnDebug" style="background:white;border:1px solid #ccc;z-index:10099;position: fixed;text-align:center;top:0.5em;left:0;right:0;opacity:0.7;"></div>';
			if(!document.getElementById('gnDebug')){
				p.insertAdjacentHTML('afterend',insert);
			}
			var v = document.getElementById('gnDebug');
			var d = v.innerHTML;
			if(d){
				d = d + '<hr>' + msg;
			}else{
				d = '【DEBUG】<br>' + msg;
			}
			v.innerHTML = d;
			console.log('-' + v.innerHTML);
		}
	}
})

//Polyfill classList ie9
//IE9対応のため追加
//------------------------------------------------------------------
/*
 * classList.js: Cross-browser full element.classList implementation.
 * 1.2.20171210
 *
 * By Eli Grey, http://eligrey.com
 * License: Dedicated to the public domain.
 *   See https://github.com/eligrey/classList.js/blob/master/LICENSE.md
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {

	// Full polyfill for browsers with no classList support
	// Including IE < Edge missing SVGElement.classList
	if (
		!("classList" in document.createElement("_")) 
		|| document.createElementNS
		&& !("classList" in document.createElementNS("http://www.w3.org/2000/svg","g"))
	) {

		(function (view) {

			"use strict";

			if (!('Element' in view)) return;

			var
			classListProp = "classList"
			, protoProp = "prototype"
			, elemCtrProto = view.Element[protoProp]
			, objCtr = Object
			, strTrim = String[protoProp].trim || function () {
				return this.replace(/^\s+|\s+$/g, "");
			}
			, arrIndexOf = Array[protoProp].indexOf || function (item) {
				var
				i = 0
				, len = this.length
				;
				for (; i < len; i++) {
					if (i in this && this[i] === item) {
						return i;
					}
				}
				return -1;
			}
			// Vendors: please allow content code to instantiate DOMExceptions
			, DOMEx = function (type, message) {
				this.name = type;
				this.code = DOMException[type];
				this.message = message;
			}
			, checkTokenAndGetIndex = function (classList, token) {
				if (token === "") {
					throw new DOMEx(
						"SYNTAX_ERR"
						, "The token must not be empty."
					);
				}
				if (/\s/.test(token)) {
					throw new DOMEx(
						"INVALID_CHARACTER_ERR"
						, "The token must not contain space characters."
					);
				}
				return arrIndexOf.call(classList, token);
			}
			, ClassList = function (elem) {
				var
				trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
				, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
				, i = 0
				, len = classes.length
				;
				for (; i < len; i++) {
					this.push(classes[i]);
				}
				this._updateClassName = function () {
					elem.setAttribute("class", this.toString());
				};
			}
			, classListProto = ClassList[protoProp] = []
			, classListGetter = function () {
				return new ClassList(this);
			}
			;
			// Most DOMException implementations don't allow calling DOMException's toString()
			// on non-DOMExceptions. Error's toString() is sufficient here.
			DOMEx[protoProp] = Error[protoProp];
			classListProto.item = function (i) {
				return this[i] || null;
			};
			classListProto.contains = function (token) {
				return ~checkTokenAndGetIndex(this, token + "");
			};
			classListProto.add = function () {
				var
				tokens = arguments
				, i = 0
				, l = tokens.length
				, token
				, updated = false
				;
				do {
					token = tokens[i] + "";
					if (!~checkTokenAndGetIndex(this, token)) {
						this.push(token);
						updated = true;
					}
				}
				while (++i < l);

				if (updated) {
					this._updateClassName();
				}
			};
			classListProto.remove = function () {
				var
				tokens = arguments
				, i = 0
				, l = tokens.length
				, token
				, updated = false
				, index
				;
				do {
					token = tokens[i] + "";
					index = checkTokenAndGetIndex(this, token);
					while (~index) {
						this.splice(index, 1);
						updated = true;
						index = checkTokenAndGetIndex(this, token);
					}
				}
				while (++i < l);

				if (updated) {
					this._updateClassName();
				}
			};
			classListProto.toggle = function (token, force) {
				var
				result = this.contains(token)
				, method = result ?
					force !== true && "remove"
				:
				force !== false && "add"
				;

				if (method) {
					this[method](token);
				}

				if (force === true || force === false) {
					return force;
				} else {
					return !result;
				}
			};
			classListProto.replace = function (token, replacement_token) {
				var index = checkTokenAndGetIndex(token + "");
				if (~index) {
					this.splice(index, 1, replacement_token);
					this._updateClassName();
				}
			}
			classListProto.toString = function () {
				return this.join(" ");
			};

			if (objCtr.defineProperty) {
				var classListPropDesc = {
					get: classListGetter
					, enumerable: true
					, configurable: true
				};
				try {
					objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
				} catch (ex) { // IE 8 doesn't support enumerable:true
					// adding undefined to fight this issue https://github.com/eligrey/classList.js/issues/36
					// modernie IE8-MSW7 machine has IE8 8.0.6001.18702 and is affected
					if (ex.number === undefined || ex.number === -0x7FF5EC54) {
						classListPropDesc.enumerable = false;
						objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
					}
				}
			} else if (objCtr[protoProp].__defineGetter__) {
				elemCtrProto.__defineGetter__(classListProp, classListGetter);
			}

		}(self));

	}

	// There is full or partial native classList support, so just check if we need
	// to normalize the add/remove and toggle APIs.

	(function () {
		"use strict";

		var testElement = document.createElement("_");

		testElement.classList.add("c1", "c2");

		// Polyfill for IE 10/11 and Firefox <26, where classList.add and
		// classList.remove exist but support only one argument at a time.
		if (!testElement.classList.contains("c2")) {
			var createMethod = function(method) {
				var original = DOMTokenList.prototype[method];

				DOMTokenList.prototype[method] = function(token) {
					var i, len = arguments.length;

					for (i = 0; i < len; i++) {
						token = arguments[i];
						original.call(this, token);
					}
				};
			};
			createMethod('add');
			createMethod('remove');
		}

		testElement.classList.toggle("c3", false);

		// Polyfill for IE 10 and Firefox <24, where classList.toggle does not
		// support the second argument.
		if (testElement.classList.contains("c3")) {
			var _toggle = DOMTokenList.prototype.toggle;

			DOMTokenList.prototype.toggle = function(token, force) {
				if (1 in arguments && !this.contains(token) === !force) {
					return force;
				} else {
					return _toggle.call(this, token);
				}
			};
		}

		// replace() polyfill
		if (!("replace" in document.createElement("_").classList)) {
			DOMTokenList.prototype.replace = function (token, replacement_token) {
				var
				tokens = this.toString().split(" ")
				, index = tokens.indexOf(token + "")
				;
				if (~index) {
					tokens = tokens.slice(index);
					this.remove.apply(this, tokens);
					this.add(replacement_token);
					this.add.apply(this, tokens.slice(1));
				}
			}
		}

		testElement = null;
	}());

}
//------------------------------------------------------------------



//更新履歴

/*
2018 07 yoshida
・スマホ時のヘッダー表示高速化
・いくつかのChromeのみのエラーつぶし
・IE9対応
*/


/*
2018 0319 yoshida
・gnMenuActionがスマホ時、実質同じ処理を2回していたので処理を一回に変更
（スマホ時一部ページでメニュー展開時に右にずれる症状の解消）
・スマホ時にメニュー開閉後にコンテンツが最上部になっていたのをほぼ元のスクロール位置になるように
・for文の調整
*/

/*
2017 1219 yoshida
・スマホ時ヘッダー上部固定
・スマホ時グロナビのスクロール処理、背景固定化、黒バック化
・PC版切り替えをグロナビ内に設置
*/

/*
2017 1120 yoshida
スマホ対応
*/

/*
2017_1101 yoshida
・PC版に商品一覧中間ページ追加
・他微調整
*/