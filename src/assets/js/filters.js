import Vue from 'vue';

/**
* 金额数据处理
* @param value 调用过滤器时，调用的文本
*/
Vue.filter('priceValue',function (value) {
  if(!value){
    return '0.00';
  }

  let result = parseFloat(value)

  if(Number.isInteger(result)){
    return result;
  }

  return result.toFixed(2)
});