<template>
  <!--
      如何在同一个组件中去展示不同的样式：
      1、html 表示整个布局的结构，具体的展示样式，将有 css 决定。
      2、每种展示样式对应不同的 css，也就是对应不同的类名（css）
          1、垂直列表 -> goods-list
          2、网格布局 -> goods-grid
          3、瀑布流布局 -> goods-waterfall
      3、实现不同的展示形式，本质上就是实现不同的 css 样式。

      瀑布流的布局：
      1、创建商品列表的基本html 和 css ， 让 item 相对于 goods（div）进行排列(相对布局)
      2、生成不同高度的图片，撑起不同高度的 item。
      3、计算 item 的位置，来达到 从上到下，从左到右依次排列的目的
   -->

  <!--
      如果不允许 goods 单独滑动，那么就不添加 goods-scroll 类
   -->

  <!--
      商品排序：
          1、排序之后的数据源，用来在 html 中进行展示（替换掉 dataSource）。
          2、定义排序规则。（可以直接使用 GoodsOptions 中数据源的 id）
          3、定义排序的方法，根据 排序规则来修改对应的排序。
   -->

  <div class="goods" :class="[layoutClass, {'goods-scroll' : isScroll}]"
       :style="{height: goodsViewHeight}"
       ref="goods" @scroll="onScrollChange">
    <div class="goods-item" :class="layoutItemClass" ref="goodsItem" @click="onItemClick(item)"
         v-for="(item, index) in sortGoodsData" :key="index" :style="goodsItemStyles[index]">
      <!-- 图片 -->
      <img class="goods-item-img" :src="item.img" alt="" :style="imgStyles[index]">
      <!-- desc -> description (描述) -->
      <div class="goods-item-desc">
        <p class="goods-item-desc-name text-line-2" :class="{'goods-item-desc-name-hint' : !item.isHave}">
          <!-- 是否为直营 -->
          <direct v-if="item.isDirect"></direct>
          <!-- 是否有库存 -->
          <no-have v-if="!item.isHave"></no-have>
          {{item.name}}
        </p>
        <div class="goods-item-desc-data">
          <p class="goods-item-desc-data-price">￥{{item.price | priceValue}}</p>
          <p class="goods-item-desc-data-volume">销量：{{item.volume}}</p>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import Direct from '@c/goods/Direct.vue';
  import NoHave from '@c/goods/NoHave.vue';
  import {axios} from '@js/axios.config.js'
  export default {
    components: {
      Direct,
      NoHave
    },
    props: {
      /**
       * 在父元素中指定的展示形式
       * 1：垂直列表
       * 2：网格布局
       * 3：瀑布流布局
       */
      layoutType: {
        type: String,
        default: '3'
      },
      /**
       * 是否允许 goods 单独滑动
       * 默认允许 goods 单独滑动
       */
      isScroll: {
        type: Boolean,
        default: true
      },
      /**
       * 排序规则(依赖 GoodsOptions 数据源的id)
       * 1：默认
       * 1-2：价格由高到低
       * 1-3：销量由高到低
       * 2：有货优先
       * 3：直营优先
       */
      sort: {
        type: String,
        default: '1'
      }
    },
    data: function () {
      return {
        // 数据源
        dataSource: [],
        // 排序数据
        sortGoodsData: [],
        // 最大高度
        MAX_IMG_HEIGHT: 230,
        // 最小高度
        MIN_IMG_HEIGHT: 178,
        // 图片样式集合
        imgStyles: [],
        // item margin
        ITEM_MARGIN_SIZE: 8,
        // item 样式集合
        goodsItemStyles: [],
        // goods 组件的高度
        goodsViewHeight: "100%",
        // 不同展示形式下的类名
        // 1、垂直列表的展示形式（默认） -> goods-list & goods-list-item.
        // 2、网格布局的展示形式 -> goods-grid & goods-grid-item
        layoutClass: 'goods-list',
        layoutItemClass: 'goods-list-item',
        // 滑动距离
        scrollTopValue: 0
      }
    },
    created: function () {
      this.initData();
    },
    activated: function () {
      /**
       * 定位页面滑动位置
       */
      this.$refs.goods.scrollTop = this.scrollTopValue;
    },
    methods: {
      /**
       * 获取数据
       */
      initData: function () {
        axios.get('/goods.json')
          .then(data => {
            this.dataSource = data.list;
            // 数据排序
            this.setSortGoodsData();
            // 设置布局
            this.initLayout();
          });
      },
      /**
       * 商品排序
       */
      setSortGoodsData: function () {
        switch (this.sort) {
          // 默认
          case '1':
            // 深拷贝，不改变原数组
            this.sortGoodsData = this.dataSource.slice(0);
            break;
          // 价格由高到低
          case '1-2':
            this.getSortGoodsDataFromKey('price');
            break;
          // 销量由高到低
          case '1-3':
            this.getSortGoodsDataFromKey('volume');
            break;
          // 有货优先
          case '2':
            this.getSortGoodsDataFromKey('isHave');
            break;
          // 直营优先
          case '3':
            this.getSortGoodsDataFromKey('isDirect');
            break;
        }
      },
      /**
       * 根据传入的 key 来进行排序
       */
      getSortGoodsDataFromKey: function (key) {

        /**
         * sort 可以完成数组的数据排序。
         * 当接收的值 为负数的时候，表示 goods1 排列在 goods2 之前。
         * 当接受的值为正数的时候，表示 goods1 排列在 goods2 之后。
         * 接受的值为 0 的时候，表示排序不变。
         */
        this.sortGoodsData.sort((goods1, goods2) => {
          // 根据传入的 key 获取对应的 value
          let v1 = goods1[key],
            v2 = goods2[key];
          // 对 value 进行对比，
          // boolean 类型的值（有货优先和直营优先）
          if (typeof v1 === 'boolean') {
            if (v1) {
              return -1;
            }
            if (v2) {
              return 1;
            }
            return 0;
          }
          // float 类型值的处理（价格、销量）
          if (parseFloat(v1) >= parseFloat(v2)) {
            return -1;
          }
          return 1;
        });

      },
      /**
       * 设置布局，为不同的 layoutType 设定不同的展示形式
       * 1、初始化影响到布局的数据
       *      1、goodsViewHeight -> 垂直布局、网格布局（100%） 、瀑布流 (实际高度)
       *      2、goodsItemStyles
       *      3、imgStyles
       * 2、为不同的 layoutType 设置不同的展示类
       */
      initLayout: function () {
        // 初始化数据
        this.goodsViewHeight = '100%';
        this.goodsItemStyles = [];
        this.imgStyles = [];
        // 为不同的 layoutType 设置不同的展示类
        switch(this.layoutType) {
          // 垂直列表
          case '1':
            this.layoutClass = 'goods-list';
            this.layoutItemClass = 'goods-list-item';
            break;
          // 网格布局
          case '2':
            this.layoutClass = 'goods-grid';
            this.layoutItemClass = 'goods-grid-item';
            break;
          // 瀑布流布局
          case '3':
            this.layoutClass = 'goods-waterfall';
            this.layoutItemClass = 'goods-waterfall-item';
            this.initImgStyles();
            // 调用创建瀑布流的方法(等到 dom 创建完成之后)
            this.$nextTick(() => {
              this.initWaterfall();
            })
            break;
        }
      },
      /**
       * 返回随机的图片高度
       */
      imgHeight: function () {
        // Math.random() -> 0 - 1 随机数 * (高度区间) + 最低的图片高度
        let result = Math.floor(Math.random() * (this.MAX_IMG_HEIGHT - this.MIN_IMG_HEIGHT) + this.MIN_IMG_HEIGHT);
        return result;
      },
      /**
       * 根据随机的图片高度，生成对应的图片样式数据
       */
      initImgStyles: function () {
        this.dataSource.forEach(()=> {
          // 随机生成的图片高度
          let imgHeight = this.imgHeight() + 'px';
          // push 图片高度，到 img 样式集合
          this.imgStyles.push({
            height: imgHeight
          })
        });
      },
      /**
       * 瀑布流布局
       * 1、获取到所有的 item 元素
       * 2、遍历 item 元素，得到每一个 item 的高度，加上一个 margin 的高度
       * 3、创建两个变量：leftHeightTotal，rightHeightTotal 分别表示左右两侧目前距离顶部的高度。
       *  通过对于左右两侧距离顶部的高度，来确定 item  的放置位置。
       *      如果左侧小于等于右侧高度的话（leftHeightTotal <= rightHeightTotal）,那么 item 就应该放置到左侧。此时 item 距离左侧为0，距离顶部为当前的 leftHeightTotal。
       *      否则 ，item 放置到右侧，此时 item 距离右侧为 0， 距离顶部为当前的 rightHeightTotal。
       * 4、保存计算出的 item 的所有样式，配置到 item 上。
       * 5、item 配置完成之后，对比左右两侧最大的高度，最大的高度为 goods 组件的高度
       */
      initWaterfall: function () {
        // 获取到所有的 item 元素
        let $goodsItems = this.$refs.goodsItem;
        if (!$goodsItems) return;
        // 左右两侧距离顶部的高度
        let leftHeightTotal = 0, rightHeightTotal = 0;
        $goodsItems.forEach(($el) => {
          // item 样式
          let goodsItemStyle = {};
          // 遍历 item 元素，得到每一个 item 的高度，加上一个 margin 的高度
          let elHeight = $el.clientHeight + this.ITEM_MARGIN_SIZE;
          // 对比 左右两侧距离顶部的高度
          if (leftHeightTotal <= rightHeightTotal) {
            // item 就应该放置到左侧。此时 item 距离左侧为0，距离顶部为当前的 leftHeightTotal
            goodsItemStyle = {
              left: '0px',
              top: leftHeightTotal + 'px'
            };
            // 更新左侧距离顶部的高度
            leftHeightTotal += elHeight;
          } else {
            // item 距离右侧为 0， 距离顶部为当前的 rightHeightTotal。
            goodsItemStyle = {
              right: '0px',
              top: rightHeightTotal + 'px'
            };
            // 更新右侧距离顶部的高度
            rightHeightTotal += elHeight;
          }

          // 保存计算出的 item 的所有样式，配置到 item 上。
          this.goodsItemStyles.push(goodsItemStyle);
        });

        // 在不允许 Goods 单独滑动的时候
        if (!this.isScroll) {
          // 对比左右两侧最大的高度，最大的高度为 goods 组件的高度
          this.goodsViewHeight = (leftHeightTotal > rightHeightTotal ? leftHeightTotal : rightHeightTotal) + 'px';
        }

      },
      /**
       商品点击事件
       */
      onItemClick: function (item) {
        //  商品无库存不允许跳转
        if (!item.isHave) {
          alert('该商品无库存');
          return;
        }
        this.$router.push({
          name: 'goodsDetail',
          params: {
            routerType: 'push',
          },
          // 把传递的数据附加到我们的 URL 上
          query: {
            goodsId: item.id,
            item:item
          }
        });
      },
      /**
       * 监听滑动事件
       */
      onScrollChange: function ($event) {
        this.scrollTopValue = $event.target.scrollTop;
      }
    },
    watch: {
      /**
       * 监听 layoutType
       */
      layoutType: function () {
        this.initLayout();
      },
      /**
       * 监听 sort 的改变
       */
      sort: function () {
        this.setSortGoodsData();
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@css/style.scss';

  .goods {
    background-color: $bgColor;

    &-scroll {
      overflow: hidden;
      overflow-y: auto;
    }

    &-item {
      background-color: white;
      padding: $marginSize;
      box-sizing: border-box;

      &-desc {
        width: 100%;

        &-name {
          font-size: $infoSize;
          line-height: px2rem(18);

          &-hint {
            color: $hintColor;
          }
        }

        &-data {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: $marginSize;

          &-price {
            font-size: $titleSize;
            color: $mainColor;
            font-weight: 500;
          }

          &-volume {
            font-size: $infoSize;
            color: $hintColor;
          }
        }
      }
    }
  }

  // 垂直列表
  .goods-list {
    &-item {
      display: flex;
      border-bottom: 1px solid $lineColor;

      .goods-item-img {
        width: px2rem(120);
        height: px2rem(120);
      }

      .goods-item-desc {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: $marginSize;
      }
    }
  }

  // 网格布局
  .goods-grid {
    padding: $marginSize;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    &-item {
      width: 49%;
      border-radius: $radiusSize;
      margin-bottom: $marginSize;

      .goods-item-img {
        width: 100%;
      }
    }
  }

  // 瀑布流
  .goods-waterfall {
    position: relative;
    margin: $marginSize;

    &-item {
      position: absolute;
      width: 49%;
      border-radius: $radiusSize;

      .goods-item-img {
        width: 100%;
      }
    }
  }

</style>

