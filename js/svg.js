
jQuery.fn.extend({
    testChart: function (con) {
        /*
         con = [
         { date:"4-10 10:00",value:"-"},
         { date:"4-12 10:00",value:"-+"},
         { date:"4-13 10:00",value:"++"},
         { date:"4-15 10:00",value:"-+"},
         { date:"4-17 10:00",value:"-"},
         { date:"4-11 10:00",value:"-+"},
         { date:"4-18 10:00",value:"-"}
         ];
         */
        con = arrShort(con);
        var that = this;
        var yList = ['-','-+','+','++','+++','++++'];
        var gapX = 5,gapY = 45;
        var width = $(this).width() < 500?500:$(this).width();
        var height = $(this).height() < 300?300:$(this).height();
        var paddingLeft = 50;
        var innerHtml = "<svg style='padding:20px 10px 0px "+paddingLeft+"px' width='100%' height='"+(height+20)+"'>";
        var xArrLen = con.length;
        var yArrLen = yList.length;
        height = height == ""?300:height;
        var xWidth = Math.floor((width-gapX)/xArrLen)-2;
        var yWidth = Math.floor((height-gapY)/yArrLen)-2;

        var closeOpenTime;
        //绘制xy轴
        linkChart(gapX,height-gapY,gapX,0,0);
        linkChart(gapX,height-gapY,"100%",height-gapY,i);
        //绘制y轴基本线条
        for(var i = 1;i<= xArrLen;i++){
            var linkWidth = i/xArrLen*96+"%";
            pointChart(linkWidth,height-gapY);
            //X轴的文字说明
            textXChart(i-1,linkWidth,height-gapY+23);
        }
        //绘制x轴基本线条
        for(var i = 1;i<= yArrLen;i++){
            var linkWidth = i*yWidth;
            linkChart(gapX,height-gapY-linkWidth,"100%",height-gapY-linkWidth,i);
            pointChart(gapX,height-gapY-linkWidth);
            //y轴的文字说明
            textYChart(yList[i-1],0,height-gapY-linkWidth+5);
        }

        //绘制曲线
        polyLineChart();


        //数据导入
        innerHtml+="</svg>";
        $(this).html(innerHtml);

        //事件
        $(this).delegate(".mouseRect,.circleMax,.circleMin","mousemove",function(){
            clearTimeout(closeOpenTime);
            var element = this;
            var num = $(element).attr("num");
            var type = $(element).attr("type");
            $(that).find(".circleMax").eq(num).attr("r","9");
            $(that).find(".circleMin").eq(num).attr("r","6");
            var left = $(that).find(".circleMin").eq(num).attr("cx");
            var top = $(that).find(".circleMin").eq(num).attr("cy");
            mouseDiv(num,type,left,top);
        });
        $(this).delegate(".mouseRect,.circleMax,.circleMin","mouseout",function(){
            var element = this;
            var num = $(element).attr("num");
            $(that).find(".circleMax").eq(num).attr("r","7");
            $(that).find(".circleMin").eq(num).attr("r","4");
            closeOpenTime = setTimeout(function(){
                $(that).find(".svg-text-window").remove();
            },200);
        });

        function mouseDiv(num,type,left,top){
            num = parseInt(num,10);
            if($(that).find(".mouseLookDiv").length == 0){
                var div = '<div class="svg-text-window" style=""><div class="mouseLookDiv mouseRect" num="'+num+'" type="'+type+'" style="left:'+left+';top:'+top+'px">';//#669DB8
                div +="<p class='text-none-space'><label>时间：</label><span id='mouseLookDivDate'>"+con[num].date+"</span></p>";
                div +="<p class='text-none-space'><label>数值：</label><span id='mouseLookDivValue'>"+con[num].value+"</span></p>";
                div +="</div></div>";
                $(that).append(div);
            }else{
                $(that).find(".mouseLookDiv").css({
                    "left":left,
                    "top":top+"px"
                }).attr("num",num).attr("type",type);
                $(that).find("#mouseLookDivDate").text(con[num].date);
                $(that).find("#mouseLookDivValue").text(con[num].value);
            }
            if(type == 1){
                $(that).find(".mouseLookDiv").addClass("out");
            }else{
                $(that).find(".mouseLookDiv").removeClass("out");
            }
        }

        function polyLineChart(){
            var color,x1,x2,y1,y2,bool;
            con[0].value == "-"?rectChart(0,0,0):rectChart(0,0,1);
            for(var i =1;i<con.length;i++){
                var last = con[i-1].value != "-"?1:0;
                color = "#00da8a";
                bool = 0;
                x1 = (i)/xArrLen*96+"%";
                x2 = (i+1)/xArrLen*96+"%";
                y1 =height-gapY-((yList.indexOf(con[i-1].value) + 1)*yWidth);
                y2 =height-gapY-((yList.indexOf(con[i].value) + 1)*yWidth);
                if(con[i].value != "-"){
                    color = "#F9B97B";
                    bool = 1;
                }
                linkChart2(x1,y1,x2,y2,color);
                //鼠标感应矩形
                rectChart(x1,i,bool);
                //圆圈-点
                circleChart(x1,y1,last,i-1);
            }
            circleChart(x2,y2,bool,i-1);
        }


        function rectChart(left,i,type){
            var width = 1/xArrLen*96+"%",html="";
            //left = (i)/xArrLen*96+"%";
            html +='<rect x="'+left+'" y="0" width="'+width+'" height="'+(height-gapY)+'" style="fill:transparent;" class="mouseRect" num="'+i+'" type="'+type+'"/>';

            innerHtml+=html;
        }

        function textYChart(str,left,top){
            var num = str.length;
            num = str =="-+"?1:num;
            left = -45;
            var html ='<text x="'+left+'" y="'+top+'" font-size="14">';
            if(str == "+"){
                html +='<tspan x="'+left+'" y="'+top+'" " font-size="13">阳性</tspan>';
                left = -19;
            }
            if(str == "-"){
                html +='<tspan x="'+left+'" y="'+top+'" " font-size="13">阴性</tspan>';
                left = -19;
            }
            html +='<tspan x="'+left+'" y="'+top+'" " font-size="17">(</tspan>';

            if(str == "-+"){
                html +='<tspan x="'+(left + 6)+'" y="'+(top-2)+'">+</tspan>';
                html +='<tspan x="'+(left + 7)+'" y="'+(top+3)+'" font-size="15">-</tspan>';
                num = 1;
            }else{
                html +='<tspan x="'+(left + 6)+'" y="'+top+'">'+str+'</tspan>';
            }

            html +='<tspan x="'+(left + 8*num +6)+'" y="'+top+'" " font-size="17">)</tspan>';
            html +='</text>';
            innerHtml+=html;
        }

        function textXChart(num,left,top){
            var value =con[num].date;
            value = value.split(" ")
            var str ='<text x="'+left+'" y="'+top+'" font-size="14" text-anchor="middle">';
            //str+=con[num].date;
            for(var i=0;i<value.length;i++){
                top = top+i*15;
                str +='<tspan x="'+left+'" y="'+top+'">'+value[i]+'</tspan>';
            }
            str+="</text>";
            innerHtml+=str;
        }


        function linkChart2(x1,y1,x2,y2,color){
            var style="stroke:"+color+";stroke-width:2";
            var html = '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" style="'+style+'"/>';
            innerHtml+=html;
        }

        function linkChart(x1,y1,x2,y2,color){
            var style=color == 1?"stroke:#4bce9e;stroke-width:1":"stroke:#cecece;stroke-width:1";
            var html = '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" style="'+style+'"/>';
            innerHtml+=html;
        }
        function pointChart(cx,cy){
            //var fill="#0022cc";
            var fill="#2d48d2";
            var html = '<circle cx="'+cx+'" cy="'+cy+'" r="2.5" fill="'+fill+'"/>';
            innerHtml+=html;
        }
        function circleChart(cx,cy,type,i){
            var color=type == 1?"#F9B97B":"#A7CD7A";
            var html = '<circle cx="'+cx+'" cy="'+cy+'" r="7" stroke="'+color+'" stroke-width="1" fill="#ffffff" num="'+i+'" type ="'+type+'" class="circleMax"/>';
            html += '<circle cx="'+cx+'" cy="'+cy+'" r="4" fill="'+color+'" num="'+i+'" type ="'+type+'" class="circleMin"/>';
            innerHtml+=html;
        }

        function dateMIN(time1,time2){
            var date1=new Date(time1);
            var date2=new Date(time2);
            return Date.parse(date1)>Date.parse(date2);
        }
        function arrShort(arr){
            for(var i = 0;i<arr.length;i++){
                for(var j = i + 1;j<arr.length;j++){
                    if(dateMIN(arr[i].date,arr[j].date)){
                        var tem = arr[i];
                        arr[i] = arr[j];
                        arr[j] = tem;
                    }
                }
            }
            return arr;
        }
    }
});
