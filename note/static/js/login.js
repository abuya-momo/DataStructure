$('#signin').click(function(){
	$('#bigFrame_wrap').show();
});

//控制上传层的显示和隐藏
$('#upload_close').click(function(){
    $('#bigFrame_wrap').hide();
});

$('#signButton').click(function(){
	if(!newloginCheck()){
		return false;
	}
	$.ajax({
		data:{
			userName: $('#userName').val(),
			password: $('#passwordConfirmInput').val()
		},
		type:'get',
		url: "../register/",
		dataType: "json",
		success:  function(data){
			alert('注册成功，ID为' + data[0].userID);
			$('#bigFrame_wrap').hide();
		}
	});
});


$('#ok').click(function(){
	if(loginCheck() == true){
		$('#formLogin').submit();
	}
});