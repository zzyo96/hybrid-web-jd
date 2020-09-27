<template>
    <div class="login-page">

        <navigation-bar :pageName="'登录'" @onLeftClick="onBackClick"></navigation-bar>

        <!-- 内容区 -->
        <div class="login-page-content">
            <!-- 用户名 -->
            <div class="input-container">
                <input v-model="username" type="text" placeholder="用户名"> 
            </div>
             <!-- 密码 -->
            <div class="input-container">
                <input v-model="password" type="password" placeholder="密码"> 
            </div>

            <div class="login-page-content-login page-commit" @click="onLoginClick">
                登录
            </div>

            <a class="login-page-content-register" @click="onToRegisterClick">注册新用户</a>
        </div>
    </div>

</template>

<script>
import NavigationBar from '@c/currency/NavigationBar';
// import md5 from '@js/md5.min.js';
export default {
    name: 'login',
    components: {
        NavigationBar
    },
    data: function () {
        return {
            // 用户名
            username: '',
            // 密码
            password: '',
            // md5 加密的密码
            md5Password: ''
        }
    },
    methods: {
        // 后退事件
        onBackClick: function () {
            this.$router.go(-1);
        },
        // 登录按钮点击事件
        onLoginClick: function () {
            // 验证用户输入的合法性
            /**
             * 如果用户没有输入用户名或者密码的话，那么就直接 return 方法
             */
            if (this.username.length === 0
                || this.password.length === 0) {
                
                alert('用户名或密码未输入')
                return;
            }

            // 与原生交互，验证用户输入的用户名和密码

            // 对用户输入的密码进行 MD5 加密
            // this.md5Password = md5(this.password);

            // 判断当前的项目是运行在 Android 设备还是 IOS 设备中
            if (window.androidJSBridge) {
                // window 下存在 android 注入的对象（androidJSBridge），则表示当前项目在 android 设备中运行
                this.onLoginToAndroid();
            } else if (window.webkit) {
                // window 下存在 webkit ，表示当前项目在 IOS 设备中运行
                this.onLoginToIOS();
            }
        },
        /**
         * 调用 android 登录验证
         */
        onLoginToAndroid: function () {
            // 创建 json 字符串
            let userJson = JSON.stringify({
                'username': this.username,
                'password': this.md5Password
            });

            // 调用 android 登录接口
            let result = window.androidJSBridge.login(userJson);
            // 对 android 的返回值进行处理
            this.onLoginCallback(result);
        },
        /**
         * 调用 IOS 登录验证
         */
        onLoginToIOS: function () {
            // 创建 传输对象
            let userObj = {
                'username': this.username,
                'password': this.md5Password
            };

            // 回调方法,一定要在接口调用直接创建
            window.loginCallback = this.onLoginCallback;

            // 调用 IOS 登录接口
            window.webkit.messageHandlers.login.postMessage(userObj);
        },
        /**
         * 处理登录接口返回值
         */
        onLoginCallback: function (result) {

            switch (result) {
                case '-1':
                    alert('系统内部错误');
                    break;
                case '0':
                    // 保存主动登录的用户名到 username
                    this.$store.commit('setUsername', this.username);
                    this.onBackClick();
                    break;
                case '1':
                    alert('登录用户不存在');
                    break;
                case '2':
                    alert('用户密码错误');
                    break;
            }

        },

        /**
         * 立即注册点击事件
         */
        onToRegisterClick: function () {
            this.$router.push({
                name: 'register',
                params: {
                    routerType: 'push'
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>

    @import '@css/style.scss';

    .login-page {
        // 页面组件过渡动画，脱离标准文档流
        position: absolute;
        height: 100%;
        width: 100%;
        background-color: white;

        &-content {
            width: 100%;
            height: 100%;

            &-login {
                margin-top: 40%;
            }

            &-register {
                font-size: $infoSize;
                color: $hintColor;
                margin-top: $marginSize;
                padding: $marginSize;
                float: right;
            }
        }
    }

</style>

