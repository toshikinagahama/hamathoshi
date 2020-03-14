document.onkeyup = function(e) { 
	var shift, ctrl; 
	 
	// Mozilla(Firefox, NN) and Opera 
	if (e != null) { 
		keycode = e.which; 
		ctrl    = typeof e.modifiers == 'undefined' ? e.ctrlKey : e.modifiers & Event.CONTROL_MASK; 
		shift   = typeof e.modifiers == 'undefined' ? e.shiftKey : e.modifiers & Event.SHIFT_MASK; 
		// イベントの上位伝播を防止 
		e.preventDefault(); 
		e.stopPropagation(); 
	// Internet Explorer 
	} else { 
		keycode = event.keyCode; 
		ctrl    = event.ctrlKey; 
		shift   = event.shiftKey; 
		// イベントの上位伝播を防止 
		event.returnValue = false; 
		event.cancelBubble = true; 
	} 
	 
	// キーコードの文字を取得 
	keychar = String.fromCharCode(keycode).toUpperCase(); 
	 
	// Ctrl同時押しの場合 
	if (ctrl) { 
	
	} else if (shift) { // Shift同時押しの場合
		if(keycode == 32){	//スペースの場合
			if(isPlaying)
				video.pause();
			else
				video.play();
		}

		if (keycode == 37) {
			backwardFrame();
		} else if (keycode == 39) {
			forwardFrame();
		}else if (keycode == 38) {
			video.volume += 0.02;
		} else if (keycode == 40) {
			video.volume -= 0.02;
		}


		
		if(keychar == "V"){
			writeTime();
		}else if(keychar == "1"){
			changeRate(1);
		}else if(keychar == "2"){
			changeRate(2);
		}else if(keychar == "3"){
			changeRate(4);
		}else if(keychar == "4"){
			changeRate(6);
		}else if(keychar == "5"){
			changeRate(8);
		}else if(keychar == "6"){
			changeRate(10);
		}else if(keychar == "7"){
			changeRate(12);
		}else if(keychar == "8"){
			changeRate(14);
		}else if(keychar == "9"){
			changeRate(16);
		}
	}else {	// 通常のキーダウン時の場合 
		if (keycode == 37) {
			video.currentTime -= 1.0;
		} else if (keycode == 39) {
			video.currentTime += 1.0;
		}
	} 

	console.log(video.playbackRate);
	// 特殊キーコードの対応については次を参照 
		// 27   Esc 
		// 8    BackSpace 
		// 9    Tab 
		// 32   Space 
		// 45   Insert 
		// 46   Delete 
		// 35   End 
		// 36   Home 
		// 33   PageUp 
		// 34   PageDown 
		// 38   ↑ 
		// 40   ↓ 
		// 37   ← 
		// 39   → 
	// 処理の例 
	// if (keycode == 27) { 
	//  alert('Escapeキーが押されました'); 
	// } 
} 

document.onkeyup = function(e) { 
	e.preventDefault(); 
	e.stopPropagation(); 
} 

/*
 *
 * ビデオの操作 
 * 
 */

 //時間更新時
video.addEventListener("timeupdate", function(){
	$('#range1').val(video.currentTime / video.duration * 10000);
}, false);

//再生中
video.addEventListener("play", function(){
	isPlaying = true;
	document.getElementById("playBtn").focus();
}, false);

//停止
video.addEventListener("pause", function(){
	isPlaying = false;
	document.getElementById("playBtn").focus();
}, false);

/* 変更中（ドラッグ中） */
$('#range1').on('input', function () {
	var val = $(this).val();
	video.currentTime = video.duration * val / 10000;
} );

/* 変更後 */
$('#range1').change( function () {
	var val = $(this).val();
	video.currentTime = video.duration * val / 10000;
} );

/* 変更後 */
$('#range2').change( function () {
	var val = $(this).val() - 120;
	video.currentTime += val;
	$(this).val(120);
} );

function changeRate(rate){
	video.playbackRate = rate;
}

function playVideo() {
	video.play();
}

