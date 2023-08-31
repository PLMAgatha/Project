<template>
  <div class="mybox">
    <header>
      <h1>EMI-上海亚大智能配送系统</h1>
    </header>
    <main>
      <!-- 左侧 -->
      <div class="left">
        <div class="left_odiv" style="margin-top: 7%">
          <p>上个月半成品任务完成数</p>
          <p><span class="osapn">{{ monInProd }}</span>次</p>
          <p>月度任务数：<span>{{ nowMonInProd }}</span>次 占总任务：<span>{{ (monInProd !== 0) ? ((monInProd / nowMonInProd * 100).toFixed(1)) : 0 }}%</span></p>

          <div class="geuge">
            <Gauge
              color1="rgb(252, 164, 111)"
              color2="rgb(249, 142, 143)"
              :value="msg"
            ></Gauge>
          </div>
        </div>

        <div class="left_odiv">
          <p>上个月成品任务完成数</p>
          <p><span class="osapn">{{ monOutProd }}</span>次</p>
          <p>月度任务数：<span>{{ nowMonOutProd }}</span>次 占总任务：<span>{{ (monOutProd !== 0) ? ((monOutProd / nowMonOutProd * 100).toFixed(1)) : 0 }}%</span></p>

          <div class="geuge">
            <Gauge
              color1="rgb(40, 108, 123)"
              color2="rgb(3, 202, 254)"
              :value="msg1"
            ></Gauge>
          </div>
        </div>

        <div class="left_odiv">
          <p>今日成品任务完成数</p>
          <p><span class="osapn">{{ dayOutProd }}</span>次</p>
          <p>近一周任务数：<span>{{ weekOutProd }}</span>次 占总任务：<span>{{ (dayOutProd !== 0) ? ((dayOutProd / weekOutProd * 100).toFixed(1)) : 0 }}%</span></p>

          <div class="geuge">
            <Gauge
              color1="rgb(252, 164, 111)"
              color2="rgb(249, 142, 143)"
              :value="msg2"
            ></Gauge>
          </div>
        </div>

        <div class="left_odiv">
          <p>今日半成品任务完成数</p>
          <p><span class="osapn">{{ dayInProd }}</span>次</p>
          <p>近一周任务数：<span>{{ weekInProd }}</span>次 占总任务：<span>{{ (dayInProd !== 0) ? ((dayInProd / weekInProd * 100).toFixed(1)) : 0 }}%</span></p>

          <div class="geuge">
            <Gauge
              color1="rgb(40, 108, 123)"
              color2="rgb(3, 202, 254)"
              :value="msg3"
            ></Gauge>
          </div>
        </div>
      </div>
      <!-- 中间 -->
      <div class="conter">
<!--        <Conter-->
<!--          color1="rgb(0, 151, 252)"-->
<!--          color2="rgb(0, 212, 254)"-->
<!--          :value="msgc"-->
<!--        ></Conter>-->
        <div class="conterEcharts" ref="conterEcharts"></div>
        <span>今日任务总次数</span>
        <div class="conterNum">
          <div class="conterNumTop">半成品任务数</div>
          <div class="conterNumBottom">{{ dayInProd }}</div>
        </div>
        <div class="conterNum1">
          <div class="conterNumTop">成品任务数</div>
          <div class="conterNumBottom">{{ dayOutProd }}</div>
        </div>
      </div>

      <!-- 右侧 -->
      <div class="right">
        <el-table :data="templateList"class="styleTable">
          <el-table-column label="起点点位" prop="beginStationId" align="center" :show-overflow-tooltip="true" width="75"/>/>
          <el-table-column label="线体名称" prop="prodLineName" align="center" :show-overflow-tooltip="true" />
          <el-table-column label="线体代号" prop="productCode" align="center" :show-overflow-tooltip="true"/>
          <el-table-column label="终点点位" prop="endStationId" align="center" :show-overflow-tooltip="true" />
          <el-table-column label="工单号" prop="orderNumber" align="center" :show-overflow-tooltip="true"/>
          <el-table-column label="物料编码" prop="productCode" align="center" :show-overflow-tooltip="true" />
          <el-table-column label="工单数量" prop="orderProductCount" align="center" :show-overflow-tooltip="true" />
        </el-table>
        <!-- 上部分 -->
        <div class="top">
          <h4 class="title">已执行AGV任务</h4>
        </div>
        <!-- 下部分 -->
        <div class="footer">
          <h4 class="title title1">AGV状态</h4>

          <div class="footer_text">
            <span>{{ executing }}</span>
            <p>执行中</p>
          </div>

          <div class="footer_text2">
            <span>{{ unexecuted }}</span>
            <p>空闲</p>
          </div>

          <div class="footer_text3">
            <span class="footer_text_span">{{ fault }}</span>
            <p>故障</p>
          </div>
        </div>
      </div>
    </main>
    <footer>
      <div class="footerBox1">
