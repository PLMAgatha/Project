<template>
  <div>
    <svg-icon icon-class="github" @click="goto"/>
  </div>
</template>

<script>
export default {
  name: 'EtagGit',
  data() {
    return {
      url: 'https://github.com/YunaiV/ruoyi-vue-pro'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
