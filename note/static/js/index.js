//全局变量
var query = window.location.search;
query = query.slice(1);
query = query.split('&');

var userID = $('#wrap').attr('userID');

for(var i=0; i<query.length; i++){
    var content = query[i].split('=');
    var key = content[0];
    var value = content[1];
    if(key == 'userID'){
        userID = value;
    }
}

addNev(userID);

function refreshBind(){
	//动画效果
	$('.refresh').on('click',function(){
		var $buttonArea = $(this).parent();
		$buttonArea.slideUp('slow');
		$buttonArea.siblings('.changePlan').slideDown('slow');
	});	

	//更新进度
	$('.confirmPage').click(function(){
		var value = $(this).siblings('[name=addPageNumber]').val();
		if(!planPagenumberCheck(value)){
			return false;
		}
		var bookID = $(this).attr('bookID');

		$.ajax({
			data:{
				bookID:bookID,
				addPageNumber:value,	
				userID:userID,
			},
			url: "../updatePlan",
			dataType: "json",
			success:  function(data){
				alert(data);
			}
		});
		window.location.reload();
	});
}


//业务逻辑
$.ajax({//加载页面
	data:{
		userID:userID,
	},
	url: "../getPlan",
	dataType: "json",
	success:  function(data){

		var length = data.length;
		if(length == 0){
			$('#main').find('.main_left').append("<div class='block'>\
					<h3>当前没有计划</h3>\
				</div>");
				
		}
		for(var i = length-1; i>=0; i--){
			var today = getTodayString();
			var leftDay = datePlus(data[i].startDay, Number(data[i].planDayNumber));
			leftDay = dateMinus(today, leftDay);//剩余天数

			var p = data[i].tempPageNumber/data[i].pageNumber;

			var leftPage = Number(data[i].pageNumber)-Number(data[i].tempPageNumber);//剩余页数
			var tL = Number(data[i].pageNumber)-Number(data[i].yesterday);//今天刚开始的时候的剩余页数

			

			var ll = tL/leftDay;//今天本来要度的页数
			var todayLast = Number(data[i].yesterday) + Number(ll) - Number(data[i].tempPageNumber);//今日还要读多少

			var info;
			if(p < (dateMinus(data[i].startDay, today))/data[i].planDayNumber){//当前页数/所有页数 < 当前天数/所有天数 则 计划慢了
				info = '计划慢了呦'
			}
			else{
				info = '计划正常执行'
			}

			if(todayLast<0){
				todayLast = 0;
				info = "今日计划执行完毕！";
			}

			var dom1 = '',dom2 = '';
			if(data[i].option == 1){
				dom1 = "<a class='para_right refresh' href='../EBook/?bookID=" + data[i].bookID + "&userID=" + userID+ "'>+更新</a>";
				// loadMemo(data[i].bookID, data[i].bookName);
			}
			else if(data[i].option == 3){
				dom1 = "<span class='para_right refresh'>+更新</span>";
				dom2 = "<div class='changePlan'>\
						    <p class='block_para'><label for=''>请输入今天读到的页数： </label></p>\
							<input type='text' name='addPageNumber'>\
							<span class='confirmPage' bookID="+ data[i].bookID +">确定</span>\
						</div>";
			}

			if(data[i].option == 1){//换算成页数
				todayLast = "约"+(todayLast/1500).toFixed(0);
				data[i].tempPageNumber = "约"+(data[i].tempPageNumber/1500).toFixed(0);
				leftPage = "约"+(leftPage/1500).toFixed(0);
			}
			else{
				todayLast = todayLast.toFixed(0);
				leftPage = (leftPage).toFixed(0);
			}

			$('#main').find('.main_left').append("<div class='block'>\
					<h3>"+ data[i].bookName +"</h3>\
					<div class='planData'>\
						<div class='mainFigure'>\
							<p class='mainFigure_title'>总体还剩"+ ((1-p)*100).toFixed(1) +"%</p>\
						</div>\
						<p class='block_para'>\
							<span class='para_left'>今天还剩</span>\
							<span class='para_right' style='color:#dc3023'>"+ todayLast +"页</span>\
						</p>\
						<p class='block_para'>\
							<span class='para_left'>总体计划已完成</span>\
							<span class='para_right'>"+ (p*100).toFixed(1) +"%</span>\
						</p>\
						<p class='block_para'>\
							<span class='para_left'>本月已读</span>\
							<span class='para_right'>"+ data[i].tempPageNumber +"页</span>\
						</p>\
						<p class='block_para'>\
							<span class='para_left'>还剩下</span>\
							<span class='para_right'>"+ leftPage +"页</span>\
						</p>\
						<p class='block_para'>\
							<span class='para_left'>"+ info +"</span>\
						</p>\
						<p class='block_para refreshArea'>"+ dom1 +"</p>" + dom2 + "</div>\
				</div>");
		}//end for
		refreshBind();
	}//end function
});//end ajax


//ajax新增：类型，计划天数，起始日期

//计算：目前进度第几天

//今日目标计算规则：
//	  剩余页数/剩余天数 = 今日要读的页数 (index页面)
//    剩余索引数/剩余天数 = 今日要读的索引数 (index页面)

//    当前页数/所有页数 < 当前天数/所有天数 则 计划慢了(index页面)

//    当前索引数 + 今日要读的索引数 = 今日终点 (EBook页面)

function loadMemo(ID, name){
	$.ajax({
		data:{
			// BookID: EBookID,
			userID: ID,
		},
		type:'get',
		url: "../getUserAllMemo/",
		dataType: "json",
		success:  function(data){
			if(data.length == 0){
				$('#memoList').append('<div class="articleBlock">\
					<h2>当前没有笔记</h2></div>')
			}
			for (var i = 1; i < data.length; i++) {
				var p ='';
				for (var j = 0; j < data[i].memoContent[0].noteContent.length; j++) {
					p += ("<p class='articleBlock_para'>" + data[i].memoContent[0].noteContent[j] + "</p>");
				}
				p += "<div class='bookname'>"+ name +"</div>";
				// p += "<div class='bookname'>《"+ data[i].bookName +"》</div>";
				$('#memoList').append('<div class="articleBlock">\
					<h2>'+ data[i].memoContent[0].title +'</h2>'+ p +'</div>')
			}
		}
	});	
}

$.ajax({//获得好友列表
	data:{
		userID: userID
	},
	type:'get',
	url: "../getFriendList/",
	dataType: "json",
	success:  function(data){
		for (var i = 0; i < data.length; i++) {
			loadMemo(data[i].friendID, data[i].friendName);
		}
	}
});