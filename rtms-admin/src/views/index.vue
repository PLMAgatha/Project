<template>
  <div class="app-container">
<!--    数据看板按钮-->
    <div class="LookBtn">
      <el-button type="primary" icon="el-icon-view" size="small" @click="dataBoard">首页数据看板
      </el-button>
      <el-button type="primary" icon="el-icon-view" size="small" @click="dataBoard1">下线数据看板
      </el-button>
      <el-button type="primary" icon="el-icon-view" size="small" @click="dataBoard2">备料数据看板
      </el-button>
    </div>
<!--    任务数-->
    <div class="top">
      <div  class="top-totalAnomaly">
        <img src="../assets/images/totalAnomaly.png" class="top-totalAnomaly-img">
        <div class="top-son issueWi">
          <div class="issue">今日生产总数</div>
          <div class="count">10086<span>条</span></div>
        </div>
      </div>
      <div class="top-NDFAnomaly">
        <img src="../assets/images/NDFAnomaly.png" class="top-totalAnomaly-img">
        <div class="top-son">
          <div class="issue">待执行</div>
          <div class="count">10086<span>条</span></div>
        </div>
      </div>
      <div class="top-NDFAnomaly">
        <img src="../assets/images/NDFAnomaly.png" class="top-totalAnomaly-img">
        <div class="top-son">
          <div class="issue">进行中</div>
          <div class="count">10086<span>条</span></div>
        </div>
      </div>
      <div class="top-NDFAnomaly">
        <img src="../assets/images/NDFAnomaly.png" class="top-totalAnomaly-img">
        <div class="top-son">
          <div class="issue">异常/故障</div>
          <div class="count">10086<span>条</span></div>
        </div>
      </div>
    </div>
<!--   表格 -->
    <div>
      <el-table :data="templateList"class="styleTable">
        <el-table-column label="AVG编号" prop="beginStationId" align="center" :show-overflow-tooltip="true" width="75"/>/>
        <el-table-column label="机器人名称" prop="prodLineName" align="center" :show-overflow-tooltip="true" />
        <el-table-column label="电量状态" prop="productCode" align="center" :show-overflow-tooltip="true"/>
        <el-table-column label="异常/故障原因" prop="endStationId" align="center" :show-overflow-tooltip="true" />
      </el-table>
      <pagination class="pagination" v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                  @pagination="getList"/>
    </div>
<!--    柱状图-->
      <div class="pillarl">
        <div ref="pillarlLeft" class="leftPillarl">
        </div>
        <div ref="pillarlRight" class="rightPillarl">
        </div>
      </div>
