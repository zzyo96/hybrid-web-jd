<template>
  <div class="home">
    <my-swiper :swiperImgs="swiperImgs.map(item => item.icon)" :height="swiperHeight"></my-swiper>
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
        swiperImgs: [],
        swiperHeight:'184px',
      }
    },
    methods:{
      initData: function () {
        this.$http.get('/swiper')
          .then(data => {
            this.swiperData = data.list;
          }).catch(err => {
          console.log(err);
        });
      }
    },
    created() {
      this.initData()
    }
  }

</script>

<style lang="scss" scoped>
  .home{
    width: 100%;
    height: 100%;
    &-content{
      height: 100%;
    }
  }
</style>
