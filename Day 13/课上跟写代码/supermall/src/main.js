import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.prototype.$bus = new Vue() //自己给原型添加个“事件总线” -> 用得少（其实写了这么多就是为了获取高度，那么为何不一开始就把产品图片的高度用css固定就可以了，或者图片外包个盒子设置个高度完全可以解决BScroll获取可滚动高度的问题）

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
