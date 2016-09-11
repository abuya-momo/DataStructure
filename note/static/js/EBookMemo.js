var ifChange = false;//为truwe的话 则要先删除再添加
var deleteTime;//要删除笔记的time

//控制笔记框
var animateLock = false;
$('#memo').click(function(){
	if(animateLock == false){
		animateLock = true;
		$('#s').animate({
			left: '-=18.4%'
		},function(){
			$('#memoBox').show();
			$('#memoBox').animate({
				left: '-=36.8%'
			});
		});
	}
});
$('#memo_cancel').click(function(){
	$('#memoBox').animate({
		left: '+=36.8%'
	});
	$('#memoBox').hide();
	$('#s').animate({
		left: '+=18.4%'
	});
	animateLock = false;
});



//创建无划线笔记
var uploadMemoLock = false;
$('#memo_ok').click(function(){
	if(!noteCheck()){
		return false;
	}
	deleteMemo();
	if(uploadMemoLock == false){
		uploadMemoLock = true;
		$.ajax({
			data:{
				title: $('#title').val(),
				noteContent: $('#memoContent').val(),
				BookID: bookID,
				userID: userID,
				start: -1,
				over: -1
			},
			type:'get',
			url: "../createMemo/",
			dataType: "json",
			success:  function(data){
				alert(data);
				loadMemo();
			}
		});
		ifChange = false;
		uploadMemoLock = false;
	}
});

//4.getAllMemo读取本书所有笔记(userID,BookID)  
//return [{'createTime':createTime,'title':title,'noteContent':noteContent}]  //finish 

function loadMemo(){
	$.ajax({
		data:{
			BookID: bookID,
			userID: userID,
		},
		type:'get',
		url: "../getAllMemo/",
		dataType: "json",
		success:  function(data){
			$('#memoList').html('');
			for (var i = data.length-1; i >= 0; i--) {
				var p ="<div class='contentP'>";
				for (var j = 0; j < data[i].noteContent.length; j++) {
					p += ('<p>' + data[i].noteContent[j] + '</p>');
				}
				p+='</div>';
				$('#memoList').append("<div class='memoList_oneMemo'>\
					<h3><span class='memoT'>"+ data[i].title +"</span><span class='editMemo' time='"+ data[i].createTime +"'>修改</span><span class='deleteMemo' time='"+ data[i].createTime +"'>删除</span></h3>"+ p +'</div>)');
			}
			//清空输入框
			$("#title").val('');
			$('#memoContent').val('');
			//修改笔记///////
			$('.editMemo').click(function(){
				var time = $(this).attr('time');
				var title = $(this).siblings('span.memoT').text()
				$("#title").val(title);
				var content = $(this).parents('h3').siblings('.contentP').text()
				$('#memoContent').val(content);
				ifChange = true;
				deleteTime = time;
			});
			//删除
			$('.deleteMemo').click(function(){
				deleteTime = $(this).attr('time');
				ifChange = true;
				deleteMemo();
				alert('删除成功');
				loadMemo();
			});
		}
	});	
}
loadMemo();

function deleteMemo(){
	if(ifChange == true){
		$.ajax({//删除笔记
			data:{
				createTime: deleteTime,
				bookID: bookID,
				userID: userID,
			},
			type:'get',
			url: "../deleteNote/",
			dataType: "json",
			success:  function(data){
				ifChange == false;
			}
		});
	}

}


//笔记的备份与恢复
$('#getBeifen').click(function(){
	getBeifen();
});

function foo(str){//补零
    str ='00'+str;
    return str.substring(str.length-2,str.length);
}

function autoBeifen(){
	if($('#memoContent').val()!= null){
		$.ajax({
			data:{
				title: $('#title').val(),
				userID: userID,
				noteContent: $('#memoContent').val()
			},
			type:'get',
			url: "../saveTempNote/",
			dataType: "json",
			success:  function(data){
				var time = new Date();

				$('#beifen').text('备份成功'+time.getHours()+':'+foo(time.getMinutes())+':'+foo(time.getSeconds()) );
			}
		});
	}
	
}

$('#memoContent').keydown(function(){
	setInterval("autoBeifen()", 25000);
	$('#memoContent').unbind('keydown');
})

function getBeifen(){
	$.ajax({
		data:{
			userID: userID
		},
		type:'get',
		url: "../getTempNote/",
		dataType: "json",
		success:  function(data){
			$('#title').get(0).value = data[0].title;
			$('#memoContent').get(0).value = data[0].noteContent;
		}
	});
}

$('#memo_getLineMassage').click(function(){
	$('#memoContent').val($('#memoContent').val()+document.getSelection())
});