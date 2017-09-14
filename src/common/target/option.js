export default {
  title: {
    text: "加载中",
    x: 'center'
  },
  tooltip: {
    trigger: "axis"
  },
  legend: {
    // data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
  },
  grid: {
    left: "3%",
    right: "6%",
    bottom: "7%",
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    name: '日期',
    type: "category",
    boundaryGap: false,
    data: [],
    axisLabel: {  
      formatter:function(value,index)  
        {  
            if (index % 2 != 0) {  
                return '\n\n' + value;  
            }  
            else {  
                return value;  
            }  
        }   
    } 
  },
  yAxis: {
    name: '指数',
    type: "value"
  },
  series: [
    {
      name: "",
      type: "line",
      stack: "总量",
      data: [],
      itemStyle: {
          normal: {
              lineStyle: {
                  color: '#245a88',
                  width: 3
              }
          }
      }
    }
  ]
};
