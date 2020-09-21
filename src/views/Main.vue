<template>
  <div class="main">
    <component :is="currentComponent"></component>
    <tool-bar @onChangeFragment ="onChangeFragment" ></tool-bar>
  </div>
</template>

<script>
import toolBar from '@c/currency/ToolBar.vue'

export default {
  name: 'imooc',
  components: {
    'tool-bar':toolBar,
    'home': () => import('@c/Home'),
    'shopping': () => import('@c/Shopping'),
    'my': () => import('@c/My'),
  },
  data(){
    return{
      currentComponent:'home'
    }
  },
  methods:{
    onChangeFragment(componentName){
      this.currentComponent = componentName
    }
  }
}
</script>

<style lang="scss" scoped>
  .main{
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
