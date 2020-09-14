<template>
  <div class="home">
    <my-swiper :swiperImgs="swiperImgs.map(item => item.icon)" :height="swiperHeight"></my-swiper>
  </div>
</template>

<script>
  import MySwiper from '@c/swiper/MySwiper.vue';
  import {axios} from '@js/axios.config.js'

  export default {
    components: {
      MySwiper
    },
    data() {
      return {
        swiperImgs: [],
        swiperHeight: '184px'
      }
    },
    methods: {
      initData: function () {
        // console.log(this.$http,100)
        axios.get('/swiper.json')
          .then(data => {
            console.log(data,1233)
            this.swiperImgs = data.list;
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
  .home {
    width: 100%;
    height: 100%;

    &-content {
      height: 100%;
    }
  }
</style>
