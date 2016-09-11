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
	$("."+listId).find('span').click(function(){
		$("."+listId).find('span').css('background-color','#f47983');
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
	var url,listClass;
	var ID,Name,link;
	if (s==1) {
		url = "../getFileList/";
		listClass = 'EBookList';
	}
	else if(s ==2||s==4){
		url = "../getWeixinLink/";
		listClass = 'WeixinList';
	}
	else{
		url = "../getFriendList/";
		listClass = 'FriendList';
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
				else if(s ==2){
					ID = data[i].resourceID;Name = data[i].resourceName;
				}
				else{
					ID = data[i].friendID;Name = data[i].friendName;
				}
	            dom += "<span class='EBook_link_title' tag='"+ ID +"'>"+ Name +"</span><a href='../EBook/?bookID=" + ID + "&userID=" + userID;
	            dom += "' class='EBook_link' target='_blank'>　</a>";
	            dom += "";
	        }
	        $('.'+listClass).html(dom);
	        changeColor('EBookList', 1, 'EBookForm');
	        changeColor('WeixinList', 1, 'WeixinForm');
	        changeColor('FriendList', 1, 'FriendForm');
	        // changeColor('WeixinList', 1, 'editForm');
	    }
	});
}

//点击选择删除类别
$('#newSelectList').find('span[option]').click(function(){
	$('#EBookSelect').hide();
	$('#WeixinSelect').hide();
	$('#FriendSelect').hide();
	$('#newField').hide();
	$('#editField').hide();

	if($(this).attr('option') == '1'){//删除电子书
		option = 1;
		$('#EBookSelect').show();
		loadList(1);
	}
	else if($(this).attr('option') == '2'){//删除微信阅读
		option = 2;
		$('#WeixinSelect').show();
		loadList(2);
	}
	else if($(this).attr('option') == '3'){//删除好友
		option = 3;
		$('#FriendSelect').show();
		loadList(3);
	}
	else if($(this).attr('option') == '4'){//新增文章
		option = 4;
		$('#newField').show();
	}
	else if($(this).attr('option') == '5'){//修改文章
		option = 5;
		$('#editField').show();
		loadList(2);
	}
});

$("#submit").click(function(){//提交
	var url = '';
	var ID;
	if(option == 1){
		ID = $('#EBookForm').val();
		url = '../deleteCollect';
	}
	else if(option == 2){
		ID = $('#WeixinForm').val();
		url = '../deleteCollect';
	}
	else if(option == 3){
		ID = $('#FriendForm').val();
		url = '../deleteFriend/';
	}
	else if(option == 4||option == 5){
		if(!newFieldCheck()){
			return false;
		}
		uploadArticle();
		return true;
	}
	else{
		alert('还没有选择类型');
	}
	lock = true;
	$.ajax({
 		data:{
			ID: ID,
			userID: userID
		},
		type:'get',
		url: url,
		dataType: "text",
		success:  function(data){
			alert('操作成功');
			window.location.reload();
			lock = false;
		}
	});
});

function uploadArticle(){
	var articleName;
	var content;
	var resourceID;
	var link;
	var url;
	if(option == 4){
		articleName = $('#newName').val();
		content = $('#new').val();
		link = $('#link').val();
		url = '../createWeiXin/';
	}
	else if(option == 5){
		articleName = $('#aName').val();
		content = $('#edit').val();
		resourceID = $('#editForm').val();
		url = '../changeWeiXinContent/';
	}
	$.ajax({
 		data:{
			articleName: articleName,
			content: content,
			link: link,
			resourceID: resourceID,
			userID: userID
		},
		type:'get',
		url: url,
		dataType: "text",
		success:  function(data){
			alert(data);
			location.reload();
			lock = false;
		}
	});
}