<!--        &lt;!&ndash; 上部分 &ndash;&gt;-->
        <div class="top top1">
          <h4 class="title title2">24h配送密度统计</h4>
          <div ref="InAndOutDayProd" class="lineMi"></div>
        </div>
      </div>
      <div class="footerBox2">
<!--        &lt;!&ndash;        执行中&ndash;&gt;-->
        <el-table :data="templateList1"class="styleTable1">
          <el-table-column label="起点点位" prop="beginStationId" align="center" :show-overflow-tooltip="true" width="75"/>
          <el-table-column label="线体名称" prop="prodLineName" align="center" :show-overflow-tooltip="true" width="75"/>
          <el-table-column label="线体代号" prop="productCode" align="center" :show-overflow-tooltip="true" width="75"/>
          <el-table-column label="终点点位" prop="endStationId" align="center" :show-overflow-tooltip="true" width="75"/>
          <el-table-column label="工单号" prop="orderNumber" align="center" :show-overflow-tooltip="true" width="60"/>
          <el-table-column label="物料编码" prop="productCode" align="center" :show-overflow-tooltip="true" width="75"/>
          <el-table-column label="工单数量" prop="orderProductCount" align="center" :show-overflow-tooltip="true" width="75"/>
        </el-table>
<!--        &lt;!&ndash; 上部分 &ndash;&gt;-->
        <div class="top">
          <h4 class="title">执行中AGV任务</h4>
        </div>
      </div>
      <div class="footerBox3">
        <el-table :data="templateList3"class="styleTable1">
          <el-table-column label="起点点位" prop="beginStationId" align="center" :show-overflow-tooltip="true"/>
          <el-table-column label="线体名称" prop="prodLineName" align="center" :show-overflow-tooltip="true" />
          <el-table-column label="线体代号" prop="productCode" align="center" :show-overflow-tooltip="true"/>
          <el-table-column label="终点点位" prop="endStationId" align="center" :show-overflow-tooltip="true" />
          <el-table-column label="工单号" prop="orderNumber" align="center" :show-overflow-tooltip="true"/>
          <el-table-column label="物料编码" prop="productCode" align="center" :show-overflow-tooltip="true" />
          <el-table-column label="工单数量" prop="orderProductCount" align="center" :show-overflow-tooltip="true" />
        </el-table>
        <!-- 上部分 -->
        <div class="top">
          <h4 class="title">待执行AGV任务</h4>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Gauge from './canvas.vue';
import {getDayAndMonProd, getprodplanlistBoard,getAgvStatus,getInAndOutDayProd} from "@/api/index";

