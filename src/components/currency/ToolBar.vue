<template>
  <div class="tool-bar">
    <div class="tool-bar-item" v-for="(item,index) in toolBarData" :key="index" @click="onChangeFragment(item, index)">
      <img class="tool-bar-item-img" :src="[index === selectIndex? item.hIcon :item.nIcon]" alt="">
      <p class="tool-bar-item-name" :class="{'tool-bar-item-name-h' : index ===selectIndex}">{{item.name}}</p>
    </div>
  </div>
</template>

<script>
  /**
   * ToolBar的功能：
   * 1.永远位于页面的最底部
   * 2.点击toolbar按钮的时候，页面发生对应的切换
   * 3.按钮分为默认和选中两个状态
   * --------
   *
   * 能力和约束
   * 1.不具备的能力（约束
   * 2.通过一个回调，告诉父组件，按钮的点击事件
   * 3.当按钮被选中的时候，应该切换按钮的状态
   */
  export default {
    data() {
      return {
        toolBarData: [
          {
            // 默认状态下的图片
            nIcon: require('@img/home-n.svg'),
            // // 高亮状态下的图片
            hIcon: require('@img/home-h.svg'),
            // // 名称
            name: '首页',
            // 组件名称
            componentName: 'home'
          },
          {
            // 默认状态下的图片
            nIcon: require('@img/shopping-n.svg'),
            // 高亮状态下的图片
            hIcon: require('@img/shopping-h.svg'),
            // 名称
            name: '购物车',
            // 组件名称
            componentName: 'shopping'
          },
          {
            // 默认状态下的图片
            nIcon: require('@img/my-n.svg'),
            // 高亮状态下的图片
            hIcon: require('@img/my-h.svg'),
            // 名称
            name: '我的',
            // 组件名称
            componentName: 'my'
          }
        ],
        selectIndex:0
      }
    },
    methods:{
      onChangeFragment(item,index){
        this.selectIndex = index;
        this.$emit('onChangeFragment',item.componentName)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@css/style.scss';
  .tool-bar{
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: px2rem(46);
    background-color: white;
    box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.2);
    border-top: 1px solid $lineColor;

    &-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: px2rem(4) px2rem(12);
      &-img {
        width: px2rem(22);
        height: px2rem(22);
      }

      &-name {
        font-size: $infoSize;
        margin-top: px2rem(4);

        &-h {
          color: $mainColor;
        }
      }
    }
  }
</style>