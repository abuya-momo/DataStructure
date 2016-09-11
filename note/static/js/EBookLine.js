var query = window.location.search;
query = query.slice(1);
query = query.split('&');

var userID = 0;
var bookID = 'E1';
var testread = 1;//1的话正常读,0的话试读

for(var i=0; i<query.length; i++){
    var content = query[i].split('=');
    var key = content[0];
    var value = content[1];
    if(key == 'userID'){
        userID = value;
    }
    else if(key == 'bookID'){
        bookID = value;
    }
    else if(key == 'testRead'){
        testread = value;
    }
}

linkHrefForUserID(userID);//nev相关

//控制划线框
var animate1Lock = false;
$('#lineManage').click(function(){
	if(animate1Lock == false){
		animate1Lock = true;
		$('#s').animate({
			left: '-=18.4%'
		},function(){
			$('#lineBox').show();
			$('#lineBox').animate({
				left: '-=36.8%'
			});
		});
	}
});
$('#lineManage_cancelButton').click(function(){
	$('#lineBox').animate({
		left: '+=36.8%'
	});
	$('#lineBox').hide();
	$('#s').animate({
		left: '+=18.4%'
	});
	animate1Lock = false;
});


var lineArray = [];//划线相关
var lineArrayIndex = 0;//正向的时候用
var lineArrayIndexF = 0;//反向的时候用
var nowParaLine = [];

//取得划线
$.ajax({
	data:{
		EBookID: bookID,
		userID: userID,
	},
	type:'get',
	url: "../getLine/",
	dataType: "json",
	async: false,
	success:  function(data){
		for (var i = 0; i < data.length; i++) {
			lineArray.push(data[i]);
		}
	}
});

function LineDom(d, index, c){//判断划线
	for (var i = 0; i < lineArray.length; i++) {//遍历数组寻找本段划线内容
		if(lineArray[i].paraIndex == index)
			nowParaLine.push(lineArray[i]);
	}
	if(nowParaLine.length == 0 && lineArrayIndex != 1){//判断是否仍处于划线状态
		return processDom(d, index, c);
	}
	else{
		return processLineDom(d, index, c);
	}
}

function processDom(d, index, c) {//生成普通DOM
	var domP = '';
	var charactorIndex = index;
	for(var k = 0; k < c.length; k++){//字符
		domP += "<span index='"+ charactorIndex +"'>";
		domP += (c[k] +"</span>");
		charactorIndex += length(c[k]);
	}
	if(d == 1){
		$('#s').append("<p indexOfPara='"+ index +"'>"+ domP +"</p>");
	}
	else{
		return "<p indexOfPara='"+ index +"'>"+ domP +"</p>";
	}
}

function processLineDom(d, index, c){//根据nowParaLine[]生成划线DOM//如果d为0就更新indexOfPara的段落
	var domP = '';
	var charactorIndex = index;
	var i = 0;
	nowParaLine.push({
		paraIndex: 0,
		start: 0,
		over: 0,
	});

	if(lineArrayIndex == 1){//说明还在划线状态，是跨段划线
		domP += "<a class='lineP' line='"+ nowParaLine[i].start +"'>";
	}
	for(var k = 0; k < c.length; k++){//字符
		if(nowParaLine[i].start == charactorIndex){//划线开始
			domP += "<a class='lineP' line='"+ nowParaLine[i].start +"'>";
			lineArrayIndex = 1;//置为1
		}
		domP += ("<span index='"+ charactorIndex +"'>"+ c[k] +"</span>");
		if(nowParaLine[i].over == charactorIndex){
			domP += "</a>";
			i++;
			lineArrayIndex = 0;//置为0
		}
		charactorIndex += length(c[k]);
	}
	if(lineArrayIndex == 1){//说明还在划线状态，是跨段划线
		domP += "</a>";
	}
	else{
		nowParaLine.length = 0;//清空数组
	}

	if(d == 1)
		$('#s').append("<p indexOfPara='"+ index +"'>"+ domP +"</p>");
	else if(d == -1)
		return "<p indexOfPara='"+ index +"'>"+ domP +"</p>";
	else{
		$('p[indexOfPara='+ index +']').html(domP);
	}
}