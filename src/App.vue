<template>
  <div id="app">
    <!-- 
      进入新页面的时候：
      在进入新页面的时候，原页面（首页）执行一个从屏幕中展示的位置，从右到左移动出屏幕的动画。同时新页面（商品列表）执行一个从屏幕右侧，从右到左移动到屏幕中的动画。
      在后退页面的时候：
      原页面（商品列表）执行一个从屏幕中展示的位置，从左到右移动出屏幕的滑动。新页面（首页）执行一个从屏幕左侧，从左到右移动到屏幕中的动画。
     -->

     <!-- 
       页面过渡效果实现逻辑:
        1、创建动画的 css。
        2、判断当前是需要执行 跳转动画（进入新页面） 还是后退动画（后退页面）。
            1、监听路由对象 $route .
            2、让页面在跳转的时候，携带包含跳转标记的 params，通过对 parmas 中跳转标记的判断，来判断当前是否为跳转动画。
            3、如果说 params 包含跳转标记，那么表示当前为跳转动画。否则当前为后退动画。
        3、通过 transition 的方式来为 router-view 指定对应的动画效果。

      -->

      <!-- 
        页面跳转的滑动状态保存：
        1、所有的组件中数据都会被保存下来。
        2、需要在组件中创建一个变量（会被 keepAlive 保存起来。），通过这个变量来记录当前页面的一个滑动距离。
        3、当后退回该页面的时候，使用这个变量来改变当前页面的一个滑动距离。
            1、应该在什么时机去改变当前页面的滑动距离？
            2、可以在 组件的 activated（keep-alive 组件被激活的时候才会调用） 方法中去指定页面滑动模块的滑动距离


       -->

       <!-- 
         适配 沉浸式APP 问题：
          1、沉浸式展示中，NavBar 与 statusBar 重叠
          IOS 设备根据屏幕的形状可以分为两种类型：
            1、IPhoneX 以下的标准屏幕
            2、IphoneX 以上的留海屏屏幕

          IOS 设备问题：
            1、在IOS设备中，网页滚动卡顿。并且点击按钮出现高亮效果。
            2、在 IphoneX 中展示，navBar 紧贴留海位置展示。
            3、在 IiphoneX 中展示，toolbar 占据底部操作区的位置。
          IOS 设备问题解决方案：
            1、需要指定 滑动的元素使用 IOS 原生的滑动方式
            2、3问题解决方案
              1、判断当前设备是否为 IPhonex 。 
              2、让项目的内容区避开 IphoneX 中的危险区域。让内容在安全区进行展示。  
        -->

        <!-- 
          WEB 与 原生交互：
            1、自动登录的部分
              1、注册
              2、登录
              3、退出登录
            2、支付宝、微信支付(只在 Android 端进行了集成)
              1、对于 WEB 端来说，只需要对接 支付宝、微信支付接口
         -->

      <transition :name="transitionName">
        <!-- 所有通过 router-view 加载的页面组件都会被缓存 -->
        <keep-alive :include="virtualTaskStack">
          <router-view/>
        </keep-alive>
        
      </transition>
    
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      transitionName: 'fold-left',
      // 虚拟任务栈
      virtualTaskStack: [
        'imooc'
      ]
    }
  },
  watch: {
    // 监听路由对象，决定使用哪种过渡效果
    '$route' (to) {
      // 获取到携带的标记
      const routerType = to.params.routerType;
      if (routerType === 'push') {
        // 当进入新页面的时候，保存新页面名称到虚拟任务栈
        this.virtualTaskStack.push(to.name);
        // 跳转页面
        this.transitionName = 'fold-left';
      } else {
        // 执行后退操作的时候，把最后一个页面从任务栈中弹出
        this.virtualTaskStack.pop();
        // 后退页面
        this.transitionName = 'fold-right';
      }

      /**
       * 初始化虚拟任务栈
       */
      if (to.params.clearTask) {
        this.virtualTaskStack = ['imooc']
      }
    }
  },
  created: function () {
    // this.$store.commit('setIsIphoneX', window.isIphoneX);
    // 指定 Native 主动调用的方法
    window.nativeFunctionUserLogin = this.nativeFunctionUserLogin;
  },
  methods: {
    /**
     * 提供给 native 调用的方法，这个方法可接受当前自动登录的用户的用户名。
     * 保存当前自动登录的用户名到 vuex
     */
    // nativeFunctionUserLogin: function (username) {
    nativeFunctionUserLogin: function () {
      // 保存自动登录用的 username 到 vuex。
      // this.$store.commit('setUsername', username);
    }
  }
}
</script>

<style lang="scss">
@import '@css/style.scss';

  #app {
    width: 100%;
    height: 100%;

    // push 页面时：新页面的进入动画
    .fold-left-enter-active {
      animation-name: fold-left-in;
      animation-duration: .4s;
    }
    @keyframes fold-left-in {
        0% {
          transform: translate(100%, 0);
        }
        100% {
          transform: translate(0, 0);
        }
    }

    // push 页面时：原页面的退出动画
    .fold-left-leave-active {
      animation-name: fold-left-out;
      animation-duration: .4s;
    }
    @keyframes fold-left-out {
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(-100%, 0);
        }
    }

    // 后退页面时：即将展示页面的动画
    .fold-right-enter-active {
      animation-name: fold-right-in;
      animation-duration: .4s;
    }
    @keyframes fold-right-in {
        0% {
          transform: translate(-100%, 0);
        }
        100% {
          transform: translate(0, 0);
        }
    }

    // 后退页面时：后退的页面的动画
    .fold-right-leave-active {
      animation-name: fold-right-out;
      animation-duration: .4s;
    }
    @keyframes fold-right-out {
        0% {
          transform: translate(0, 0);
        }
        100% {
          transform: translate(100%, 0);
        }
    }
  }

</style>
