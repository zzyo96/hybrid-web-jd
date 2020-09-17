<template>
  <div class="home">
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
    </div>
  </div>
</template>

<script>
  import MySwiper from '@c/swiper/MySwiper.vue';
  import {axios} from '@js/axios.config.js'
  import Activity from '@c/currency/Activity.vue'
  import Seconds from '@c/seconds/Seconds.vue'
  import ModeOptions from '@c/currency/ModeOptions.vue'

  export default {
    components: {
      MySwiper,
      Activity,
      ModeOptions,
      Seconds
    },
    data() {
      return {
        swiperImgs: [],
        swiperHeight: '184px',
        activityDatas:[],
        secondsDatas:[]
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
      }
    },
    mounted() {
      this.initData()
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
