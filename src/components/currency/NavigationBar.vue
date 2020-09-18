<template>
    <!-- 
        能力：
            1、默认的展示效果 -> 左边后退按钮的图标、中间页面的名称、右边是空白的内容
            2、可通过插槽来配置具体的展示样式 -> 左、中、右 三个插槽，父组件可以通过这三个插槽来制定对应位置的布局。
            3、可以接收从外部指定的一个样式（可以在父组件中指定 navigationBar 的 style）。
     -->
    <div class="nav-bar z-index-max" :style="navBarStyle"
     :class="[{'bottom-line' : pageName}]">
        <!-- 左 -->
        <div class="left" @click="$emit('onLeftClick')">
            <!-- 默认状态 -->
            <img v-if="isShowBack" src="@img/back.svg" alt="">
            <!-- 具名插槽 -->
            <slot name="nav-left"></slot>
        </div>
        <!-- 中 -->
        <div class="center">
            <!-- 默认状态 -->
            <span class="page-title" v-if="pageName">{{pageName}}</span>
            <!-- 具名插槽 -->
            <slot name="nav-center"></slot>
        </div>
        <!-- 右 -->
        <div class="right">
            <!-- 具名插槽 -->
            <slot name="nav-right"></slot>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        /**
         * 页面标题的名称
         */
        pageName: {
            type: String,
            default: ''
        },
        /**
         * 是否展示后退按钮
         */
        isShowBack: {
            type: Boolean,
            default: true
        },
        /**
         * navBar 样式
         */
        navBarStyle: {
            type: Object,
            default: function () {
                return {
                    backgroundColor: 'white'
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@css/style.scss';
    .nav-bar {
        width: 100%;
        height: px2rem(44);
        line-height: px2rem(44);
        display: flex;
        justify-content: space-between;
        // 适配沉浸式手机 statusBar
        padding-top: $statusBarHeight;

        .left, .right {
            display: flex;
            height: 100%;
            width: px2rem(26);
            padding: 0 $marginSize;

            img {
                width: 100%;
                align-self: center;
            }
        }

        .center {
            display: flex;
            height: 100%;
            flex-grow: 1;

            .page-title {
                font-size: $titleSize;
                align-self: center;
                margin: 0 auto;
            }
        }
    }

    .bottom-line {
        border-bottom: 1px solid $lineColor;
    }
</style>