export default {
  components: {
    Gauge,
  },
  data() {
    return {
      msg: null,//进度条
      msg1: null,//进度条
      msg2: null,//进度条
      msg3: null,//进度条
      // msgc: 58,
      templateList:null,//已执行
      templateList1:null,//执行中
      templateList3:null,//待执行
      queryParams: {status: 0,},//未执行
      queryParams1: {status: 1,},//正在执行
      queryParams2: {status: 2,},//已执行
      queryParams3: {status: 3,},//异常
      executing:null,//已执行状态
      unexecuted:null,//未执行状态
      fault:null,//故障状态
      monInProd:null,//上个月半成品任务完成数
      monOutProd:null,//上个月成品任务完成数
      dayOutProd:null,//今日成品任务完成数
      dayInProd:null,//今日半成品任务完成数
      nowMonInProd:null,//月度半成品任务数
      nowMonOutProd:null,//月度成品任务数
      weekInProd:null,//近一周半成品任务完成数
      weekOutProd:null,//近一周成品任务完成数
    };
  },
  created() {
    this.getDayAndMonProd();
  },
  mounted() {
    this.getprodplanlistBoard();
    this.getAgvStatus()
    this.getInAndOutDayProd();
  },
  methods: {
    //任务完成数
    getDayAndMonProd() {
      getDayAndMonProd().then(
        response => {
          // console.log(response.data)
          this.monInProd = response.data.monInProd
          this.monOutProd = response.data.monOutProd
          this.dayOutProd = response.data.dayOutProd
          this.dayInProd = response.data.dayInProd
          this.nowMonInProd = response.data.nowMonInProd
          this.nowMonOutProd = response.data.nowMonOutProd
          this.weekInProd = response.data.weekInProd
          this.weekOutProd = response.data.weekOutProd
          this.msg = this.monInProd / this.nowMonInProd
          this.msg1 = this.monOutProd / this.nowMonOutProd
          this.msg2 = this.dayOutProd / this.weekOutProd
          this.msg3 = this.dayInProd / this.weekInProd
          //仪表盘
          const data = this.dayInProd +this.dayOutProd
          const lineBox = this.$echarts.init(this.$refs.conterEcharts);
          const option = {
            series: [
              {
                type: 'gauge',
                data: [
                  //每一个对象代表一个指针
                  {
                    //控制指针的数值
                    value: data,
                    //控制指针的颜色
                    itemStyle: {
                      color: 'auto'
                    }
                  }
                ],
                //配置仪表盘的数值范围
                min: 0,
                max: 500,
                axisLine: {
                  lineStyle: {
                    color: [
                      [1 / 3, 'rgb(103,224,227)'],
                      [2 / 3, 'rgb(55,162,218)'],
                      [1, 'rgb(253,102,109)'],
                    ]
                  }
                },
                splitLine: {
                  lineStyle: {
                    color: '#fff',
                    width: 3
                  }
                },
                // 刻度样式
                axisTick: {
                  lineStyle: {
                    color: '#fff',
                    width: 2
                  }
                },
                //刻度标签
                axisLabel: {
                  color: 'inherit',
                },
                detail: {
                  textStyle: {
                    color: 'auto'
                  }
                }
              },
            ]
          };
          lineBox.setOption(option);
          // 根据页面大小自动响应图表大小
          window.addEventListener("resize", function () {
            lineBox.resize();
          });
        }
      );
    },
    getprodplanlistBoard() {
      //已执行AGV任务
      getprodplanlistBoard(this.queryParams2).then(
        response => {
          // console.log(response)
          this.templateList = response.data
        }
      ),
        //执行中AGV任务
        getprodplanlistBoard(this.queryParams1).then(
          response => {
            // console.log(response)
            this.templateList1 = response.data
          }
        ),
        //待执行AGV任务
        getprodplanlistBoard(this.queryParams).then(
          response => {
            // console.log(response)
            this.templateList3 = response.data
          }
        )
    },
    getAgvStatus() {
      //AGV小车状态
      getAgvStatus().then(
        response => {
          this.executing = response.data.executing
          this.unexecuted = response.data.unexecuted
          this.fault = response.data.fault
        }
      )
    },
    getInAndOutDayProd() {
      //密度曲线图
      getInAndOutDayProd().then(
        response => {
          if (response) {
            let data = response.data
            // 提取属性值作为曲线图的数据
            var hours = data.map(function (item) {
              return item.hour;
            });
            var outProdPlanData = data.map(function (item) {
              return item.outProdPlan;
            });
            var inProdPlanData = data.map(function (item) {
              return item.inProdPlan;
            });
            const lineBox = this.$echarts.init(this.$refs.InAndOutDayProd);
            const option = {
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: 'rgba(16,182,220)',
                  }
                }
              },
              legend: {
                left: 450,
                top: 0,
                orient: 'vertical',//垂直排列
                icon: 'circle',
                itemGap: 15, // 设置间隔为20像素
                data: ['半成品', '成品'],
                textStyle: {
                  // color: ['rgba(41,120,240)', 'rgba(16,182,220)']  // 设置文字颜色与曲线颜色一致
                  color: ['#fff', '#eee']  // 设置文字颜色与曲线颜色一致
                },
              },
              xAxis: [
                {
                  data: hours,
                  axisLabel: {
                    color: 'rgb(81,139,194)' // 设置x轴刻度文字颜色
                  },
                }
              ],
              yAxis: [
                {
                  type: 'value',
                  axisLabel: {
                    color: 'rgb(81,139,194)',// 设置y轴刻度文字颜色
                    interval: 14
                  },
                  splitLine: {
                    lineStyle: {
                      // 设置背景横线
                      color: 'rgb(81,139,194)',
                      width: 2 // 设置背景横线宽度
                    }
                  },
                  // axisLine: {
                  //   lineStyle: {
                  //     color: 'rgb(81,139,194)' // 设置y轴刻度线的颜色
                  //   }
                  // }
                }
              ],
              series: [
                {
                  type: 'line',
                },
                {
                  name: '半成品',
                  type: 'line',
                  // smooth: true,
                  // symbol: 'none',
                  symbol: 'circle',
                  symbolSize: 8,  // 设置 symbol 的大小
                  // symbol: 'emptyCircle',  // 设置 symbol 的形状
                  itemStyle: {
                    color: 'rgba(41,120,240)',  // 设置 symbol 的颜色
                  },
                  lineStyle: {
                    color: 'rgba(41,120,240)' //设置曲线颜色
                  },
                  // areaStyle: {
                  //   color: 'rgba(41,120,240,0.3)' // 设置包含区域的颜色为半透明
                  // },
                  data: outProdPlanData
                },
                {
                  name: '成品',
                  type: 'line',
                  // smooth: true,
                  // symbol: 'none',
                  symbol: 'circle',
                  symbolSize: 8,  // 设置 symbol 的大小
                  // symbol: 'emptyCircle',  // 设置 symbol 的形状
                  itemStyle: {
                    color: 'rgba(244,117,4)',  // 设置 symbol 的颜色
                  },
                  lineStyle: {
                    color: 'rgba(16,182,220)' //设置曲线颜色
                  },
                  // areaStyle: {
                  //   color: 'rgba(244,117,4,0.5)' // 设置包含区域的颜色为半透明
                  // },
                  data: inProdPlanData
                },
              ]
            };
            lineBox.setOption(option);
            // 根据页面大小自动响应图表大小
            window.addEventListener("resize", function () {
              lineBox.resize();
            });
          }
        }
      )
    },
  }
};
</script>

