<template>
    <div class="my">
        <navigation-bar :pageName="'个人中心'"  :isShowBack="false"></navigation-bar>

        <div class="my-content">
            
            <!-- 头部区域 -->
            <div class="my-content-header" @click="onLoginClick">
                <img class="my-content-header-avater" src="@img/avater.png" alt="">
                <p class="my-content-header-login">
                    {{$store.state.username ? $store.state.username : '登录/注册'}}
                </p>
            </div>

            <!-- 工具栏区域 -->
            <div class="my-content-tools">
                <div class="my-content-tools-item" v-for="(item, index) in toolsData" :key="index">
                    <p class="my-content-tools-item-name">{{item}}</p>
                    <img class="my-content-tools-item-arrow" src="@img/right-arrow.svg" alt="">
                </div>
            </div>

            <!-- 存在登录用户，展示退出登录按钮 -->
            <div class="my-content-logout page-commit"
             v-if="$store.state.username" @click="onLogoutClick">
                退出登录
            </div>
        </div>

    </div>    
</template>

<script>
import NavigationBar from '@c/currency/NavigationBar.vue';
export default {
    components: {
        NavigationBar
    },
    data: function () {
        return {
            // 工具栏数据
            toolsData: [
                '全部订单',
                '我的预约',
                '应用推荐',
                '用户福利'
            ]
        }
    },
    methods: {
        onLoginClick: function () {
            this.$router.push({
                name: 'login',
                params: {
                    routerType: 'push'
                }
            });
        },
        /**
         * 退出登录按钮点击事件
         */
        onLogoutClick: function () {
            // 判断当前的项目是运行在 Android 设备还是 IOS 设备中
            if (window.androidJSBridge) {
                // window 下存在 android 注入的对象（androidJSBridge），则表示当前项目在 android 设备中运行
                this.onLogoutToAndroid();
            } else if (window.webkit) {
                // window 下存在 webkit ，表示当前项目在 IOS 设备中运行
                this.onLogoutToIOS();
            }
        },
        /**
         * 调用 android 退出登录的方法
         */
        onLogoutToAndroid: function () {
            // 调用 android 退出登录接口
            let result =  window.androidJSBridge.logout();
            // 对 退出登录 返回值处理
            this.onLogoutCallback(result);
        },
        /**
         * 调用 IOS 退出登录的方法
         */
        onLogoutToIOS: function () {
            // 指定 IOS 的回调方法
            window.logoutCallback = this.onLogoutCallback;
            // 调用 IOS 退出登录接口
            window.webkit.messageHandlers.logout.postMessage({});
        },
        /**
         * 处理退出登录的返回值
         */
        onLogoutCallback: function (result) {
            if (result) {
                this.$store.commit('clearUsername');
                alert('退出登录成功');
            } else {
                alert('操作失败，请重试');
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    @import '@css/style.scss';

    .my {
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: column;
        background-color: $bgColor;

        &-content {
            height: 100%;
            width: 100%;

            // 头部区域
            &-header {
                margin-top: $marginSize;
                background-color: white;
                height: px2rem(68);
                display: flex;
                align-items: center;
                border-top: px2rem(1) solid $lineColor;
                border-bottom: px2rem(1) solid $lineColor;
                padding: $marginSize;

                &-avater {
                    width: px2rem(52);
                    height: px2rem(52);
                }

                &-login {
                    margin-left: $marginSize;
                    font-size: $titleSize;
                }
            }

            // 工具栏
            &-tools {
                &-item {
                    display: flex;
                    height: px2rem(46);
                    box-sizing: border-box;
                    align-items: center;
                    padding: $marginSize;
                    background-color: white;
                    border-bottom: px2rem(1) solid $lineColor;

                    &-name {
                        font-size: $infoSize;
                        flex-grow: 1;
                    }

                    &-arrow {
                        width: px2rem(16);
                    }
                }
            }

            // 退出登录按钮
            &-logout {
                margin-top: 20%;
            }
        }
    }

</style>
