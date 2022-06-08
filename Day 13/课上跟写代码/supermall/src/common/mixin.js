import { debounce } from "./utils"
import BackTop from 'components/content/backTop/BackTop' 
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
    // console.log('minxin -> 是我混入内容')
  }
}


//backTop的混入封装
export const backTopMixin = {
  components:{
    BackTop
  },
  data(){
    return{
      isShowBackTop:false,
    }
  },
  methods:{
    // 返回顶部
    backClick(){
      //$refs拿到组件对象里的“data属性”或“访问方法”
      // this.$refs.scroll.scroll.scrollTo(0,0,500)
      this.$refs.scroll.scrollTo(0, 0, 500)
    },

    // 监听首页滚动 -> 这个时候你可能想到这个函数是否也可以合并，但很遗憾不能这么做，除了生命周期之外，methods方法里只会合并同级函数，它会直接把函数内部的东西覆盖。
    // contentScroll(position){
    //   // console.log(Math.abs(position.y))
    //   // 1.判断BackTop是否显示
    //   this.isShowBackTop = (-position.y) > TOP_DISTANCE

    //   // 2.决定tabControl是否吸顶(position:fiexd)
    //   this.isTabFixed = (-position.y) > this.tabOffsetTop
    // },

  }

}