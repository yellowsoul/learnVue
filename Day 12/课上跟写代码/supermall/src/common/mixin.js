import { debounce } from "./utils"
// 首页和详情页商品图片监听,全局事件$bus和局部mixin的使用
export const itemListenerMixin = {
  data(){
    return{
      itemImgListener:null,
      refresh:null // 因为详情图片加载也需要用到防抖功能，所以把此变量存为全局，之后只要组件有加载图片直接对应使用mixins混入执行调用this.refresh -> 解决组件内每张图片因加载延迟问题需重新获取滚动高度问题
    }
    
  },
  mounted(){
    // 1.监听商品item中图片加载完成
    this.refresh = debounce(this.$refs.scroll.refresh,500) //$refs拿到组件对象里的“方法”

    // 对监听的事件进行保存 -> 因为很多组件要用到全局$bus商品图加载这个函数，而我们离开页面时要给对应的页面取消监听，$bus.$off(''),为了要传入对应函数名
    this.itemImgListener =  () => {
      // 防抖 refresh(...args) -> 剩余参数，可传多个参数到this.$refs.scroll.refresh方法里去
      this.refresh() //回顾闭包 -> 因这个返回的函数里面调用了局部变量timer,所以执行过程timer不会被销毁，这就形成了闭包
    }
    this.$bus.$on('itemImageLoad',this.itemImgListener)
    console.log('minxin -> 是我混入内容')
  }
}