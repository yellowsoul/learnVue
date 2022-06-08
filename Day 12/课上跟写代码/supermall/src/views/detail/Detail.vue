<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"/>
    <scroll class="content" ref="scroll">
      <detail-swiper :topImages="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detailInfo="detailInfo" @detailImageLoad="detailImageLoad"/>
      <detail-param-info :paramInfo="paramInfo"/>
      <detail-comment-info :commentInfo="commentInfo"/>
      <goods-list :goods="recommends"/>
    </scroll>
    
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo.vue'
import DetailCommentInfo from './childComps/DetailCommentInfo'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
// import {debounce} from "common/utils";
import {itemListenerMixin} from "common/mixin"

export default {
  name:"Detail",
  components:{
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,

    Scroll,
    GoodsList
  },
  mixins:[itemListenerMixin],
  data () {
    return {
      iid:null,
      topImages:[],
      goods:{},
      shop:{},
      detailInfo:{},
      paramInfo:{},
      commentInfo:{},
      recommends:[]
    }
  },
  created(){
    // 1.保存传入的iid
    this.iid = this.$route.params.iid

    // 2.根据iid请求详情数据
    getDetail(this.iid).then( res => {
      console.log(res)
      const data = res.result;
      // 1.获取顶部的图片轮播数据
      this.topImages = data.itemInfo.topImages

      // 2.获取商品信息
      this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)

      // 3.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)

      // 4.保存商品详细信息
      this.detailInfo = data.detailInfo

      // 5.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

      // 6.获取评论信息
      if (data.rate.list) {
        this.commentInfo = data.rate.list[0];
      }
    })

    // 3.请求推荐数据
    getRecommend().then( res => {
      this.recommends = res.data.list
    })
  },
  
  mounted(){
    /**
     * 注释：代码想要复用就可以通过 -> mixins混入
     * 1.一样的包含选项，他们将在Vue.extend()里最终选择使用相同的选项合并逻辑合并。
     * 2.举例：如果你的混入包含一个钩子而创建组件本身也有一个，两个函数将被调用。
     * */

    // // 1.监听商品item中图片加载完成
    // const refresh = debounce(this.$refs.detailScroll.refresh,500) //$refs拿到组件对象里的“方法” -> "detailScroll改为scroll,在mixin混入需要统一"

    // // 对监听的事件进行保存 -> 因为很多组件要用到全局$bus商品图加载这个函数，而我们离开页面时要给对应的页面取消监听，$bus.$off(''),为了要传入对应函数名
    // this.itemImgListener =  () => {
    //   // 防抖 refresh(...args) -> 剩余参数，可传多个参数到this.$refs.scroll.refresh方法里去
    //   refresh() //回顾闭包 -> 因这个返回的函数里面调用了局部变量timer,所以执行过程timer不会被销毁，这就形成了闭包
    // }
    // this.$bus.$on('itemImageLoad',this.itemImgListener)
  },

  destroyed(){
    //2.离开时 全局事件的监听 -> 取消对应的监听函数
    this.$bus.$off('itemImageLoad',this.itemImgListener)
  },

  methods: {
    // 商品详情图片介绍加载重新获取滚动高度 this.refresh ->  mixins:[itemListenerMixin],
    detailImageLoad(){
      this.refresh() // 防抖
      // this.$refs.scroll.refresh()
    }
  },
}
</script>

<style scoped>
#detail{
  position: relative;
  z-index: 9;
  background-color:#fff;
  height:100vh;
}
.detail-nav{
  position: relative;
  z-index: 9;
  background-color:#fff;
}
.content{
  height:calc(100% - 44px);
}
</style>
