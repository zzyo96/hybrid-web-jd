<template>
  <div class="home">
    <my-swiper :swiperImgs="swiperData.map(item => item.icon)" :height="swiperHeight"></my-swiper>
  </div>
</template>

<script>
  import MySwiper from '@c/swiper/MySwiper.vue';

  export default {
    components:{
      MySwiper
    },
    data(){
      return{
        swiperData: [],
        swiperHeight:'',
      }
    }
  }

</script>

<style lang="scss" scoped>
  .home{
    width: 100%;
    height: 100%;
    font-size: 32px;
  }
</style>
