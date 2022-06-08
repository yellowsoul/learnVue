<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>

    <scroll class="content" 
      ref="scroll" 
      :probe-type="3"
      :pull-up-load="true"
      @scroll="contentScroll" 
      @pullingUp="loadMore">
      <home-swiper :banners="banners"/>
      <recommend-view :recommends="recommends"/>
      <feature-view />
      <tab-control class="tab-control" 
        :titles="['流行','新款','经典']" 
        @tabClick="tabClick"/>
      <goodsList :goods="showGoods"/>
    </scroll>
    <!-- 正常组件是不可以直接添加事件的，但 native 可以监听组件原生事件 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

import {getHomeMultidata,getHomeGoods} from 'network/home'



export default {
  name:'Home',
  components:{
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  data(){
    return{
      banners:[],
      recommends:[],
      goods:{
        'pop':{page:0,list:[]},
        'new':{page:0,list:[]},
        'sell':{page:0,list:[]}
      },
      currentType:'pop',
      isShowBackTop:false
    }
  },
  computed:{
    //传入的初始数据 ->处理为了看着清楚
    showGoods(){
      return this.goods[this.currentType].list
    }
  },
  created(){
    // 1.请求多个数据
    this.getHomeMultidata()

    // 2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  methods:{
    /**
     * 事件监听相关的方法
     */

    // 商品列表切换
    tabClick(index) {
      switch(index){
        case 0:
          this.currentType = 'pop'
          break;
        case 1:
          this.currentType = 'new'
          break;
        case 2:
          this.currentType = 'sell'
          break;
      }
    },

    // 返回顶部
    backClick(){
      //$refs拿到组件对象里的“data属性”或“访问方法”
      // this.$refs.scroll.scroll.scrollTo(0,0,500)
      this.$refs.scroll.scrollTo(0, 0, 500)
    },

    // 监听首页滚动
    contentScroll(position){
      // console.log(Math.abs(position.y))
      this.isShowBackTop = (-position.y) > 1000?true:false
    },

    //滚动底部加载分页
    loadMore(){
      // 针对类型加载数据
      this.getHomeGoods(this.currentType)

      // bug 因图片加载原因，初始滚动高度可能没有加上图片的高，所以要这步等于是刷新重新加载可滚动高度（P171集暂时处理，之后会在P192有解答）
      this.$refs.scroll.scroll.refresh();
    },

    /**
     * 网络请求相关的方法
     */
    // 封装 请求首页【轮播数据】和【推荐入口】
    getHomeMultidata(){
      getHomeMultidata().then(res => {
        // console.log(res)
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
    },
    // 封装 请求首页【商品数据】
    getHomeGoods(type){
      const page = this.goods[type].page +1
      getHomeGoods(type,page).then(res => {
        // console.log(res)
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page = page

        //$refs拿到组件对象里的“方法” ->刷新上拉加载
        this.$refs.scroll.finishPullUp();
      })
    }
  }
}

</script>
<style scoped>
#home{
  position: relative;
  padding-top:44px;
  height:100vh;
}
.home-nav{
  position: fixed;
  top:0;
  left:0;
  right:0;
  z-index: 9;
  background-color:var(--color-tint);
  color:#fff;
}
.tab-control{
  position: sticky;
  top:44px;
  z-index: 9;
}
.content{
  position: absolute;
  top:44px;
  bottom:49px;
  left:0;
  right:0;
  overflow: hidden;
}
/* .content{
  height:calc(100% - 93px);
  overflow: hidden;
  margin-top:44px;
} */
</style>