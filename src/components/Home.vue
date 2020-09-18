<template>
  <div class="home" @scroll="onScrollChange" ref="home">
    <navigation-bar :isShowBack="false" :navBarStyle="navBarStyle">
      <!-- 左侧插槽 -->
      <template v-slot:nav-left>
        <img :src="navBarCurrentSlotStyle.leftIcon" alt="">
      </template>
      <!-- 中间插槽 -->
      <template v-slot:nav-center>
        <search :bgColor="navBarCurrentSlotStyle.search.bgColor"
                :hintColor="navBarCurrentSlotStyle.search.hintColor"
                :icon="navBarCurrentSlotStyle.search.icon">
        </search>
      </template>
      <!-- 右侧插槽 -->
      <template v-slot:nav-right>
        <img :src="navBarCurrentSlotStyle.rightIcon" alt="">
      </template>
    </navigation-bar>
    <div class="home-content">
      <my-swiper :swiperImgs="swiperImgs.map(item => item.icon)" :height="swiperHeight"></my-swiper>
      <!--520 活动-->
      <activity>
        <div class="activity-520">
          <img v-for="(item,index) in activityDatas" :key="index" :src="item.icon" alt="">
        </div>
      </activity>
      <!--功能选项-->
      <mode-options></mode-options>
      <!--秒杀模块-->
      <seconds :dataSource = secondsDatas></seconds>
      <!--拼购节-->
      <activity>
        <div class="activity-pin-gou-jie">
          <img src="@img/pinGouJie.gif" />
        </div>
      </activity>
      <!--商品列表-->
      <goods></goods>
    </div>
  </div>
</template>

<script>
  import MySwiper from '@c/swiper/MySwiper.vue';
  import {axios} from '@js/axios.config.js'
  import Activity from '@c/currency/Activity.vue'
  import Seconds from '@c/seconds/Seconds.vue'
  import ModeOptions from '@c/currency/ModeOptions.vue'
  import Goods from '@c/goods/Goods.vue';
  import NavigationBar from '@c/currency/NavigationBar.vue';
  import Search from '@c/currency/Search.vue';

  export default {
    components: {
      MySwiper,
      Activity,
      ModeOptions,
      Seconds,
      Goods,
      NavigationBar,
      Search
    },
    data() {
      return {
        swiperImgs: [],
        swiperHeight: '184px',
        activityDatas:[],
        secondsDatas:[],
        navBarStyle: {
          position: 'fixed',
          backgroundColor: ''
        },
        navBarSlotStyle: {
          // 默认样式
          normal: {
            // 左侧插槽
            leftIcon: require('@img/more-white.svg'),
            // 中间插槽
            search: {
              bgColor: '#ffffff',
              hintColor: '#999999',
              icon: require('@img/search.svg')
            },
            // 右侧插槽
            rightIcon: require('@img/message-white.svg')
          },
          // 高亮样式
          highlight: {
            // 左侧插槽
            leftIcon: require('@img/more.svg'),
            // 中间插槽
            search: {
              bgColor: '#d7d7d7',
              hintColor: '#ffffff',
              icon: require('@img/search-white.svg')
            },
            // 右侧插槽
            rightIcon: require('@img/message.svg')
          },
        },
        navBarCurrentSlotStyle:{},
        // 记录页面滚动值
        scrollTopValue: -1,
        // 锚点值
        ANCHOR_SCROLL_TOP: 160
      }
    },
    methods: {
      initData: function () {
        Promise.all([
          axios.get('/swiper.json'),
          axios.get('/activitys.json'),
          axios.get('/seconds.json')
        ]).then((datas)=>{
          this.swiperImgs = datas[0].list;
          this.activityDatas = datas[1].list;
          this.secondsDatas = datas[2].list;
        })
      },
      /**
       * 监听页面滚动
       * 1、获取到当前页面滚动的距离
       * 2、计算 navBar 背景颜色（navBar 背景透明度）
       *      当前滚动的距离 / 锚点值 = navBar 背景透明度  opacity
       * 3、opacity >= 1 ， 当前滚动的距离 已经等于或者超过了 锚点值，当前 navBar 插槽的样式变为 高亮状态的样式。
       *  否则的话 opacity < 1 ,当前 navBar 插槽的样式，为 默认状态的样式
       */
      onScrollChange: function ($event) {
        // 获取到当前页面滚动的距离
        this.scrollTopValue = $event.target.scrollTop;
        // 计算 navBar 背景颜色（navBar 背景透明度）
        let opacity = this.scrollTopValue / this.ANCHOR_SCROLL_TOP;
        // 指定 narBar 插槽样式
        if (opacity >= 1) {
          this.navBarCurrentSlotStyle = this.navBarSlotStyle.highlight;
        } else {
          this.navBarCurrentSlotStyle = this.navBarSlotStyle.normal;
        }

        // 根据透明比例来设置 navBar 的背景颜色
        this.navBarStyle.backgroundColor = 'rgba(255, 255, 255, ' + opacity + ')'
      }
    },
    created() {
      this.navBarCurrentSlotStyle = this.navBarSlotStyle.normal;
      this.initData();
    }
  }

</script>

<style lang="scss" scoped>
@import '@css/style.scss';
  .home {
    width: 100%;
    height: 100%;
    background-color: $bgColor;
    overflow: auto;

    &-content {
      height: 100%;

      .activity-520{
        margin-top: px2rem(-8);
        border-top-left-radius: px2rem(8);
        border-top-right-radius: px2rem(8);

        img{
          width: 33.3%;
        }
      }

      .activity-pin-gou-jie {
        background-color: white;
        margin-top: $marginSize;

        img{
          width: 100%;
        }
      }
    }
  }
</style>
