<template>
    <div class="goods-list-page">
        <navigation-bar @onLeftClick="onBackClick" :pageName="'商品列表'">
            <template v-slot:nav-right>
                <img :src="layoutType.icon" @click="onChangeLayoutTypeClick()">
            </template>
        </navigation-bar>

        <!--<div class="goods-list-page-content" :class="{'iphonex-bottom' : $store.state.isIphoneX}">-->
        <div class="goods-list-page-content">
            <goods-options @optionsChange="onGoodsOptionsChange"></goods-options>
            <goods :layoutType="layoutType.type" :sort="sortType"></goods>
        </div>
    </div>
</template>

<script>
import NavigationBar from '@c/currency/NavigationBar.vue';
import GoodsOptions from '@c/goods/GoodsOptions.vue';
import Goods from '@c/goods/Goods.vue';
export default {
    name: 'goodsList',
    components: {
        NavigationBar,
        GoodsOptions,
        Goods
    },
    data: function () {
        return {
            // goods 展示形式数据源
            layoutTypeDatas: [
                {
                    // 垂直列表
                    type: '1',
                    icon: require('@img/list-type.svg')
                },
                {
                    // 网格布局
                    type: '2',
                    icon: require('@img/grid-type.svg')
                },
                {
                    // 瀑布流
                    type: '3',
                    icon: require('@img/waterfall-type.svg')
                },
            ],
            // 当前 goods 展示形式
            layoutType: {},
            // goods 排序规则
            sortType: '1'
        }
    },
    created: function () {
        this.layoutType = this.layoutTypeDatas[0];
    },
    methods: {
        /**
            后退按钮点击事件
         */
        onBackClick: function () {
            this.$router.go(-1);
        },
        /**
         * 切换 goods 展示形式
         */
        onChangeLayoutTypeClick: function () {
            if (this.layoutType.type === '1') {
                this.layoutType = this.layoutTypeDatas[1];
            } else if (this.layoutType.type === '2') {
                this.layoutType = this.layoutTypeDatas[2];
            } else {
                this.layoutType = this.layoutTypeDatas[0];
            }
        },
        /**
         * 当筛选项改变时被调用
         */
        onGoodsOptionsChange: function (sortType) {
            this.sortType = sortType;
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '@css/style.scss';

    .goods-list-page {
        position: absolute;
        height: 100%;
        width: 100%;
        background-color: $bgColor;
        display: flex;
        flex-direction: column;

        &-content {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
    }

</style>

