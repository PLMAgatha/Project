<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}"
       :style="{ backgroundColor: sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground }">
    <transition name="sidebarLogoFade" style="position: relative">
      <div>
        <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
          <img v-if="logo" :src="logo" class="sidebar-logo"/>
          <h1 v-else class="sidebar-title"
              :style="{ color: sideTheme === 'theme-dark' ? variables.logoTitleColor : variables.logoLightTitleColor }">
            {{ title }} </h1>
        </router-link>
        <router-link key="expand" class="sidebar-logo-link" to="/">
          <h1 class="sidebar-title left-text"
              :style="{ color: sideTheme === 'theme-dark' ? variables.logoTitleColor : variables.logoLightTitleColor }">
            xFactory - </h1>
          <img v-if="logo" :src="logo" class="sidebar-logo2"/>
          <h1 class="sidebar-title"
              :style="{ color: sideTheme === 'theme-dark' ? variables.logoTitleColor : variables.logoLightTitleColor }">
            {{ title }} </h1>
        </router-link>
        <div class="line"></div>
      </div>
    </transition>
  </div>
</template>

<script>
import logoImg from '@/assets/images/flex-logo.png'
import variables from '@/assets/styles/variables.scss'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    variables() {
      return variables;
    },
    sideTheme() {
      return this.$store.state.settings.sideTheme
    }
  },
  data() {
    return {
      title: '智慧工厂',
      logo: logoImg
    }
  }
}
</script>

<style lang="scss" scoped>
.left-text {
  font-size: 18px !important;
  font-family: 华文隶书 !important;
}

.sidebar-logo2 {
  width: 44px;
  vertical-align: middle;
}

.line {
  width: 89%;
  height: 1px;
  background-color: #EEEEEE;
  position: absolute;
  top: 68px;
  left: 12px;
}

.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  //height: 58px;
  height: 70px;
  line-height: 70px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;
  border-bottom-right-radius: 18px;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      //width: 32px;
      //height: 32px;
      max-width: 100%;
      height: auto;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      font-weight: 600;
      line-height: 50px;
      font-size: 15px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      color: #009add !important;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
