<template>
  <div>
    <canvas :id="'progress-bar' + num"></canvas>
  </div>
</template>

<script>
export default {
  props: {
    color1: String,
    color2: String,
    value: Number
  },
  data() {
    return {
      num: Math.floor(Math.random() * 900) + 100
    };
  },
  watch:{
    value(newValue,oldValue){
      this.drawProgressBar(newValue);
    }
  },

  created() {},
  mounted() {
    //  这里是进度 百分比 父组件传递过来
    this.drawProgressBar(this.value);
  },
  methods: {
    drawProgressBar(progress) {
      var canvas = document.getElementById('progress-bar' + this.num);
      var context = canvas.getContext('2d');

      const x = canvas.width / 2;
      const y = canvas.height / 2;

      const startAngle = Math.PI; // 起始角度，从圆的左侧中间位置开始

      const percentage = progress; // 百分比，表示结束位置占据的角度范围
      const endAngle = startAngle + percentage * 2 * Math.PI; // 结束角度

      context.beginPath();
      context.arc(x, y, 50, startAngle, startAngle * 2 * Math.PI);
      context.lineWidth = 2;
      context.lineCap = 'round'; // 设置线条末端样式为圆形

      var gradient = context.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(1, 'rgb(23, 62, 137)');

      context.strokeStyle = gradient;
      context.stroke();

      context.beginPath();
      context.arc(x, y, 50, startAngle, endAngle);
      context.lineWidth = 10;
      context.lineCap = 'round'; // 设置线条末端样式为圆形

      var gradient = context.createLinearGradient(0, 0, canvas.width, 0);

      // 渐变颜色   你在这里设置   接收父组件传递过的颜色
      gradient.addColorStop(0, this.color1);
      gradient.addColorStop(1, this.color2);
      context.strokeStyle = gradient;
      context.stroke();
    }
  }
};
</script>

<style lang="scss" scoped>
#progress-bar {
  width: 100%;
  height: 100%;
}
</style>
