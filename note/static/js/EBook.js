//控制上下滚动
$('#next').click(function(){
	// llist.display();
	$('#s').animate({
		scrollTop: $('#s').find('p[indexofpara='+ all.nowNode.next.next.indexOfPara +']').get(0).offsetTop
	},300);
});
$('#pre').click(function(){
	console.log(all.nowNode.previous.indexOfPara +'   '+all.nowNode.indexOfPara+'  '+document.getElementById('s').scrollTop)
	$('#s').animate({
		scrollTop: $('#s').find('p[indexofpara='+ all.nowNode.previous.previous.indexOfPara +']').get(0).offsetTop
	},200);
});


//全局变量
var t = testread;
var llist = new LList();
var all = {
	lock: false,//refreshIndex()用
	minIndex: 0,
	maxIndex: 0,
	sScrollTop: 0,//当前的s滚动高度(当前页面的位置)
	nowNode: llist.head
}
var curr = 0;//前面的是标记

//初始化页面
function PDirctionLoad(test, nowIndex){
	$.ajax({//反向
		data:{
			EBookID: bookID,
			t: test,
			userID: userID,
			nowIndex: nowIndex
		},
		type:'get',
		url: "../getPreEBookContent/",
		dataType: "json",
		async: false,
		success:  function(data){
			if(data[0].data.length < 2){
				curr = 0;
			}
			else{
				curr = data[0].data[ data[0].data.length-2 ].index;//初始位置的INDEX
			}
			
			$('#EBookName').text(data[0].EBookName);//更新书名信息
			$('#totalIndexNum').text(data[0].totalIndex);//更新书总的段落数
			loadTreeAndDom(data,-1);
		}
	});	
}
PDirctionLoad(t, 0);

$.ajax({//正向
	data:{
		EBookID: bookID,
		t: t,
		userID: userID,
		nowIndex:'0'
	},
	type:'get',
	url: "../getEBookContent/",
	dataType: "json",
	async: false,
	success:  function(data){
		loadTreeAndDom(data,1);
		document.getElementById('s').scrollTop = $('#s').find('p[indexofpara='+ curr +']').get(0).offsetTop;
		var currentNode = llist.find(curr, null);
		all.sScrollTop = document.getElementById('s').scrollTop;
		all.nowNode = currentNode;
	}
});

function length(c){
	var l = c.length;
	var blen = 0;
	for(i=0; i<l; i++) {
		if ((c.charCodeAt(i) & 0xff00) != 0){
			blen ++;
		}
		blen ++;
	}
	return blen;
}



function loadTreeAndDom(data,d){//d=1为正向d=-1为向前翻//将得到的段落信息加载出来

	//插入链表与dom
	if(d == 1){
		all.maxIndex = data[0].newIndex;
		for (var i = 0; i < data[0].data.length; i++) {
			var n = new Node(data[0].data[i].index);
			llist.insertL(n);

			LineDom(1, data[0].data[i].index, data[0].data[i].c);
		}
		var currNode = llist.head;//遍历赋值offsetTop
		currNode = llist.head;
		var allPara = document.getElementById('s').children;
		var j = 0;
		while(allPara[j].attributes.indexOfPara.value != currNode.indexOfPara){
			j++;
		}
		while (!(currNode == null)) {
			currNode.offsetTop = allPara[j].offsetTop;
			j++;
		  	currNode = currNode.next;
		}
	}
	else{
		var allParaDom = '';
		for (var i = 0; i < data[0].data.length - 1; i++) {//段
			var n = new Node(data[0].data[i].index);
			llist.insertL(n);

			allParaDom += LineDom(-1, data[0].data[i].index, data[0].data[i].c);
		}
		$('#s').prepend(allParaDom);

		if(data[0].data.length > 0){
			all.minIndex = data[0].data[0].index;
		}
	}
	
}

function refreshIndex(){//更新当前段落位置//并判断是否更新新的段落
	var now = document.getElementById('s').scrollTop//当前的进度高度
	// console.log("scrollTop "+now);
	var currentNode;
	if(all.sScrollTop - now > 0){//说明往回倒退
		currentNode = llist.findBackward(now, all.nowNode);
		all.nowNode = currentNode;
	}
	else if(all.sScrollTop - now <= 0){//正常向后
		currentNode = llist.findOnward(now, all.nowNode);
		all.nowNode = currentNode;
	}

	all.sScrollTop = now;
	
	refreshProcessBar();

	if(all.maxIndex - currentNode.indexOfPara < 3000){
		ajaxGetNewPara(1);
	}
}


function ajaxGetNewPara(d){//d为方向1为正常向后,-1为向前倒退
	var url;
	var index;
	if(d == 1){
		url = '../getEBookContent/';
		index = all.maxIndex;
	}
	else if(d == -1){
		url = '../getPreEBookContent/';
		index = all.minIndex;
	}

	if (all.lock == false) {//如果没锁
		all.lock = true;
		$.ajax({//假如说这是正向的！
			data:{
				EBookID: bookID,
				t:'0',
				userID: userID,
				nowIndex: index
			},
			type:'get',
			url: url,
			dataType: "json",
			success:  function(data){
				loadTreeAndDom(data,d);
				if (d == -1) {
					document.getElementById('s').scrollTop = $('#s').find('p[indexofpara='+ all.nowNode.indexOfPara +']').get(0).offsetTop;
				}
			}
		});
	}
	all.lock = false;
}

//判断停止滚动相关代码
	var topValue = 0,// 上次滚动条到顶部的距离  
		interval = null; // 定时器  
	document.getElementById('s').onscroll = function() {
		topValue = document.getElementById('s').scrollTop;
	    if (interval == null) { // 未发起时，启动定时器，1秒1执行  
	        interval = setInterval("testStopScroll()", 300);
	    }
	}
	function testStopScroll() {
		topValue = document.getElementById('s').scrollTop;
	    // 判断此刻到顶部的距离是否和1秒前的距离相等 
	    if (document.getElementById('s').scrollTop == topValue) {
	        clearInterval(interval);
	        interval = null;
	        //停止滚动后执行的函数
	        refreshIndex();
	    }
	}
//end停止滚动


//document.getElementById('s').scrollTop//当前的进度高度
//document.getElementById('a').offsetTop//段落的高度