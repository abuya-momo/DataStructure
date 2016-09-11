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

// var option2 = {
//     title: {
//         text: '动态数据',
//         subtext: '纯属虚构'
//     },
//     tooltip: {
//         trigger: 'axis'
//     },
//     legend: {
//         data:['最新成交价', '预购队列']
//     },
//     toolbox: {
//         // show: true,
//         // feature: {
//         //     dataView: {readOnly: false},
//         //     restore: {},
//         //     saveAsImage: {}
//         // }
//     },
//     dataZoom: {
//         show: false,
//         start: 0,
//         end: 100
//     },
//     xAxis: [
//         {
//             type: 'category',
//             boundaryGap: true,
//             data: (function (){
//                 var now = new Date();
//                 var res = [];
//                 var len = 10;
//                 while (len--) {
//                     res.unshift(now.toLocaleTimeString().replace(/^\D*/,''));
//                     now = new Date(now - 2000);
//                 }
//                 return res;
//             })()
//         },
//         {
//             type: 'category',
//             boundaryGap: true,
//             data: (function (){
//                 var res = [];
//                 var len = 10;
//                 while (len--) {
//                     res.push(len + 1);
//                 }
//                 return res;
//             })()
//         }
//     ],
//     yAxis: [
//         {
//             type: 'value',
//             scale: true,
//             name: '价格',
//             max: 20,
//             min: 0,
//             boundaryGap: [0.2, 0.2]
//         },
//         {
//             type: 'value',
//             scale: true,
//             name: '预购量',
//             max: 1200,
//             min: 0,
//             boundaryGap: [0.2, 0.2]
//         }
//     ],
//     series: [
//         {
//             name:'预购队列',
//             type:'bar',
//             xAxisIndex: 1,
//             yAxisIndex: 1,
//             data:(function (){
//                 var res = [];
//                 var len = 10;
//                 while (len--) {
//                     res.push(Math.round(Math.random() * 1000));
//                 }
//                 return res;
//             })()
//         },
//         // {
//         //     name:'最新成交价',
//         //     type:'line',
//         //     data:(function (){
//         //         var res = [];
//         //         var len = 0;
//         //         while (len < 10) {
//         //             res.push((Math.random()*10 + 5).toFixed(1) - 0);
//         //             len++;
//         //         }
//         //         return res;
//         //     })()
//         // }
//     ]
// };
// var myChart = echarts.init(document.getElementById('yueduzongshu'));
// myChart.setOption(option2);


// var option = {
//     title : {
//         text: '阅读分类',
//         subtext: '所有历史数据',
//         x:'center'
//     },
//     tooltip : {
//         trigger: 'item',
//         formatter: "{a} <br/>{b} : {c} ({d}%)"
//     },
//     legend: {
//         orient: 'vertical',
//         left: 'left',
//         data: ['电子书','文章','纸质书','历史','国学']
//     },
//     series : [
//         {
//             name: '访问来源',
//             type: 'pie',
//             radius : '55%',
//             center: ['50%', '60%'],
//             data:[
//                 {value:335, name:'电子书'},
//                 {value:310, name:'文章'},
//                 {value:234, name:'艺术'},
//                 {value:135, name:'历史'},
//                 {value:1548, name:'国学'}
//             ],
//             itemStyle: {
//                 emphasis: {
//                     shadowBlur: 10,
//                     shadowOffsetX: 0,
//                     shadowColor: 'rgba(0, 0, 0, 0.5)'
//                 }
//             }
//         }
//     ]
// };

// var myChart = echarts.init(document.getElementById('bingtu'));
// myChart.setOption(option);


$.ajax({//加载页面
    data:{
        userID:userID,
    },
    url: "../getAllPlan/",
    dataType: "json",
    success:  function(data){
        var length = data.length;
        if (length == 0) {
             $('#main').append("<div class='Sblock'>\
                <h2>当前暂无计划</h2></div>");
        }
        for(var i = length-1; i>=0; i--){
            var domP = '';
           
            for (var j = 0; j < data[i].plan.length; j++) {
                if(j == 0){
                     domP += "<p class='block_para'>\
                        <span class='para_left'>"+ data[i].plan[0].updateDay +"</span>\
                        <span class='para_right'>"+ data[i].plan[0].tempPageNumber +"</span>\
                    </p>";
                }
                else{
                    var todaypage = data[i].plan[j].tempPageNumber - data[i].plan[j-1].tempPageNumber;
                    domP += "<p class='block_para'>\
                        <span class='para_left'>"+ data[i].plan[j].updateDay +"</span>\
                        <span class='para_right'>"+ todaypage +"</span>\
                    </p>";    
                }
                
            }
            $('#main').append("<div class='Sblock'>\
                <h2>"+data[i].bookName+"</h2>"+domP+"</div>");
        }//end for
    }//end function
});//end aja