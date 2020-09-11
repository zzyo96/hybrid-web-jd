// axios 配置
import Vue from 'vue';
import axios from  'axios';

// 设置 axios 请求 baseUrl
axios.defaults.baseURL = 'https://easy-mock.com/mock/5ceb51b551e3de74af53fe54/imooc/api';

axios.interceptors.response.use((response) => {
  //  统一处理数据，使组件中的请求只获取到需要的业务数据，
  // 而不需要去关注返回的状态码等与业务无关的数据
  // console.log('响应拦截器');
  return response.data.data;
}, (error) => {
  // 处理错误的响应
  return Promise.reject(error);
});

//  绑定到 vue 原型中，组件中 ： this.$http -> axios 。
Vue.prototype.$http = axios;