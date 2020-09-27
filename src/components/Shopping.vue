<template>
    <!-- 
        业务逻辑：
            1、在商品详情中点击加入购物车，系统会通过 alert 弹出“添加成功”的提示，然后页面会跳转到购物车页面。
            2、跳转到购物车页面之后，购物车会展示我们添加的商品。此时在默认状态下，商品处于未选中状态，商品数量为 1.
            3、可以在购物车中，通过 +、- 按钮来增加或减少该商品的购买数量，当商品数量为 1 的时候，不可减少。
            4、加入购物车时，如果该商品已经存在于购物车中，那么购物车中的该商品数量自动 + 1.
            5、购物车中会展示已选的商品总价格和已选商品的总数量，当选中商品或选中商品的数量发生变化的时候，展示的总价格和总数量也会发生对应的变化。

     -->

     <!-- 
         从商品详情中进入购物车页面：
            1、首先进入到  main.vue.
            2、通过 main.vue 调转到 购物车 （可以通过传递自定义标记的方式）。
            问题：
                当我们从商品详情进入到购物车之后，在返回到商品详情页面，我们会发现无论我们点击哪个商品，他都会进入到我们最初进入的商品详情页面。
            原因：
                虚拟任务栈缓存了商品详情页面。
            解决方案：
                在跳转到 main 之后，通过自定义指令，来初始化虚拟任务栈。
      -->
    <div class="shopping">
        <navigation-bar :pageName="'购物车'" :isShowBack="false"></navigation-bar>

        <div class="shopping-content">
            <div class="shopping-content-list">
                <!-- 商品 -->
                <div class="shopping-content-list-item" v-for="(item, index) in shoppingDatas" :key="index">
                    <!-- check -->
                    <img class="shopping-content-list-item-check" :src="checkImg(item.isCheck)" @click="onGoodsCheckClick(item)" alt="">
                    <!-- 图片 -->
                    <img class="shopping-content-list-item-img" :src="item.img" alt="">

                    <!-- 描述 -->
                    <div class="shopping-content-list-item-desc">
                        <!-- 名称 -->
                        <p class="shopping-content-list-item-desc-name text-line-2">
                            <span>123----{{item.number}}</span>
                            <!-- 直营 -->
                            <direct v-if="item.isDirect"></direct>
                            {{item.name}}
                        </p>

                        <div class="shopping-content-list-item-desc-data">
                            <!-- 价格 -->
                            <p class="shopping-content-list-item-desc-data-price">￥{{item.price | priceValue}}</p>
                            <!-- 商品数量的控制组件 -->
                            <number-manager :defaultNumber="item.number" @onChangeNumber="onNumberChange(arguments, item, index)"></number-manager>
                        </div>
                    </div>
                </div>

               
            </div>

             <!-- 统计 -->
            <div class="shopping-content-total">
                <!-- 全选的 check -->
                <div class="shopping-content-total-check">
                    <img :src="checkImg(totalData.isAll)" alt="" @click="onAllCheckClick">
                    <p>全选</p>
                </div>

                <!-- 总价格 -->
                <div class="shopping-content-total-price">
                    <p class="shopping-content-total-price-total">合计：<span>￥{{totalData.totalPrice | priceValue}}</span></p>
                    <p class="shopping-content-total-price-all">总额：
                        <span>￥{{totalData.totalPrice | priceValue}}</span>
                        &nbsp;&nbsp;
                        立减<span>￥0.00</span>
                    </p>
                </div>

                <!-- 结算 -->
                <div class="shopping-content-total-commit">
                    去结算({{totalData.goodsNumber}})
                </div>
            </div>

        </div>

    </div>    
</template>