<!--    饼状图-->
    <div class="circle">
      <div ref="circle" class="circleOne"></div>
      <div ref="circle1" class="circleOne"></div>
      <div ref="circle2" class="circleOne"></div>
      <div ref="circle3" class="circleOne"></div>
      <div ref="circle4" class="circleOne"></div>
      <div ref="circle5" class="circleOne"></div>
      <div ref="circle6" class="circleOne"></div>
      <div ref="circle7" class="circleOne"></div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      templateList:null,
      total:0,
      queryParams:{},
      pillarlist:[]
    }
  },
  mounted() {
    this.pillarlLeft()
    this.pillarlRight()
    this.circlemessage()
    this.circlemessage1()
    this.circlemessage2()
    this.circlemessage3()
    this.circlemessage4()
    this.circlemessage5()
    this.circlemessage6()
    this.circlemessage7()
  },
  methods:{
    //表格数据
    getList(){},
    // 获取左柱形图的数据
    pillarlLeft() {
      // getpillar(this.queryParams1).then(res => {
      //   if(res){
          const chartBox = this.$echarts.init(this.$refs.pillarlLeft);
          // this.pillarlist = res.data;
          // this.datelist = this.pillarlist.map(item=>item.date)
          // this.countlist = this.pillarlist.map(item=>item.count)
          const option = {
            // 设置图表的标题
            title: {
              text: '备料图号配置当日生产数量情况',
              textStyle: {
                fontSize: 18,
                color:'black',
              },
              left: 'center', // 设置标题水平居中
              top: '10px'
            },
            xAxis: {
              // data: this.datelist,
              data: ['总任务数量','待执行','进行中','已完成','延误/故障'],
              axisTick:{
                show:false//取消坐标刻度线
              },
              axisLabel: {
                color: 'rgb(27,40,58)' // 设置x轴刻度文字颜色
              },
            },
            yAxis: {
              axisLabel: {
                color: 'rgb(27,40,58)' // 设置x轴刻度文字颜色
              },
              splitLine: {
                lineStyle: {
                  // 设置背景横线
                  color: '#E0E6F1',
                  width: 2 // 设置背景横线宽度
                }
              },
            },
            series: [
              {
                type: "bar",
                // data: this.countlist,
                data: [88,22,66,99,33],
                barWidth: 30,
                itemStyle: {
                  color: 'rgb(147,190,255)' // 设置柱形颜色
                }
              },
            ],
          };
          chartBox.setOption(option);
          // 根据页面大小自动响应图表大小
          window.addEventListener("resize", function () {
            chartBox.resize();
          });
        // }})
    },
    // 获取右柱形图的数据
    pillarlRight() {
      // getpillar(this.queryParams1).then(res => {
      //   if(res){
      const chartBox = this.$echarts.init(this.$refs.pillarlRight);
      // this.pillarlist = res.data;
      // this.datelist = this.pillarlist.map(item=>item.date)
      // this.countlist = this.pillarlist.map(item=>item.count)
      const option = {
        // 设置图表的标题
        title: {
          text: '下线图号配置当日生产数量情况',
          textStyle: {
            fontSize: 18,
            color:'black',
          },
          left: 'center', // 设置标题水平居中
          top: '10px'
        },
        xAxis: {
          // data: this.datelist,
          data: ['总任务数量','待执行','进行中','已完成','延误/故障'],
          axisTick:{
            show:false//取消坐标刻度线
          },
          axisLabel: {
            color: 'rgb(27,40,58)' // 设置x轴刻度文字颜色
          },
        },
        yAxis: {
          axisLabel: {
            color: 'rgb(27,40,58)' // 设置x轴刻度文字颜色
          },
          splitLine: {
            lineStyle: {
              // 设置背景横线
              color: '#E0E6F1',
              width: 2 // 设置背景横线宽度
            }
          },
        },
        series: [
          {
            type: "bar",
            // data: this.countlist,
            data: [88,22,66,99,33],
            barWidth: 30,
            itemStyle: {
              color: 'rgb(47,81,255)' // 设置柱形颜色
            }
          },
        ],
      };
      chartBox.setOption(option);
      // 根据页面大小自动响应图表大小
      window.addEventListener("resize", function () {
        chartBox.resize();
      });
      // }})
    },
    // 获取饼图的数据
    circlemessage() {
      // getcircle(this.queryParams1).then(res => {
      //   if(res){
      //     const resArr = Object.entries(res.data).map(([name, value]) => {
      //       return { name, value: value };
      //     });
      // 假设totalValue为总数据的值，dataValue为单条数据的值
      let totalValue = 2000;
      let dataValue = 800;
      let percent = (dataValue / totalValue) * 100;
      const circleBox = this.$echarts.init(this.$refs.circle);
      const option = {
        tooltip: {
              trigger: 'item'
            },
        legend: {
          bottom: '5%',
          left: 'center',
          data: ['产线一'], // 设置legend的数据项
          show: true, // 设置legend显示
        },
        series: [
              {
                type: 'pie',
                label: {
                  show: true,
                  position: 'center',
                  formatter: '{d}%',
                  textStyle: {
                    color: 'rgb(47,81,255)',     // 设置label的文字颜色
                    fontSize: '24px',
                    fontWeight:'600'// 设置label的文字大小
                  }
                },
                radius: ['60%', '80%'],
                center: ['50%', '50%'],// x轴50%，y轴55%，位置向下偏移
                // data: resArr,
                data: [{  value: percent, name: '产线一',label: { show: true },itemStyle: { color: 'rgb(47,81,255)' }},{  value: 100 - percent, name: '未完成', label: { show: false }, itemStyle: { color: 'rgb(147,190,255)' },}],
              }
            ]
          }
          circleBox.setOption(option);
          // 根据页面大小自动响应图表大小
          window.addEventListener("resize", function () {
            circleBox.resize();
          });
        // }})
    },// 获取饼图的数据
    circlemessage1() {
      let totalValue = 2000;
      let dataValue = 800;
      let percent = (dataValue / totalValue) * 100;
      const circleBox = this.$echarts.init(this.$refs.circle1);
      const option = {
        tooltip: {
              trigger: 'item'
            },
        legend: {
          bottom: '5%',
          left: 'center',
          data: ['产线二'], // 设置legend的数据项
          show: true, // 设置legend显示
        },
        series: [
              {
                type: 'pie',
                label: {
                  show: true,
                  position: 'center',
                  formatter: '{d}%',
                  textStyle: {
                    color: 'rgb(47,81,255)',     // 设置label的文字颜色
                    fontSize: '24px',
                    fontWeight:'600'// 设置label的文字大小
                  }
                },
                radius: ['60%', '80%'],
                center: ['50%', '50%'],// x轴50%，y轴55%，位置向下偏移
                // data: resArr,
                data: [{  value: percent, name: '产线二',label: { show: true },itemStyle: { color: 'rgb(47,81,255)' }},{  value: 100 - percent, name: '未完成', label: { show: false }, itemStyle: { color: 'rgb(147,190,255)' },}],
              }
            ]
          }
          circleBox.setOption(option);
          // 根据页面大小自动响应图表大小
          window.addEventListener("resize", function () {
            circleBox.resize();
          });
        // }})
    },// 获取饼图的数据
    circlemessage2() {
      let totalValue = 2000;
      let dataValue = 800;
      let percent = (dataValue / totalValue) * 100;
      const circleBox = this.$echarts.init(this.$refs.circle2);
      const option = {
        tooltip: {
              trigger: 'item'
            },
        legend: {
          bottom: '5%',
          left: 'center',
          data: ['产线三'], // 设置legend的数据项
          show: true, // 设置legend显示
        },
        series: [
              {
                type: 'pie',
                label: {
                  show: true,
                  position: 'center',
                  formatter: '{d}%',
                  textStyle: {
                    color: 'rgb(47,81,255)',     // 设置label的文字颜色
                    fontSize: '24px',
                    fontWeight:'600'// 设置label的文字大小
                  }
                },
                radius: ['60%', '80%'],
                center: ['50%', '50%'],// x轴50%，y轴55%，位置向下偏移
                // data: resArr,
                data: [{  value: percent, name: '产线三',label: { show: true },itemStyle: { color: 'rgb(47,81,255)' }},{  value: 100 - percent, name: '未完成', label: { show: false }, itemStyle: { color: 'rgb(147,190,255)' },}],
              }
            ]
          }
          circleBox.setOption(option);
          // 根据页面大小自动响应图表大小
          window.addEventListener("resize", function () {
            circleBox.resize();
          });
        // }})
    },// 获取饼图的数据
    circlemessage3() {
      let totalValue = 2000;
      let dataValue = 800;
      let percent = (dataValue / totalValue) * 100;
      const circleBox = this.$echarts.init(this.$refs.circle3);
      const option = {
        tooltip: {
              trigger: 'item'
            },
        legend: {
          bottom: '5%',
          left: 'center',
          data: ['产线四'], // 设置legend的数据项
          show: true, // 设置legend显示
        },
        series: [
              {
                type: 'pie',
                label: {
                  show: true,
                  position: 'center',
                  formatter: '{d}%',
                  textStyle: {
                    color: 'rgb(47,81,255)',     // 设置label的文字颜色
                    fontSize: '24px',
                    fontWeight:'600'// 设置label的文字大小
                  }
                },
                radius: ['60%', '80%'],
                center: ['50%', '50%'],// x轴50%，y轴55%，位置向下偏移
                // data: resArr,
                data: [{  value: percent, name: '产线四',label: { show: true },itemStyle: { color: 'rgb(47,81,255)' }},{  value: 100 - percent, name: '未完成', label: { show: false }, itemStyle: { color: 'rgb(147,190,255)' },}],
              }
            ]
          }
          circleBox.setOption(option);
          // 根据页面大小自动响应图表大小
          window.addEventListener("resize", function () {
            circleBox.resize();
          });
        // }})
    },// 获取饼图的数据
    circlemessage4() {
      // 假设totalValue为总数据的值，dataValue为单条数据的值
      let totalValue = 2000;
      let dataValue = 800;
      let percent = (dataValue / totalValue) * 100;
      const circleBox = this.$echarts.init(this.$refs.circle4);
      const option = {
        tooltip: {
              trigger: 'item'
            },
        legend: {
          bottom: '5%',
          left: 'center',
          data: ['产线五'], // 设置legend的数据项
          show: true, // 设置legend显示
        },
        series: [
              {
                type: 'pie',
                label: {
                  show: true,
                  position: 'center',
                  formatter: '{d}%',
                  textStyle: {
                    color: 'rgb(47,81,255)',     // 设置label的文字颜色
                    fontSize: '24px',
                    fontWeight:'600'// 设置label的文字大小
                  }
                },
                radius: ['60%', '80%'],
                center: ['50%', '50%'],// x轴50%，y轴55%，位置向下偏移
                // data: resArr,
                data: [{  value: percent, name: '产线五',label: { show: true },itemStyle: { color: 'rgb(47,81,255)' }},{  value: 100 - percent, name: '未完成', label: { show: false }, itemStyle: { color: 'rgb(147,190,255)' },}],
              }
            ]
          }
          circleBox.setOption(option);
          // 根据页面大小自动响应图表大小
          window.addEventListener("resize", function () {
            circleBox.resize();
          });
        // }})
    },// 获取饼图的数据
    circlemessage5() {
      let totalValue = 2000;
      let dataValue = 800;
      let percent = (dataValue / totalValue) * 100;
      const circleBox = this.$echarts.init(this.$refs.circle5);
      const option = {
        tooltip: {
              trigger: 'item'
            },
        legend: {
          bottom: '5%',
          left: 'center',
          data: ['产线六'], // 设置legend的数据项
          show: true, // 设置legend显示
        },
        series: [
              {
                type: 'pie',
                label: {
                  show: true,
                  position: 'center',
                  formatter: '{d}%',
                  textStyle: {
                    color: 'rgb(47,81,255)',     // 设置label的文字颜色
                    fontSize: '24px',
                    fontWeight:'600'// 设置label的文字大小
                  }
                },
                radius: ['60%', '80%'],
                center: ['50%', '50%'],// x轴50%，y轴55%，位置向下偏移
                // data: resArr,
                data: [{  value: percent, name: '产线六',label: { show: true },itemStyle: { color: 'rgb(47,81,255)' }},{  value: 100 - percent, name: '未完成', label: { show: false }, itemStyle: { color: 'rgb(147,190,255)' },}],
              }
            ]
          }
          circleBox.setOption(option);
          // 根据页面大小自动响应图表大小
          window.addEventListener("resize", function () {
            circleBox.resize();
          });
        // }})
    },// 获取饼图的数据
    circlemessage6() {
      let totalValue = 2000;
      let dataValue = 800;
      let percent = (dataValue / totalValue) * 100;
      const circleBox = this.$echarts.init(this.$refs.circle6);
      const option = {
        tooltip: {
              trigger: 'item'
            },
        legend: {
          bottom: '5%',
          left: 'center',
          data: ['产线七'], // 设置legend的数据项
          show: true, // 设置legend显示
        },
        series: [
              {
                type: 'pie',
                label: {
                  show: true,
                  position: 'center',
                  formatter: '{d}%',
                  textStyle: {
                    color: 'rgb(47,81,255)',     // 设置label的文字颜色
                    fontSize: '24px',
                    fontWeight:'600'// 设置label的文字大小
                  }
                },
                radius: ['60%', '80%'],
                center: ['50%', '50%'],// x轴50%，y轴55%，位置向下偏移
                // data: resArr,
                data: [{  value: percent, name: '产线七',label: { show: true },itemStyle: { color: 'rgb(47,81,255)' }},{  value: 100 - percent, name: '未完成', label: { show: false }, itemStyle: { color: 'rgb(147,190,255)' },}],
              }
            ]
          }
          circleBox.setOption(option);
          // 根据页面大小自动响应图表大小
          window.addEventListener("resize", function () {
            circleBox.resize();
          });
        // }})
    },// 获取饼图的数据
    circlemessage7() {
      let totalValue = 2000;
      let dataValue = 800;
      let percent = (dataValue / totalValue) * 100;
      const circleBox = this.$echarts.init(this.$refs.circle7);
      const option = {
        tooltip: {
              trigger: 'item'
            },
        legend: {
          bottom: '5%',
          left: 'center',
          data: ['产线八'], // 设置legend的数据项
          show: true, // 设置legend显示
        },
        series: [
              {
                type: 'pie',
                label: {
                  show: true,
                  position: 'center',
                  formatter: '{d}%',
                  textStyle: {
                    color: 'rgb(47,81,255)',     // 设置label的文字颜色
                    fontSize: '24px',
                    fontWeight:'600'// 设置label的文字大小
                  }
                },
                radius: ['60%', '80%'],
                center: ['50%', '50%'],// x轴50%，y轴55%，位置向下偏移
                // data: resArr,
                data: [{  value: percent, name: '产线八',label: { show: true },itemStyle: { color: 'rgb(47,81,255)' }},{  value: 100 - percent, name: '未完成', label: { show: false }, itemStyle: { color: 'rgb(147,190,255)' },}],
              }
            ]
          }
          circleBox.setOption(option);
          // 根据页面大小自动响应图表大小
          window.addEventListener("resize", function () {
            circleBox.resize();
          });
        // }})
    },

    /** 首页数据看板 */
    dataBoard() {
      const {href} = this.$router.resolve('/indexBoard');
      const newWindow = window.open(href, '_blank')
      if (newWindow) {
        newWindow.addEventListener('load', () => {
          newWindow.dispatchEvent(new KeyboardEvent('keydown', {key: 'F11'}));
        });
      }
      // screenfull.toggle()
    },
    /** 下线数据看板 */
    dataBoard1() {
      const {href} = this.$router.resolve('/outProdPlanBoard');
      const newWindow = window.open(href, '_blank')
      if (newWindow) {
        newWindow.addEventListener('load', () => {
          newWindow.dispatchEvent(new KeyboardEvent('keydown', {key: 'F11'}));
        });
      }
      // screenfull.toggle()
    },
    /** 备料数据看板 */
    dataBoard2() {
      const {href} = this.$router.resolve('/inProdPlanBoard');
      const newWindow = window.open(href, '_blank')
      if (newWindow) {
        newWindow.addEventListener('load', () => {
          newWindow.dispatchEvent(new KeyboardEvent('keydown', {key: 'F11'}));
        });
      }
      // screenfull.toggle()
    },
  }
}
</script>
<style scoped lang="scss">
.LookBtn{
  width: 100%;
  display: flex;
  //justify-content: space-around;
  //margin-bottom: 5px;
}
.pillarl{
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
  height: 280px;
  display: flex;
  justify-content: space-around;
  .leftPillarl{
    width: 49%;
    height: 100%;
    margin-right: 1%;
    background-color: #FFFFFF;
  }
  .rightPillarl{
    width: 49%;
    height: 100%;
    margin-left: 1%;
    background-color: #FFFFFF;
  }
}
.circle{
  width: 100%;
  height: 250px;
  display: flex;
  overflow: hidden;
  //justify-content: space-around;
  .circleOne{
    height:100%;
    width: 300px;
    background-color: #fff;
    margin-right: 20px;
  }
}
.top {
  height: 100px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  //padding-top: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 4px;
  .top-totalAnomaly{
    display: flex;
    position: relative;
    top: 20px;
    margin-left: 20px;
    width: 350px;
    .top-son {
      width: 260px;
      height: 100px;
    }
    .top-totalAnomaly-img{
      //border:2px solid red;
      width: 54px;
      height: 54px;
    }
  }
}
.top-NDFAnomaly{
  display: flex;position: relative;top: 20px;
  .top-totalAnomaly-img{
    width: 54px;
    height: 54px;
  }
}
.top-son {
  //border:1px solid blue;
  width: 190px;
  height: 100px;
  //margin-left: 20px;
  //display: flex;
  //align-items: center;
  //justify-content: center;
}

.issue {
  font-size: 14px;
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 隐藏溢出部分 */
  text-overflow: ellipsis; /* 显示省略号 */
}
.issueWi{
  width: 320px !important;
}
.count {
  font-size: 34px;
  font-weight: bold;
  margin: 4px 0;
  span{
    font-size: 12px;margin-left: 18px;font-weight: normal;
  }
}
</style>
