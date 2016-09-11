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

//动画效果
$('.refresh').on('click',function(){
	var $buttonArea = $(this).parent();
	$buttonArea.slideUp('slow');
	$buttonArea.siblings('.changePlan').slideDown('slow');
});	


$.ajax({
	data:{
		userID: userID
	},
	type:'get',
	url: "../getFriendList/",
	dataType: "json",
	success:  function(data){
		var dom = '';
		for (var i = 0; i < data.length; i++) {
			
			dom += "<p class='block_para'>\
							<span class='para_left'>"+ data[i].friendName +"</span>\
							<span class='para_right'>"+ data[i].friendID +"</span>\
						</p>";
			getOneFriendFenxiang(data[i].friendID,data[i].friendName);
		}
		$('#friendList').prepend(dom);

	}
});


$('.confirmPage').click(function(){
	$.ajax({
		data:{
			string: $('[name=secrchContent]').val(),
			userID: userID
		},
		type:'get',
		url: "../searchFriends/",
		dataType: "json",
		success:  function(data){
			
			var dom = '';
			if(data.length != 0){
				for(var i = 0;i <data.length; i++){
					dom += "<p class='block_para'>\
										<span class='para_left'><span class='userName'>"+ data[i].userName + '</span>(ID='+ data[i].userID +')' +"</span>\
										<span class='para_right add' friendId='"+ data[i].userID +"'>添加</span>\
									</p>";
				}
				$('.findInfo').html('查找到如下信息');
				$('#searchReturn').html(dom);
			}
			else{
				$('.findInfo').html('未找到相关用户');
				$('#searchReturn').html('');
			}
			bindButton();
		}
	});
});

function bindButton(){
	$('span[friendId]').click(function(){
		$.ajax({
			data:{
				userID: userID,
				friendID: $(this).attr('friendId')
			},
			type:'get',
			url: "../addFriend/",
			dataType: "json",
			success:  function(data){
				alert(data);
				location.reload();
			}
		});
	});	
}

function getOneFriendFenxiang(friendID,friendName){
	$.ajax({
		data:{
			userID: friendID
		},
		type:'get',
		url: "../getMyFileList/",
		dataType: "json",
		success:  function(data){
			var dom = '';
			var plan = '';
			for(var i =0;i<data.length;i++){
				dom+="<a href='../EBook/?bookID=" + data[i].resourceID + "&userID=" + userID +"&testRead=0' class='EBook_link'><img src='../static/img/book-icon.png' class='EBook_link_img'><span class='EBook_link_title'>"+ data[i].resourceName +"</span></a>"
			}
			dom += getOneFriendWeixin(friendID);

			var data1 = getOneFriendPlan(friendID);
			if(data1 != null && data1.length>0){
				plan += "<p class='plan'><span class='para_left planTitle'>计划</span>\
				<span class='para_right planTitle'>已完成</span></p>";
				for (var i = 0; i < data1.length; i++) {

					var percent = (data1[i].tempPageNumber/data1[i].pageNumber);
					plan += "<p class='plan'><span class='para_left'>"+ data1[i].bookName +"</span>\
					            <span class='para_right'>"+ (percent*100).toFixed(1) +"%</span></p>";
				}
			}
			else{
				plan += "<p class='plan'><span class='para_left planTitle'>暂无计划</span></p>";
			}
			$('.Friends').append("<div class='oneFriend'>\
					<p class='name'>"+ friendName +"</p>\
					<p class='list'>"+dom+"</p>"+ plan +"\
				</div>");	
		}
	});
}

function getOneFriendPlan(friendID){
	var data1;
	$.ajax({
		data:{
			userID:friendID,
		},
		url: "../getPlan/",
		dataType: "json",
		async: false,
		success:  function(data){
			data1 = data;
		}
	});
	return data1;
}

function getOneFriendWeixin(friendID){
	var data2;
	//加载微信列表
	$.ajax({
	    data:{ 
	        userID:friendID,
	    },
	    type: 'get',
	    url: "../getWeixinLink/",
	    dataType: "json",
	    async: false,
	    success:  function(data){
	        var dom = '';
	        for (var i = 0; i < data.length; i++) {
	            dom += "<a href='../EBook/?bookID=" + data[i].resourceID + "&userID=" + userID;
	            dom += "&testRead=0' class='EBook_link'><img src='../static/img/weixin.png' class='Weixin_link_img'><span class='EBook_link_title'>";
	            dom += data[i].resourceName;
	            dom += "</span></a>";
	        }
	        data2 = dom;
	    }
	});
	return data2;
}