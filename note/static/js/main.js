



//超链接
function linkHrefForUserID(userID){
    var a = document.getElementsByTagName('a')
    for(var i = 0; i < a.length; i++){
    	if(a[i].href.match('###') != '###'){
    		a[i].href += '?userID=' + userID + '&';
    	}
    }
}

function dateMinus(sDate, eDate){
	var sArr = [];
	sArr[0] = sDate.slice(0, 4);
	sArr[1] = sDate.slice(4, 6);
	sArr[2] = sDate.slice(6);
	var eArr = [];
	eArr[0] = eDate.slice(0, 4);
	eArr[1] = eDate.slice(4, 6);
	eArr[2] = eDate.slice(6);

	var sRDate = new Date(sArr[0], sArr[1] - 1, sArr[2]);
	var eRDate = new Date(eArr[0], eArr[1] - 1, eArr[2]);
	var result = (eRDate-sRDate)/(24*60*60*1000);
	return result;
}

function datePlus(sDate, n){
	var sArr = [];
	sArr[0] = sDate.slice(0, 4);
	sArr[1] = sDate.slice(4, 6);
	sArr[2] = sDate.slice(6);

	var sRDate = new Date(sArr[0], sArr[1] - 1, sArr[2]);
	sRDate.setDate(sRDate.getDate() + n);

	var s = '';
	s += sRDate.getFullYear(); //从 Date 对象以四位数字返回年份.
	if(Number(sRDate.getMonth()+1) < 10){
		s += "0"+Number(sRDate.getMonth()+1); //从 Date 对象返回月份 (0 ~ 11).
	}
	else{
		s += sRDate.getMonth()+1; //从 Date 对象返回月份 (0 ~ 11).
	}

	if(Number(sRDate.getDate()) < 10){
		s += "0"+Number(sRDate.getDate()); //从 Date 对象返回月份 (0 ~ 11).
	}
	else{
		s += sRDate.getDate(); //从 Date 对象返回月份 (0 ~ 11).
	}
	return s;
}

function getTodayString(){
	var today = new Date(); // 获取今天时间
	var s = '';
	
	s += today.getFullYear(); //从 Date 对象以四位数字返回年份.
	if(Number(today.getMonth()+1) < 10){
		s += "0"+Number(today.getMonth()+1); //从 Date 对象返回月份 (0 ~ 11).
	}
	else{
		s += today.getMonth()+1; //从 Date 对象返回月份 (0 ~ 11).
	}
	if(Number(today.getDate()) < 10){
		s += "0"+Number(today.getDate()); //从 Date 对象返回月份 (0 ~ 11).
	}
	else{
		s += today.getDate(); //从 Date 对象返回月份 (0 ~ 11).
	}
	return s;
}










// 验证！！
//login页验证
function loginCheck() {
	//用户名验证部分
	var b = $('#login_name2').val();
	var regname =  /^[0-9]*[1-9][0-9]*$/; //，只允许数字
	if (b.length == '') {
		alert('用户名不能为空');
		return false;
	} else {
		if (!regname.test(b)) {
			alert('用户名格式错误');
			return false;
		} else {

		}
	}
	//密码格式验证
	var a = $('#login_password2').val(); //取到id为login_password2输入框的值
	var regpwd = /^(\w){6,20}$/; //密码，只能输入6-20个以字母开头，可带数字、"_"、的字符串
	// var regpwd = /^(?!\D+$)(?![^a-zA-Z]+$).{6,20}$/; //除了数字和字母还允许其他字符
	if (a.length == '') {
		alert('密码不能为空');
		return false;
	} else {
		if (!regpwd.test(a)) {
			alert('密码格式错误');
			return false;
		} else {
			return true;
		}
	}
}

//index页验证
//阅读计划页数验证
function planPagenumberCheck(a) {
	// var a = $('#todayPageNumber').val();
	var reg = /^[0-9]*[1-9][0-9]*$/; //正整数
	if (!reg.test(a)) {
		alert('请输入大于0的正整数');
		return false;
	} else {
		return true;
	}
}


//确定按钮信息验证
function confirmButton(selector) {
	var a = $(selector).val();
	var reg = /^\+?[1-9][0-9]*$ /; //正整数
	if (!reg.test(a)) {
		alert('请输入大于0的正整数');
		return false;
	} else {
		alert('输入无误');
		return true;
	}
}


