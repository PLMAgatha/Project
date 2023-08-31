<template>
  <div class="app-container" id="kanban">
    <!--顶部-->
    <div class="top">
      <!--名称-->
      <div class="name">
        <span>EMI-上海亚大智能配送系统-下线</span>
      </div>
    </div>
    <!--下方数据表格-->
    <div class="bottom">
      <!--时间-->
      <div class="clock">
        <span>{{ nowDate }}</span>
      </div>
      <div class="clock1">
        <iframe width="300" scrolling="no" height="30" frameborder="0" allowtransparency="true" src="https://i.tianqi.com?c=code&id=34&color=%2300B0F0&icon=1&py=shanghai&site=16"></iframe>
      </div>
      <!--表格-->
      <div class="from">
        <div class="from-box">
          <div class="from-top">
            <img class="from-top-left" src="../../../assets/images/longSide.png">
            <img class="from-top-right" src="../../../assets/images/rightDeltoid.png">
            <span>未执行-AGV任务</span>
          </div>
          <el-table :data="templateList" class="styleTable" height="800">
            <el-table-column label="工单编号" prop="orderNumber" align="center" :show-overflow-tooltip="true"/>
            <el-table-column label="产品图号" prop="productCode" align="center" :show-overflow-tooltip="true" />
            <el-table-column label="工单数量" prop="orderProductCount" align="center" :show-overflow-tooltip="true"/>
            <el-table-column label="起点站点" prop="beginStationName" align="center" :show-overflow-tooltip="true" />
            <el-table-column label="终点站点" prop="endStationName" align="center" :show-overflow-tooltip="true" />
          </el-table>
        </div>
        <div>
          <div class="from-box">
            <div class="from-top">
              <img class="from-top-left" src="../../../assets/images/longSide.png">
              <img class="from-top-right" src="../../../assets/images/rightDeltoid.png">
              <span>进行中-AGV任务</span>
            </div>
            <el-table :data="templateList1" class="styleTable" height="400">
              <el-table-column label="工单编号" prop="orderNumber" align="center" :show-overflow-tooltip="true"/>
              <el-table-column label="产品图号" prop="productCode" align="center" :show-overflow-tooltip="true" />
              <el-table-column label="工单数量" prop="orderProductCount" align="center" :show-overflow-tooltip="true"/>
              <el-table-column label="起点站点" prop="beginStationName" align="center" :show-overflow-tooltip="true" />
              <el-table-column label="终点站点" prop="endStationName" align="center" :show-overflow-tooltip="true" />
            </el-table>
          </div>
          <div class="from-box">
            <div class="from-top">
              <img class="from-top-left" src="../../../assets/images/longSide.png">
              <img class="from-top-right" src="../../../assets/images/rightDeltoid.png">
              <span>异常-AGV任务</span>
            </div>
            <el-table :data="templateList2" class="styleTable" height="340">
              <el-table-column label="工单编号" prop="orderNumber" align="center" :show-overflow-tooltip="true"/>
              <el-table-column label="产品图号" prop="productCode" align="center" :show-overflow-tooltip="true" />
              <el-table-column label="工单数量" prop="orderProductCount" align="center" :show-overflow-tooltip="true"/>
              <el-table-column label="起点站点" prop="beginStationName" align="center" :show-overflow-tooltip="true" />
              <el-table-column label="终点站点" prop="endStationName" align="center" :show-overflow-tooltip="true" />
              <el-table-column label="异常原因及处理" prop="machineName" align="center" :show-overflow-tooltip="true" />
            </el-table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import { getprodplanlistBoard } from "@/api/prodManger/outProdplan";
export default{
  data(){
    return{
      nowDate: '',//实时时间
      city: '上海',
      weatherList: [],//天气
      templateList:null,//未执行列表数据
      templateList1:null,//正在执行列表数据
      templateList2:null,//异常列表数据
      queryParams: {status: 0,},//未执行
      queryParams1: {status: 1,},//正在执行
      queryParams2: {status: 3,},//异常
    }
  },
  mounted() {
    this.currentTime();
    this.getList();
  },
  // 销毁定时器
  beforeDestroy() {
    if (this.formatDate) {
      clearInterval(this.formatDate); // 在Vue实例销毁前，清除时间定时器
    }
  },
  methods: {
    /** 查询列表 */
    getList() {
      //未执行
      getprodplanlistBoard(this.queryParams).then(
        response => {
          this.templateList = response.data;
        }
      );
      //执行中
      getprodplanlistBoard(this.queryParams1).then(
        response => {
          this.templateList1 = response.data;
        }
      );
      //异常
      getprodplanlistBoard(this.queryParams2).then(
        response => {
          this.templateList2 = response.data;
        }
      );
    },
    //当前时间
    currentTime() {
      setInterval(this.formatDate, 500);
    },
    formatDate() {
      let date = new Date();
      let year = date.getFullYear(); // 年
      let month = date.getMonth() + 1; // 月
      let day = date.getDate(); // 日
      let week = date.getDay(); // 星期
      let weekArr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
      let hour = date.getHours(); // 时
      hour = hour < 10 ? "0" + hour : hour; // 如果只有一位，则前面补零
      let minute = date.getMinutes(); // 分
      minute = minute < 10 ? "0" + minute : minute; // 如果只有一位，则前面补零
      let second = date.getSeconds(); // 秒
      second = second < 10 ? "0" + second : second; // 如果只有一位，则前面补零
      this.nowDate = `${year}-${month}-${day} ${weekArr[week]} ${hour}:${minute}:${second} `; //根据自己需要拼接
    },
  },


}
</script>

