<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" 
      @titleClick="titleClick"
      ref="titleBar"
    />
    <scroll class="content" 
      ref="scroll" 
      :probe-type="3" 
      @scroll="contentScroll"
    >
      <!-- 属性：topImages 传入值：top-images -->
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad"/>
      <detail-param-info ref="param" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <!-- 正常组件是不可以直接添加事件的，但 native 可以监听组件原生事件 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
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
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
import {TOP_DISTANCE} from 'common/const' // 使用常量

import {debounce} from "common/utils";
import {itemListenerMixin, backTopMixin} from "common/mixin" // 混入公用 -> 1.商品图片监听 2.backTop回到顶部,

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
    DetailBottomBar,


    Scroll,
    GoodsList
  },
  mixins:[itemListenerMixin, backTopMixin],
  data () {
    return {
      iid:null,
      topImages:[],
      goods:{},
      shop:{},
      detailInfo:{},
      paramInfo:{},
      commentInfo:{},
      recommends:[],

      themeTopYs:[],
      getThemeTopY:null,

      currentIndex:0
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

      /*【联动效果-获取顶部距离】
      //  1.第一次获取：值不对，this.$refs.param.$el压根没有渲染
      //  学习过程中你可能认为这段代码可以放在“mounted”钩子函数中获取，
      //  但经过测试在获取的过程中“themeTopYs”数组中存在undefind,
      //  原因是组件数据经过判断， v-if="Object.keys(paramInfo).length !== 0"，说明异步数据请求还未完全返回，
      //  问：至此现在我们在这步已经确定赋值完数据之后，再去直接拿元素距离顶部高度为何还是拿不到？ 
      //  答：因为拿到数据后需要时间渲染完成才能更新dom，所以面对这种情况我们可以使用函数this.$nextTick()； -> 保证渲染完成后

      this.$nextTick(() => {
        // 2.第二次获取：值不对，图片没有计算在内
        // 根据最新的数据，对应的DOM是已经被 渲染出来了
        // 但是图片依然是没有加载完的(目前获取到的offsetTop不包含其中的图片的)
        // offsetTop值不对的时候一般情况下都是因为图片的问题
        this.themeTopYs = []
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.param.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        console.log(this.themeTopYs)
      })
      */
    })

    // 3.请求推荐数据
    getRecommend().then( res => {
      this.recommends = res.data.list
    })

    // 4.【联动效果-获取顶部距离】给getThemeTopY赋值(给this.themeTopYs赋值的操作进行防抖)
    this.getThemeTopY = debounce(() => { //此时只是函数赋值还未执行，这段代码将在“detailImageLoad”图片加载中执行
      this.themeTopYs = []
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.param.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE)

      // console.log(this.themeTopYs)
    },100)
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

  updated(){
    // 【联动效果-获取顶部距离】this.themeTopYs = [] 也可以在这里获取元素距离顶部的高，不过此钩子函数只要数据变化就会被频繁调用。此场景中就不大推荐使用了。
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

      // 【联动效果-获取顶部距离】在“created”数据赋值时使用this.$nextTick()函数 -> 渲染DOM后获取的高度依然是没有把图片没有计算在内，所以把这段代码放在这里获取
      this.getThemeTopY()
    },

    // 【联动效果-点击滚动对应位置】
    titleClick(index){
      console.log(-this.themeTopYs[index])
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index],200);
    },
    // 【联动效果-滚动对应位置导航文字高亮】
    contentScroll(position){
      // 1.获取y值
      const positionY = -position.y

      // 2.positionY和主题中的值进行对比
      // [0, 6235, 7037, 7253，Number.MAX_VALUE]
      // console.log(Number.MAX_VALUE);

      // positionY 在 0 和 6235之间，index = 0
      // positionY 在 6235 和 7037之间，index = 1
      // positionY 在 7037 和 7253之间，index = 2
      // (1)positionY 超过 7253时，index = 3

      // (2)positionY 大于等于 7253 值，index = 3



      let length = this.themeTopYs.length
      for(let i = 0; i < length-1; i++){
        // if(positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]){
        //   this.$refs.titleBar.currentIndex = i
        // }

        /*课堂1普通写法：
        if(
          this.currentIndex !==i && //排除自己，进行下步判断 -> 防止赋值过于频繁
          (
            (i<length-1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) || 
            (i === length-1 && positionY >= this.themeTopYs[i])
          )
        ){

          // if(this.currentIndex != i){ //节流
            this.$refs.titleBar.currentIndex = i
            this.currentIndex = i
            console.log(this.currentIndex)
          // }
        }
        */

        //课堂2优化写法：hack(用空间换时间的概念)
        if(
          this.currentIndex !==i && //防止赋值过于频繁
          (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])
        ){
            this.$refs.titleBar.currentIndex = i
            this.currentIndex = i
            console.log(this.currentIndex)
        }
        
      }
      
      // 1.判断BackTop是否显示
      this.isShowBackTop = (-position.y) > TOP_DISTANCE
      // 我的优化写法
      // for(let i = 0; i < this.themeTopYs.length; i++){
      //   if(positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]){
      //     this.$refs.titleBar.currentIndex = i
      //   }else if(positionY >= this.themeTopYs[i]){//给最后一个i单独赋值
      //     this.$refs.titleBar.currentIndex = i
      //   }
      // }
      
    },

    // 添加购物车
    addToCart(){
      // 1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;

      // 2. Vuex通过mutations向state提交数据
      // this.$store.commit('addToCart',product)
      // 2. Vuex 因方法比较复杂，所以先通过action(处理异步、复杂) -> 再Mutation(官方推荐单一事件) -> 最后state
      this.$store.dispatch('addCart',product)
      console.log(this.$store.state.cartList)
    },
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
  height:calc(100% - 44px - 58px);
}
</style>
