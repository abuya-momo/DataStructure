$.ajax({//加载页面
	data:{
		userID:userID,
	},
	url: "../getPlan",
	dataType: "json",
	success:  function(data){
		var length = data.length;
		for(var i = length-1; i>=0; i--){
			
			if (data[i].bookID == bookID) {
				var today = getTodayString();
				var leftDay = datePlus(data[i].startDay, Number(data[i].planDayNumber));
				leftDay = dateMinus(today, leftDay);
				// var leftDay = Number(data[i].startDay) + Number(data[i].planDayNumber) - today//剩余天数

				var tL = Number(data[i].pageNumber)-Number(data[i].yesterday);//今天刚开始的时候的剩余页数
				var leftDay = Number(data[i].startDay) + Number(data[i].planDayNumber) - today//剩余天数

				var ll = tL/leftDay;//今天本来要读的页数

				$('#processBar').attr('yesterday',data[i].yesterday);
				$('#processBar').attr('ll',ll);
			}
			
		}//end for
	}//end function
});//end ajax

//进度条代码
function refreshProcessBar(){
	$('#currentIndex').text(all.nowNode.indexOfPara);//下方进度条

	var yesterday = $('#processBar').attr('yesterday');
	var ll = $('#processBar').attr('ll');

	var finalReturn = ((all.nowNode.indexOfPara - yesterday)/ll)*100;//计算方法：(当前位置-昨天位置)/今天本来要读的页数

	if(finalReturn >= 100){//左方任务进度
		$('#planProcess').text(100);
	}
	else if(finalReturn < 0){
		$('#planProcess').text(0);
	}
	else{
		if(isNaN(finalReturn.toFixed(2)) == true){//说明没有计划
			$('#processBar').html('<p>当前没有计划</p>');
		}
		else{
			$('#planProcess').text(finalReturn.toFixed(2));
		}
		
	}
}

function refreshPlan(){
	console.log(all.nowNode.indexOfPara);
	$.ajax({
		data:{
			bookID:bookID,
			addPageNumber: all.nowNode.indexOfPara,	
			userID:userID,
		},
		url: "../updatePlan",
		dataType: "json",
		success:  function(data){
			console.log('updatePlan success');
		}
	});
}
setInterval('refreshPlan()',25000);

//添加电子书
$('#addEBook').click(function(){
	addEbook();
});
function addEbook(){
	//加载文件列表
	var ifH = [false, false];
	$.ajax({
	    data:{ 
	        userID:userID,
	    },
	    type: 'get',
	    url: "../getFileList/",
	    dataType: "json",
	    async: false,
	    success:  function(data){
	        for (var i = 0; i < data.length; i++) {
	        	if(data[i].EBookID == bookID){
	        		alert('你已经拥有这个资源了');
	        		ifH[0] = true;
	        	}
	        }
	    }
	});

	$.ajax({
	    data:{ 
	        userID:userID,
	    },
	    type: 'get',
	    url: "../getWeixinLink/",
	    dataType: "json",
	    async: false,
	    success:  function(data){
	        for (var i = 0; i < data.length; i++) {
	        	if(data[i].resourceID == bookID){
	        		alert('你已经拥有这本书了');
	        		ifH[1] = true;
	        	}
	        }
	    }
	});

	if(ifH[0] == false && ifH[1] == false){
		$.ajax({
		    data:{ 
		        userID:userID,
		        resourceID: bookID
		    },
		    type: 'get',
		    url: "../collectContent/",
		    dataType: "json",
		    async: false,
		    success:  function(data){
		       	alert(data);
		    }
		});
	}
}