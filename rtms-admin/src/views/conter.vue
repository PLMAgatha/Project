<template>
  <div style="width: 100%; height: 100%">
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
  created() {},
  mounted() {
    //  这里是进度 百分比 父组件传递过来
    this.drawProgressBar(this.value);
    // 监听窗口resize事件
    let that = this;
    window.addEventListener('resize', function () {
      that.drawProgressBar(that.value);
    });
  },
  methods: {
    drawProgressBar(progress) {
      var canvas = document.getElementById('progress-bar' + this.num);
      var context = canvas.getContext('2d');

      canvas.width = canvas.parentNode.offsetWidth;
      canvas.height = canvas.parentNode.offsetHeight;

      let a = canvas.width / 2;
      let b = canvas.height / 2;

      let r = a / 2.466666666666667;

      const x = canvas.parentNode.offsetWidth / 2 + a / 84;
      const y = canvas.parentNode.offsetHeight / 2 - b / 112.3333333333333;

      let percentage = progress * 0.04554; // 百分比，表示结束位置占据的角度范围

      percentage = 4.6 - percentage;

      const startAngle = Math.PI - 0.75; // 起始角度，从圆的左侧中间位置开始

      const endAngle = startAngle + 0 * 2 * Math.PI - 1.68 - percentage; // 结束角度

      context.beginPath();
      context.arc(x, y, r, startAngle, endAngle);
      context.lineWidth = 15;
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
