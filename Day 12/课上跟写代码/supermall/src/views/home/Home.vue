<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control
      v-show="isTabFixed"
      ref="tabControl1"
      :titles="['流行','新款','经典']"
      class="tab-control"
      @tabClick="tabClick"
      />
    <scroll class="content" 
      ref="scroll" 
      :probe-type="3"
      :pull-up-load="true"
      @scroll="contentScroll"
      @pullingUp="loadMore"
    >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view />
      <tab-control
        ref="tabControl2"
        :titles="['流行','新款','经典']" 
        @tabClick="tabClick"
        />
      <goods-list :goods="showGoods"/>
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
// import {debounce} from 'common/utils'
import {itemListenerMixin} from 'common/mixin'

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
  mixins:[itemListenerMixin],
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
      isShowBackTop:false,
      tabOffsetTop:0,
      isTabFixed:false,
      saveY:0
      
    }
  },
  // 计算属性
  computed:{
    //传入的初始数据 ->处理为了看着清楚
    showGoods(){
      return this.goods[this.currentType].list
    }
  },
  //组件销毁后
  destroyed(){
    console.log('home destroyed')
  },

  // keep-alive 时可以使用钩子函数（activated / deactivated）
  activated(){
    // 进来设置位置
    this.$refs.scroll.scrollTo(0,this.saveY,0)
    this.$refs.scroll.refresh() //防止底部导航路由切换时页面不能滚动
  },
  
  deactivated(){
    // 1.离开记录位置
    this.saveY = this.$refs.scroll.getScrollY()

    //2.取消全局事件的监听 -> 必须传入对应的函数，否则会取消全部监听
    this.$bus.$off('itemImgLoad',this.itemImgListener )
  },
  // 组件创建完成
  created(){
    // 1.请求多个数据
    this.getHomeMultidata()
    
    // 2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')

  },
  // 组件挂载完成
  mounted(){
    /**
     * 注释：代码想要复用就可以通过 -> mixins混入
     * 1.一样的包含选项，他们将在Vue.extend()里最终选择使用相同的选项合并逻辑合并。
     * 2.举例：如果你的混入包含一个钩子而创建组件本身也有一个，两个函数将被调用。
     * */

    // // 1.监听商品item中图片加载完成
    // const refresh = debounce(this.$refs.scroll.refresh,500) //$refs拿到组件对象里的“方法”

    // // 对监听的事件进行保存 -> 因为很多组件要用到全局$bus商品图加载这个函数，而我们离开页面时要给对应的页面取消监听，$bus.$off(''),为了要传入对应函数名
    // this.itemImgListener =  () => {
    //   // 防抖 refresh(...args) -> 剩余参数，可传多个参数到this.$refs.scroll.refresh方法里去
    //   refresh() //回顾闭包 -> 因这个返回的函数里面调用了局部变量timer,所以执行过程timer不会被销毁，这就形成了闭包
    // }
    // this.$bus.$on('itemImageLoad',this.itemImgListener)

  },
  methods:{
    /**
     * 事件监听相关的方法
     */
    //防抖动方法

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

      //两个选项卡组件里面的下标保持一致
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
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
      // 1.判断BackTop是否显示
      this.isShowBackTop = (-position.y) > 1000

      // 2.决定tabControl是否吸顶(position:fiexd)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },

    //滚动底部加载分页
    loadMore(){
      console.log('loadMore')
      this.getHomeGoods(this.currentType)
    },

    //监听首页轮播图片加载完成
    swiperImageLoad(){
      // 获取tabControl的offsetTop
      // 所有的组件都有一个属性$el：用于获取组件中的元素
      // console.log(this.$refs.tabControl.$el.offsetTop)
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop //ps:-> 其实我觉得直接把图片的父元素高度设置固定，那就可以不用这种图片加载完成再获取高度的方式了
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

        // 完成上拉加载更多
        this.$refs.scroll.finishPullUp()
      })
    }
  }
}

</script>
<style scoped>
#home{
  position: relative;
  /* padding-top:44px; */
  height:100vh;
}
.home-nav{
  /* position: fixed;
  top:0;
  left:0;
  right:0;
  z-index: 9; */
  background-color:var(--color-tint);
  color:#fff;
}
/* .tab-control{
  position: sticky;
  top:44px;
  z-index: 9;
} */
.content{
  position: absolute;
  top:44px;
  bottom:49px;
  left:0;
  right:0;
  overflow: hidden;
}
.tab-control{
  position: relative;
  z-index: 9;
}
/* .content{
  height:calc(100% - 93px);
  overflow: hidden;
  margin-top:44px;
} */
</style>