<style lang="scss">
#app{
  width: 100vw;
  height: 100vh;
  background-color: #030715;
  overflow: hidden;
}
#app .main-container{
  width: 100vw;
  height: 100vh;
  margin-left: 0 !important;
}
#app .sidebar-container{
  display: none!important;
  width: 0 !important;
}
#app .hideSidebar .sidebar-container{
  width: 0 !important;
}
#app .hideSidebar .main-container{
  margin: 0 !important;
}
.tags-view-container[data-v-fac8ca64]{
  display: none;
}
.navbar[data-v-d16d6306]{
  display: none;
}
.app-main{
  //width: 100vw;
  //height: 100vh;
  position: absolute;
  top: 0;
  //left: -200px;
}
.app-container{
  width: 100vw;
  height: 100vh;
  //background: #030715;
  //  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(270deg, #08163E 0%, rgba(8,22,62,0.00) 99%);
  background-image: url("../../../assets/images/preparationBackground.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  //min-width: 800px;
  //min-height: 747px;
  padding: 0;
  margin: 0;
}
.top{
  width: 100%;
  height: 88px;
  //background-image: url("../../../assets/images/boardTopbg.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 0px -10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.top .name span{
  position: relative;
  top: -10px;
  font-family: ZhenyanGB-Regular-Regular;
  font-size: 30px;
  font-weight: normal;
  line-height: 68px;
  text-align: center;
  letter-spacing: 4.4px;
  color: #FFFFFF;
  text-shadow: 0px 4px 21px 0px rgba(27, 126, 242, 0.64);
}
.bottom{
  width:100%;
  height:100% ;
  min-height: 630px;
  margin-top: 27px;
  display: flex;
}
.bottom .clock{
  margin:0px 0 14px 22px;
  position: absolute;
  top:28px;
  right:72px;
}
.bottom .clock1{
  margin:0px 0 14px 22px;
  position: absolute;
  top:20px;
}
.bottom .clock span{
  font-size: 20px;
  color: rgb(69,162,255);
  position: relative;
  top: -2.5px;
  margin-left: 4px;
}
.bottom .from{
  width: 100%;
  height: 100%;
  display: flex;
  //background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(270deg, #08163E 0%, rgba(8,22,62,0.00) 99%);
}
.bottom .from .from-box{
  width: 850px;
}
.bottom .from .from-box .styleTable{
  width: 820px;
  background: transparent;
  margin-left: 20px;
  margin-top: 8px;
}
.el-table tr{
  border: none;
  color: #FFFFFF;
  background-color: #ffffff00 !important;
}
//.el-table th{
//  border: none;
//}
.el-table::before, .el-table--group::after, .el-table--border::after {
  background-color:transparent;
}
.el-table .el-table__header-wrapper th, .el-table .el-table__fixed-header-wrapper th{
  background: rgba(35, 132, 221, 0.3);
  //color: #FFFFFF;
  color: #6FBAFF;
}
.bottom .from .from-box .styleTable .el-table__row {
  height: 33px;
}
.bottom .from .from-box .styleTable .el-table__cell {
  padding: 0px;
  background: rgb(7, 23, 61);
  border-bottom-color: rgb(122, 132, 182);
}
.bottom .from .from-box .from-top{
  display: flex;
  flex-wrap: nowrap;
  //justify-content: center;
  align-items: center;
  margin-left: 20px;
  margin-top: 20px;
  background: rgb(12,39,79);
  width: 820px;
  height: 50px;
  span{
    font-family: 思源黑体;
    font-size: 24px;
    font-weight: normal;
    line-height: 34px;
    letter-spacing: 0px;
    color: rgba(255, 255, 255, 0.87);
    text-shadow: 0px 2px 24px 0px rgba(27, 126, 242, 0.91);
  }
  .from-top-right{
    margin-left: 9px;
    margin-right: 19.5px;
  }
}
</style>
