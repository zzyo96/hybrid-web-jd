<template>
  <div class="main">
    <component :is="currentComponent"></component>
    <tool-bar ref="toolBar" @onChangeFragment ="onChangeFragment" ></tool-bar>
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
  activated: function () {
    // 在 keepAlive 被激活的时候，调用指定加载页面组件的方法
    this.pushFragment();
  },
  methods:{
    onChangeFragment(componentName){
      this.currentComponent = componentName
    },
    /**
     * 指定加载的页面组件
     */
    pushFragment: function () {
      // 获取到组件加载的下标
      let componentIndex = this.$route.params.componentIndex;
      // 如果没有下标的话，直接让方法 return 掉。
      if (componentIndex === undefined) return;
      // 通过 toolbar 来切换对应的组件
      this.$refs.toolBar.pushFragment(componentIndex);
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
