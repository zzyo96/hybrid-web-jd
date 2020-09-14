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
    </div>
  </div>
</template>

<script>
  import MySwiper from '@c/swiper/MySwiper.vue';
  import {axios} from '@js/axios.config.js'
  import Activity from '@c/currency/Activity.vue'

  export default {
    components: {
      MySwiper,
      Activity
    },
    data() {
      return {
        swiperImgs: [],
        swiperHeight: '184px',
        activityDatas:[]
      }
    },
    methods: {
      initData: function () {
        axios.get('/swiper.json')
          .then(data => {
            this.swiperImgs = data.list;
          }).catch(err => {
          console.log(err);
        });

        axios.get('/activitys.json')
          .then(data => {
            this.activityDatas = data.list;
          }).catch(err => {
          console.log(err);
        });
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
    }
  }
</style>
