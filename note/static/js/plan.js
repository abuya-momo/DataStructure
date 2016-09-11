var query = window.location.search;
query = query.slice(1);
query = query.split('&');

var userID = 0;

for(var i=0; i<query.length; i++){
    var content = query[i].split('=');
    var key = content[0];
    var value = content[1];
    if(key == 'userID'){
        userID = value;
    }
}

addNev(userID);

//全局变量
var lock = false;//锁，false代表可以提交，true代表无法提交
var option = 0;//计划类型123

//选项卡的变色赋值//在列表加载完成后调用
function changeColor(listId, ifValue, formId){
	$("#"+listId).find('span').click(function(){
		$("#"+listId).find('span').css('background-color','#f47983');
		$(this).css('background-color','#1bd1a5');
		if(ifValue ==1){
			var tag = $(this).attr('tag');
			$("#"+formId).val(tag);
		}	
	});
}
changeColor('newSelectList', 0);

//加载列表//s=1EBook//s=2Weixin
function loadList(s){
	var url,listId;
	var ID,Name,link;
	if (s==1) {
		url = "../getFileList/";
		listId = 'EBookList';
	}
	else{
		url = "../getWeixinLink/";
		listId = 'WeixinList';
	}
	$.ajax({
	    data:{ 
	        userID:userID,
	    },
	    type: 'get',
	    url: url,
	    dataType: "json",
	    success:  function(data){
	        var dom = '';
	        for (var i = 0; i < data.length; i++) {
	        	if (s==1) {
					ID = data[i].EBookID;Name = data[i].EBookName;
				}
				else{
					ID = data[i].resourceID;Name = data[i].resourceName;
				}
	            dom += "<span class='EBook_link_title' tag='"+ ID +"'>"+ Name +"</span><a href='../EBook/?bookID=" + ID + "&userID=" + userID;
	            dom += "' class='EBook_link' target='_blank'>　</a>";
	            dom += "";
	        }
	        $('#'+listId).html(dom);
	        changeColor('EBookList', 1, 'EBookForm');
	        changeColor('WeixinList', 1, 'WeixinForm');
	    }
	});
}

//点击选择计划类别
$('#newSelectList').find('span[option]').click(function(){
	$('#pageNumber').hide();
	$('#EBookSelect').hide();
	$('#WeixinSelect').hide();
	$('#PlanSelect').hide();
	$('#bookName').hide();
	if($(this).attr('option') == '1'){//创建电子书计划
		option = 1;
		$('#EBookSelect').show();
		$('#pageNumber').hide();
		loadList(1);
	}
	else if($(this).attr('option') == '2'){//创建微信阅读计划
		option = 2;
		$('#WeixinSelect').show();
		$('#pageNumber').hide();
		loadList(2);
	}
	else if($(this).attr('option') == '3'){//创建纸质书计划
		option = 3;
		$('#pageNumber').show();
		$('#bookName').show();
		$('#planDayNumber').show();
	}
	else if($(this).attr('option') == '4'){
		option = 4;
		$('#PlanSelect').show();
		$('#planDayNumber').hide();
		loadPlanList();
	}
});

function loadPlanList(){//加载计划列表
	$.ajax({//加载页面
		data:{
			userID:userID,
		},
		url: "../getPlan",
		dataType: "json",
		success:  function(data){
			var dom = '';
			for (var i = 0; i < data.length; i++) {
				dom += "<span class='EBook_link_title' tag='"+ data[i].bookID +"'>"+ data[i].bookName +"</span>";
	        }
	        $('#PlanList').html(dom);
	        changeColor('PlanList', 1, 'PlanForm');
		}
	});
}
function deletePlan(){//删除计划
	$.ajax({
		data:{
			userID:userID,
			ID: $('#PlanForm').val()
		},
		url: "../deletePlan/",
		dataType: "json",
		success:  function(data){
			alert('操作成功');
			window.location.reload();
		}
	});
}

//提交新建计划(普通书)
$("#submit").click(function(){
	var bookName1 = '';
	var pageNumber = null;
	if(option == 1){
		bookName1 = $('input[name=EBook]').val();
		if(bookName1 == null|| bookName1 == ''){
			alert('请选择一个选项')
			return false;
		}
		if(!weixinCheck()){
			return false;
		}
	}
	else if(option == 2){
		bookName1 = $('input[name=weixin]').val();
		if(bookName1 == null|| bookName1 == ''){
			alert('请选择一个选项')
			return false;
		}
		if(!weixinCheck()){
			return false;
		}
	}
	else if(option == 3){
		bookName1 = $('#main').find('input[name=bookName]').val();
		pageNumber = $('#main').find('input[name=pageNumber]').val();
		if(!bookplanCheck()){
			return false;
		}
	}
	else if(option == 4){
		deletePlan();
		return true;
	}
	else{
		alert('还没有选择书的类型');
	}
	lock = true;
	$.ajax({
		data:{
			bookName: bookName1,
			pageNumber: pageNumber,
			planDayNumber: $('#main').find('input[name=planDayNumber]').val(),
			option: option,
			userID: userID
		},
		type:'get',
		url: "../addPlan",
		dataType: "text",
		success:  function(data){
			alert(data);
			window.location = '../index/?userID='+ userID +'&';
			lock = false;
		}
	});
});