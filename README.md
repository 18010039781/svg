# svg
学习svg时制作的小demo 暂时没有封装。Y轴是固定的，X轴是自适应的。项目暂时未完成，主要是X轴的时间切割没有做。

## 地址
[点击这里，你可以链接到demo](https://18010039781.github.io/svg/)

##参数设置
    var data = [
        { date:"4-10 10:00",value:"-"},
        { date:"4-12 10:00",value:"-+"},
        { date:"4-13 10:00",value:"++"},
        { date:"4-15 10:00",value:"-+"},
        { date:"4-17 10:00",value:"-"},
        { date:"4-11 10:00",value:"-+"},
        { date:"4-18 10:00",value:"-"}
    ];
    $("#svg").testChart(data);