function pauseVideo() {
	//動画を一時停止
	video.pause();
}

function backwardFrame() {
	video.currentTime -= 1.0 / frameRate;
}

function forwardFrame() {
	video.currentTime += 1.0 / frameRate;
}

function writeTime(){
	let sItem = 0;
	updateSelectedCell();
	console.log(cCellID);
	$("#" + cCellID).html(video.currentTime.toFixed(0));
}

function updateSelectedCell(){
	if(cNo == 0){
		nNo = 1;
		nDaseki = 1;
		nPoint = 0;
	}else if(1 <= cNo  && cNo < 9){
		if(cPoint == 0){ //開始なら、次は終了
			nNo = cNo;
			nDaseki = cDaseki;
			nPoint = 1;
		}else{ //終了なら移動
			nNo = cNo + 1;
			nDaseki = cDaseki;
			nPoint = 0;
		}
	}else if(cNo == 9){
		if(cPoint == 0){ //開始なら、次は終了
			nNo = cNo;
			nDaseki = cDaseki;
			nPoint = 1;
		}else{ //終了なら移動
			nNo = 1;
			nDaseki = cDaseki + 1;
			nPoint = 0;
		}
	}
	cNo = nNo;
	cDaseki = nDaseki;
	cPoint = nPoint;

	let tmpStr = cNo + "_" + cDaseki + "_";
	if(cPoint == 0){
		tmpStr += "start";
	}else{
		tmpStr += "end";
	}
	cCellID = tmpStr;
}

function resetCell(){
	cNo = 0;
	cDaseki = 0;
	cPpoint = 0;
}

function selectCell(no, daseki, point){
	cNo = Number(no);
	cDaseki = Number(daseki);
	cPoint = Number(point);
}

/*
 *保存ボタンクリック
 */
function save() {
	var content = "";
	content += "名前,";
	for(let i = 1; i <= 6; i++){
		content += i + "打席開始時間[秒]," + i + "打席終了時間[秒],"
	}
	content += "\r\n";

	for(let i = 1; i <= 9; i++){
		content += $("#" + i + "_Name").html();
		content += ","
		for(let j = 1; j <= 6; j++){
			content += $("#" + i + "_" + j + "_start").html();
			content += ","
			content += $("#" + i + "_" + j + "_end").html();
			content += ","
		}
		content += "\r\n";
	}

	// 変換処理の実施
	const shiftJisCodeList = Encoding.convert(Encoding.stringToCode(content), {to: 'SJIS'});
	var blob = new Blob([new Uint8Array(shiftJisCodeList)], { "type" : "text/plain" });

	if (window.navigator.msSaveBlob) { 
		window.navigator.msSaveBlob(blob, "各打者各打席録画時間.csv");
		window.navigator.msSaveOrOpenBlob(blob, "各打者各打席録画時間.csv");
	} else {
		document.getElementById("download").href = window.URL.createObjectURL(blob);
	}
}



function PageLoad(evt) {
	var dropFrame = document.getElementById('DropFrame');
	dropFrame.addEventListener('dragover', handleDragOver, false);
	dropFrame.addEventListener('drop', handleFileSelect, false);

	//イベントの生成
	for(let i = 1; i <= 12; i++){
		let str1 = "#" + i + "_Name";
		let next = i + 1;
		if(i == 12){
			next = 1;
		}
		let str2 = "#" + next + "_Name";
		$(str1).keydown(function (e) {
			if (e.keyCode == 13) {
				e.preventDefault();
				$(str2).focus();
			}
		});
	}
}

function handleFileSelect(evt) {
	evt.stopPropagation();
	evt.preventDefault();

	var files = evt.dataTransfer.files;
	var items = evt.dataTransfer.items;
	var entry = items[0].webkitGetAsEntry();

	var output = [];
	document.getElementById('output').innerHTML = files[0].name;
	console.log(items[0].getAsFile())


	var url = URL.createObjectURL(files[0]);

	video.src = url;
}

function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy';
}
