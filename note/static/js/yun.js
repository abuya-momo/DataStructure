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
$('input[name=userID]').val(userID);

//上传文件文件名
$(".a-upload").on("change","input[type='file']",function(){
    var filePath=$(this).val();
    if(filePath.indexOf("txt")!=-1){
        $("#fileUrl").html(filePath);
        var arr=filePath.split('\\');
        var fileName=arr[arr.length-1];
        // $(".showFileName").html(fileName);
    }else{
        // $(".showFileName").html("");
        $("#fileUrl").html("您未上传文件，或者您上传文件类型有误！").show();
        return false 
    }
})


//控制上传层的显示和隐藏
$('#upload_close').click(function(){
    $('#bigFrame_wrap').hide();
    $('#upload_EBook').hide();
    $('#upload_weixin').hide();
    $('#upload_other').hide();
});
//2种上传方式
$('#uploadLink_EBook').click(function(){
    $('#bigFrame_wrap').show();
    $('#upload_EBook').show();
});
$('#uploadLink_weixin').click(function(){
    $('#upload_weixin').show();
});
//上传按钮变成等待按钮
$('#uploadButton').click(function(){
    $(this).get(0).value = '请稍后';
});


//加载文件列表
$.ajax({
    data:{ 
        userID:userID,
    },
    type: 'get',
    url: "../getFileList/",
    dataType: "json",
    success:  function(data){
        var dom = '';
        for (var i = 0; i < data.length; i++) {
            dom += "<a href='../EBook/?bookID=" + data[i].EBookID + "&userID=" + userID;
            dom += "' class='EBook_link'><img src='../static/img/book-icon.png' class='EBook_link_img'><span class='EBook_link_title'>";
            dom += data[i].EBookName;
            dom += "</span></a>";
        }
        $('#EBookList').prepend(dom);
        //<a href='###' class='EBook_link'><img src='../static/img/book-icon.png' alt=' class='EBook_link_img'><span class='EBook_link_title'>盗墓笔记</span></a>    
    }
});
//加载微信列表
$.ajax({
    data:{ 
        userID:userID,
    },
    type: 'get',
    url: "../getWeixinLink/",
    dataType: "json",
    success:  function(data){
        var dom = '';
        for (var i = 0; i < data.length; i++) {
            dom += "<span class='EBook_link'><img src='../static/img/weixin.png' class='Weixin_link_img'>";
            dom += "<a class='EBook_link_title' href='../EBook/?bookID=" + data[i].resourceID + "&userID=" + userID+"'>";
            dom += data[i].resourceName;
            dom += "</a>　<a class='EBook_link_title' href='"+ data[i].link +"' target='_blank'>原文</a></span>";
        }
        $('#WeixinList').prepend(dom);
    }
});

//上传微信链接
var LLock = false;
$('#addWeixin').click(function(){

    var articleName = $('#weixinTitle').val();
    var content = $('#weixinZhengwen').val();
    var link = $('#weixinLink').val();
    var url = '../createWeiXin/';
    if(!yunCheck()){
        return false;
    }
    
    if(LLock == false){
        LLock = true;
        $.ajax({
            data:{
                articleName: articleName,
                content: content,
                link: link,
                userID: userID
            },
            type:'get',
            url: url,
            dataType: "text",
            success:  function(data){
                alert(data);
                location.reload();
            }
        });
    }
    LLock = false;
});