<script>
import NavigationBar from '@c/currency/NavigationBar.vue';
import Direct from '@c/goods/Direct.vue';
import NumberManager from '@c/goods/NumberManager.vue';
export default {
    components: {
        NavigationBar,
        Direct,
        NumberManager
    },
    data: function () {
        return {
            // 购物车商品
            shoppingDatas: this.$store.state.shoppingDatas,
            // 总计
            totalData: {
                // 是否全选
                isAll: false,
                // 总价格
                totalPrice: 0,
                // 总数量
                goodsNumber: 0
            }
        }
    },
    methods: {
        /**
         * @param $arguments JS 中提供的类数组对象。如果想要获取到传递的第一个参数，那么就拿 $arguments 0 下标的数据就可以
         */
        // onNumberChange: function ($arguments, item, index) {
        onNumberChange: function ($arguments, item) {
            // 最新商品数量
            // let number = $arguments[0];

            // 修改对应的商品数量
            // this.$store.commit('changeShoppingDataNumber', {
            //     index: index,
            //     number: number
            // });

            // 在商品数量发生变化时，并且 该商品处于选中状态下
            if (item.isCheck) {
                this.computeGoodsTotal();
            }
        },
        /**
         * 商品 check 按钮点击事件
         */
        onGoodsCheckClick: function (item) {
            item.isCheck = !item.isCheck;
            // 统计数据
            this.computeGoodsTotal();
        },
        /**
         * 全选 check 点击事件
         */
        onAllCheckClick: function () {
            this.totalData.isAll = !this.totalData.isAll;

            // 为每个商品设置选中标记 为当前是否全选标记
            this.shoppingDatas.forEach(item => item.isCheck = this.totalData.isAll);

            // 统计数据
            this.computeGoodsTotal();
        },
        /**
         * check 按钮图标
         */
        checkImg: function (isCheck) {
            return isCheck ? require('@img/check.svg') : require('@img/no-check.svg');
        },
        /**
         * 计算总计数据
         */
        computeGoodsTotal: function () {
            // 先去初始化 totalData 的数据,让是否全选默认为 true，当存在商品没有被选中的时候，则把 isAll 变为 false。
            this.totalData = {
                // 是否全选
                isAll: true,
                // 总价格
                totalPrice: 0,
                // 总数量
                goodsNumber: 0
            }

            // 计算总计数据。
            /**
             * 遍历数据源，如果有商品处于未选中状态下，那么则把 isAll 变为 false。
             * 如果商品处于选中状态下，则计算该商品总价格和数量
             */
            this.shoppingDatas.forEach(item => {
                // 如果商品处于选中状态下，则计算该商品总价格和数量
                if (item.isCheck) {
                    this.totalData.totalPrice += parseFloat(item.price) * parseInt(item.number);
                    this.totalData.goodsNumber += parseInt(item.number);
                } 
                // 如果有商品处于未选中状态下，那么则把 isAll 变为 false
                else {
                     this.totalData.isAll = false;
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>

    @import '@css/style.scss';

    .shopping {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-flow: column;

        &-content {
            background-color: $bgColor;
            border-top: px2rem(1) solid $lineColor;
            height: 100%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;

            // 商品列表
            &-list {
                height: 100%;
                overflow: hidden;
                overflow-y: auto;

                &-item {
                    background-color: white;
                    padding: $marginSize;
                    display: flex;
                    border-bottom: px2rem(1) solid $lineColor;

                    &-check {
                        width: $checkSize;
                        align-self: center;
                        padding: px2rem(6);
                    }

                    &-img {
                        width: $listGoodsImgSize;
                        height: $listGoodsImgSize;
                    }

                    &-desc {
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        padding: 0 $marginSize;

                        &-name {
                            font-size: $infoSize;
                            line-height: px2rem(18);
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
                        }
                    }
                }
            }

            // 总计
            &-total {
                height: px2rem(56);
                box-sizing: border-box;
                display: flex;
                align-items: center;
                background-color: white;
                border-top: px2rem(1) solid $lineColor;

                &-check {
                    display: flex;
                    align-items: center;
                    margin: 0 $marginSize;

                    img {
                        width: $checkSize;
                        height: $checkSize;
                        padding: px2rem(6);
                    }

                    p {
                        font-size: $infoSize;
                    }
                }

                &-price {
                    flex-grow: 2;
                    display: flex;
                    flex-direction: column;

                    &-total {
                        font-size: $titleSize;
                        margin-bottom: px2rem(6);

                        span {
                            font-weight: bold;
                        }
                    }

                    &-all {
                        font-size: $minInfoSize;
                        span {
                            font-weight: bold;
                        }
                    }
                }

                &-commit {
                    width: px2rem(120);
                    height: 100%;
                    font-size: $titleSize;
                    background-color: $mainColor;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
    }

</style>
