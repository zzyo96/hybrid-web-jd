<template>
  <swiper :options="swiperOptions">
    <swiper-slide v-for="(item, index) in swiperImgs" :key="index">
      <img class="swiper-slide-img" :style="{height: height}" :src="item" alt="" srcset="">
    </swiper-slide>

    <template v-slot:pagination>
      <div class="swiper-pagination">

      </div>
    </template>
  </swiper>
</template>

<script>
  import 'swiper/swiper-bundle.css'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'

  export default {
    props:{
      height:{
        type:String,
        default:'auto'
      },
      swiperImgs:{
        type:Array,
        required:true,
        default:function(){
          return []
        }
      },
      /**
       * 1、圆点切换
       * 2、数字
       */
      paginationType: {
        type: String,
        default: '1'
      }
    },
    components:{
      swiper,
      swiperSlide
    },
    data(){
      return {
        swiperOptions:{
          autoplay: true,
          autoHeight: true,
          pagination: {
            // 分页器对应的 html 元素
            el: '.swiper-pagination',
            // 分页器的样式
            type: 'bullets',
            // 分页器内的元素，添加类名
            bulletClass: 'custom-bullet-class'
          }
        }
      }
    },
    methods: {
      /**
       * 根据分页器类型配置对应的分页器
       */
      initPaginnationLayout: function () {
        switch(this.paginationType) {
          // 圆点分页器
          case '1':
            this.swiperOptions.pagination = {
              // 分页器对应的 html 元素
              el: '.swiper-pagination',
              // 分页器的样式
              type: 'bullets',
              // 分页器内的元素，添加类名
              bulletClass: 'custom-bullet-class'
            }
            break;
          // 数字分页器
          case '2':
            this.swiperOptions.pagination = {
              el: '.swiper-pagination',
              // 分页器样式(数字)
              type: 'fraction'
            }
            break;
        }
      }
    },
    created: function () {
      this.initPaginnationLayout();
    }
  }
</script>

<style lang="scss">
  @import '@css/style.scss';
  // 图片的宽度
  .swiper-slide-img {
    width: 100%;
  }

  // 圆点分页器
  .swiper-pagination {
    bottom: px2rem(12);
    .custom-bullet-class {
      box-sizing: border-box;
      border-radius: 100%;
      height: px2rem(6);
      width: px2rem(6);
      border: px2rem(1) solid #fff;
      margin: 0 px2rem(4);
      display: inline-block;
      opacity: 1;
    }
    .swiper-pagination-bullet-active {
      background: white;
    }
  }

  // 数字分页器
  .swiper-pagination-fraction {
    left: auto;
    right: 0;
    width: auto;
    font-size: $infoSize;
    background-color: rgba(0, 0, 0, 0.3);
    padding: px2rem(6) px2rem(18);
    border-top-left-radius: px2rem(16);
    border-bottom-left-radius: px2rem(16);
    bottom: px2rem(32);
    color: white;

    .swiper-pagination-current {
      font-size: $titleSize;
      font-weight: bold;
    }
  }

</style>
