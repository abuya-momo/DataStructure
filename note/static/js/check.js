//login页验证
function loginCheck() {
	//用户名验证部分
	var b = $('#login_name2').val();
	var regname = /^(?![a-z]+$)(?!\d+$)[a-z0-9]{5,19}$/i; //6-20位，只允许数字字母。
	if (b.length == '') {
		alert('用户名不能为空');
		return false;
	} else {
		if (!regname.test(b)) {
			alert('用户名格式错误');
			return false;
		} else {
			return true;
		}
	}
	//密码格式验证
	var a = $('#login_password2').val(); //取到id为login_password2输入框的值
	// var regpwd = /^(\w){6,20}$/; //密码，只能输入6-20个以字母开头，可带数字、"_"、的字符串
	var regpwd = /^(?!\D+$)(?![^a-zA-Z]+$).{8,20}$/; //除了数字和字母还允许其他字符
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
function planPagenumberCheck() {
	var a = $('#todayPageNumber').val();
	var reg = /^\+?[1-9][0-9]*$ /; //正整数
	if (!reg.test(a)) {
		alert('请输入大于0的正整数');
		return false;
	} else {
		alert('输入无误');
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
		// return true;
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
	var a = $('#bookName').val();
	if (a.length == '') {
		alert('书名不能为空!');
		return false;
	} else {
		return true;
	}

	//页数非空及正整数验证
	var b = $('#pageNumber').val();
	var regPageNumber = /^\+?[1-9][0-9]*$ /;
	if (b.length == '') {
		alert('页数不能为空！');
		return false;
	} else if (!regPageNumber.test(b)) {
		alert('页数应为正整数');
		return false;
	} else {
		return true;
	}

	//计划天数非空及正整数验证
	var c = $('#planDayNumber').val();
	var regPlanDayNumber = /^\+?[1-9][0-9]*$ /;
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
	var c = $('#WeixinForm').val();
	var regweixinDayNumber = /^\+?[1-9][0-9]*$ /;
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
	var a = $('#tittle').val();
	if (a == '') {
		alert('标签不能为空！');
		return false;
	} else {
		return true;
	}
}