//delete界面验证
//新增文章验证
function newFieldCheck() {
	//标题验证（不为空）
	var a = $('#newName').val();
	if (a.length == '') {
		alert('标题不能为空!');
		return false;
	} else {
		// return true;
	}
	//链接验证（合法）
	var b = $('#link').val();
	var reglink = /^((http|https|ftp):\/\/)?(\w(\:\w)?@)?([0-9a-z_-]+\.)*?([a-z0-9-]+\.[a-z]{2,6}(\.[a-z]{2})?(\:[0-9]{2,6})?)((\/[^?#<>\/\\*":]*)+(\?[^#]*)?(#.*)?)?$/i;
	if (b.length == '') {
		alert('链接不能为空');
		return false;
	} else if (!reglink.test(b)) {
		alert('请输入合法的链接');
		return false;
	} else {
		// return true;
	}
	//内容验证
	var c = $('#new').val();
	if (c.length == '') {
		alert('内容不能为空！');
		return false;
	} else {
		return true;
	}
}
//delete点击提交触发
// $('#submit').click(function() {
// 		newFieldCheck();
// 	})
	// //文章修改验证
	// function editFiedCheck() {
	// 	//标题验证（不为空）
	// 	var a = $('#aName').val();
	// 	if (a.length == '') {
	// 		alert('标题不能为空!');
	// 	} else {}

// 	//内容验证
// 	var c = $('#editForm').val();
// 	if (c.length == '') {
// 		alert('内容不能为空！');
// 	} else {}
// }
//提交点击调用


//plan界面验证
//创建纸质书计划验证
function bookplanCheck() {
	//书名非空验证
	var a = $('input[name=bookName]').val();
	if (a.length == ''||a == null) {
		alert('书名不能为空!');
		return false;
	} else {

	}

	//页数非空及正整数验证
	var b = $('input[name=pageNumber]').val();
	var regPageNumber = /^[0-9]*[1-9][0-9]*$/;
	if (b.length == '') {
		alert('页数不能为空！');
		return false;
	} else if (!regPageNumber.test(b)) {
		alert('页数应为正整数');
		return false;
	} else {
	}

	//计划天数非空及正整数验证
	var c = $('input[name=planDayNumber]').val();
	var regPlanDayNumber = /^[0-9]*[1-9][0-9]*$/;
	if (c.length == '') {
		alert('天数不能为空！');
		return false;
	} else if (!regPlanDayNumber.test(c)) {
		alert('天数应为正整数');
		return false;
	} else {
		return true;
	}
}

//微信阅读计划验证
function weixinCheck() {
	//计划天数验证
	var c = $('input[name=planDayNumber]').val();
	var regweixinDayNumber = /^[0-9]*[1-9][0-9]*$/;
	if (c.length == '') {
		alert('天数不能为空！');
		return false;
	} else if (!regweixinDayNumber.test(c)) {
		alert('天数应为正整数');
		return false;
	} else {
		return true;
	}
}

//电子书计划验证
function ebookCheck() {
	//计划天数验证
	var c = $('#EBookForm').val();
	var regebookDayNumber = /^\+?[1-9][0-9]*$ /;
	if (c.length == '') {
		alert('天数不能为空！');
		return false;
	} else if (!regebookDayNumber.test(c)) {
		alert('天数应为正整数');
		return false;
	} else {
		return true;
	}
}
// $('#submit1').click(function(){
// 	weixinCheck();
// 	ebookCheck();
// 	bookplanCheck();
// })
// id submit 重复


//电子书笔记验证
function noteCheck() {
	var a = $('#title').val();
	if (a == ''|| a ==null) {
		alert('标签不能为空！');
		return false;
	} else {
		
	}
	var b = $('#memoContent').val();
	
	if (b == ''|| b ==null) {
		alert('内容不能为空！');
		return false;
	} else {
		return true;
	}
		
}

function yunCheck() {
	// //标题验证（不为空）
	// var a = $('#weixinTitle').val();
	// if (a.length == '') {
	// 	alert('标题不能为空!');
	// 	return false;
	// } else {
	// 	// return true;
	// }
	//链接验证（合法）
	var b = $('#weixinLink').val();
	var reglink = /^((http|https|ftp):\/\/)?(\w(\:\w)?@)?([0-9a-z_-]+\.)*?([a-z0-9-]+\.[a-z]{2,6}(\.[a-z]{2})?(\:[0-9]{2,6})?)((\/[^?#<>\/\\*":]*)+(\?[^#]*)?(#.*)?)?$/i;
	if (b.length == '') {
		alert('链接不能为空');
		return false;
	} else if (!reglink.test(b)) {
		alert('请输入合法的链接');
		return false;
	} else {
		return true;
	}
}

//注册界面验证
function newloginCheck() {
	//昵称验证
	var b = $('#userName').val();
	// var regname = /^(?![a-z]+$)(?!\d+$)[a-z0-9]{5,19}$/i; //6-20位，只允许数字字母。
	var regname = /^.{10}$/; //任意字符长度10以内
	if (b.length == '') {
		alert('昵称不能为空1');
		return false;
	} else {
		// if (!regname.test(b)) {
		// 	alert('用户名格式错误1');
		// 	return false;
		// } else {
		// }
	}
	//密码格式验证
	var a = $('#newPassword').val(); //取到id为login_password2输入框的值
	// var regpwd = /^(\w){6,20}$/; //密码，只能输入6-20个以字母开头，可带数字、"_"、的字符串
	//var regNewpwd = /^(?!\D+$)(?![^a-zA-Z]+$).{6,20}$/; //除了数字和字母还允许其他字符
	var regNewpwd = /^\d{6,20}$/;
	if (a.length == '') {
		alert('密码不能为空');
		return false;
	} else {
		if (!regNewpwd.test(a)) {
			alert('密码格式错误');
			return false;
		} else {
		}
	}


	//两次密码输入是否相同验证
	var newPwd1 = $('#newPassword').val(); //此处psssword为第一次输入密码id，需添加
	//获取第二次输入的密码
	var newPwd2 = $('#passwordConfirmInput').val();
	//判断是否有再次输入密码，如果有，则进行两次输入值检查
	if (newPwd1 != newPwd2) {
		alert('两次密码输入不相同请重新输入');
		return false;
	} else {
		return true;
	}

}