<style lang="scss">
p {
  margin: 0;
  padding: 0;
}

.title {
  box-sizing: border-box;
  width: 100%;
  height: 20%;
  text-align: center;
  color: white;
  padding-top: 3%;
  font-size: 14px;
}

.title1 {
  padding-top: 4.5%;
}
.title2 {
  padding-top: 5%;
  font-size: 16px;
}

.mybox {
  width: 100vw;
  height: 100vh;
  // 背景图
  background-image: url('../assets/images/IndexBg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
    position: absolute;
    padding: 0px !important;
    top: 0px;
  // 头部
  header {
    width: 100vw;
    height: 9.5vh;
    text-align: center;
    //opacity: 0.4;
    h1 {
      line-height: 9.5vh;
      color: #7efafc;
      font-family: 字形思源黑体;
      font-size: 32px;
      font-weight: bold;
    }
  }

  //   内容
  main {
    width: 100vw;
    //height: 62.42774566473988vh;
    height: 57.427746vh;
    display: flex;
    position: absolute;
    justify-content: space-between;
    .left {
      width: 34%;
      height: 100%;
      position: relative;
      top: -20px;

      background-image: url('../assets/images/IndexLeft.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;

      .left_odiv {
        width: 70%;
        height: 25%;
        position: relative;
        margin-left: 10%;
        color: rgb(60, 141, 209);
        font-size: 16px;
        .osapn {
          font-size: 30px;
          color: #fff;
          padding: 1%;
        }
        .geuge {
          width: 12.4vh;
          height: 12.4vh;
          position: absolute;
          top: -24%;
          right: 18% !important;
        }
      }
    }
    .conter {
      position: absolute;
      top: -20px;
      left: 30%;
      width: 35%;
      height: 100%;
      background-image: url('../assets/images/conterBg.png');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 100%;
      z-index: 2;
      .conterEcharts{
        width: 450px;
        height: 450px;
        position: relative;
        top: 80px;
        left: 80px;
      }
      span{
        font-size: 18px;
        color: #fff;
        position: relative;
        top: -10px;
        left: 240px;
      }
      .conterNum{
        position: relative;
        left: 100px;
        width: 160px;
        height: 100px;
        background-image: url('../assets/images/numBg.png');
        background-size: cover;
        background-repeat: no-repeat;
        background-size: 235px 184px;
        background-position: -37px -38px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .conterNumTop{
          color: rgb(125,186,211);
          font-size: 14px;
        }
        .conterNumBottom{
          padding-top: 20px;
          color: rgb(0,215,234);
          font-size: 24px;
        }
      }
      .conterNum1{
        position: relative;
        top: -100px;
        left: 360px;
        width: 160px;
        height: 100px;
        background-image: url('../assets/images/numBg.png');
        background-size: cover;
        background-repeat: no-repeat;
        background-size: 235px 184px;
        background-position: -37px -38px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .conterNumTop{
          color: rgb(125,186,211);
          font-size: 14px;
        }
        .conterNumBottom{
          padding-top: 20px;
          color: rgb(0,215,234);
          font-size: 24px;
        }
      }
    }
    .right {
      width: 35%;
      height: 100%;
      position: relative;
      top: -20px;

      .top {
        width: 100%;
        height: 50%;
        background-image: url('../assets/images/TableBg.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        align-content: flex-start;
        flex-wrap: wrap;
        justify-content: center;
      }
      .styleTable{
        width: 558px !important;
        height: 200px !important;
        background-color: transparent !important;
        position: absolute;
        top: 70px;
        right: 20px;
        border-color: transparent !important;
        border-radius: 0;
        //  //margin-left: 20px;
        //  //margin-top: 8px;
      }
      .styleTable .el-table__cell {
        padding: 0px;
        background: rgb(13,29,77) !important;
        border-bottom-color: rgb(13,29,77);
        color: #FFFFFF;
        //border-color: rgb(13,29,77) !important;
      }
      .styleTable .el-table__row {
        height: 10px;
        //border-color: rgb(13,29,77) !important;
        //border: none;
      }
      .footer {
        position: relative;
        top: -16px;
        width: 100%;
        height: 50%;
        background-image: url('../assets/images/FooterBg.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;

        .footer_text {
          width: 65px;
          height: 65px;
          background-color: #378bcc;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 50%;

          position: absolute;
          top: 38%;
          left: 28%;
        }

        .footer_text2 {
          width: 55px;
          height: 55px;
          background-color: #37a7cc;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 50%;

          position: absolute;
          top: 46%;
          left: 52%;
        }

        .footer_text3 {
          width: 45px;
          height: 45px;
          background-color: #3757cc;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 50%;

          position: absolute;
          top: 66%;
          left: 76%;

          font-size: 12px;
        }
      }
    }
  }

  //底部
  footer{
      width: 100vw;
      height: 380px;
      display: flex;
      justify-content: center;
      position: absolute;
      bottom: 0;
    .footerBox1{
      width: 580px;
      height: 380px;
      background-image: url('../assets/images/echarsBG.png');
      background-repeat: no-repeat;
      background-size: 97.5% 88%;
      background-position: 10px 27px; /* 调整背景图的左上角位置 */
      position: relative;
      left: 15px;
      .top {
        .lineMi{
                  position: relative;
                  top: -20px;
                  left: 12px;
                  width: 580px;
                  height: 290px;
                  z-index: 9;
                }
    }
  };
    .footerBox2{
      width: 580px;
      height: 380px;
      background-image: url('../assets/images/TableBg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: relative;
      left: 2px;
      .top{
        position: relative;
        top: 0px;
        display: flex;
        align-content: flex-start;
        flex-wrap: wrap;
        justify-content: center;
        .title{
          position: relative;
          top: -210px;
          font-size: 14px;
        };
      }
      .styleTable1{
              width: 558px !important;
              height: 224px !important;
              background-color: transparent !important;
              position: relative;
              top: 100px;
              left: 25px;
              border-color: transparent !important;
              border-radius: 0;
            }
          .styleTable1 .el-table__cell {
            padding: 0px;
            background: rgb(13,29,77) !important;
            border-bottom-color: rgb(13,29,77);
            color: #FFFFFF;
            //border-color: rgb(13,29,77) !important;
          }
          .styleTable1 .el-table__row {
            height: 10px;
            //border-color: rgb(13,29,77) !important;
            //border: none;
          }
    };
    .footerBox3{
      width: 610px;
      height: 380px;
      //background-image: url('../assets/images/TableBg.png');
      //background-repeat: no-repeat;
      //background-size: 100% 100%;
      position: relative;
      right: 28.5px;
      //overflow: hidden;
      .top{
        width: 600px;
        height:380px;
        position: relative;
        background-image: url('../assets/images/TableBg.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        background-position: 15px 0px;
        top: 0px;
        //right: -15px;
        display: flex;
        align-content: flex-start;
        flex-wrap: wrap;
        justify-content: center;
        .title{
          position: relative;
          top:12px;
          left: 13px;
          font-size: 14px;
        };
      }
      .styleTable1{
        width: 560px !important;
        height: 224px !important;
        background-color: transparent !important;
        position: absolute;
        top: 100px;
        left: 35px;
        z-index: 99;
        border-color: transparent !important;
        border-radius: 0;
      }
      .styleTable1 .el-table__cell {
        padding: 0px;
        background: rgb(13,29,77) !important;
        border-bottom-color: rgb(13,29,77);
        color: #FFFFFF;
        //border-color: rgb(13,29,77) !important;
      }
      .styleTable1 .el-table__row {
        height: 10px;
        //border-color: rgb(13,29,77) !important;
        //border: none;
      }
    };
  }

}
.el-table::before {
  height: 0;
}

</style>
