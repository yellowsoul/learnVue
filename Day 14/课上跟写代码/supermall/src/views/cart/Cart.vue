<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>

    <!-- 商品列表 -->
    <cart-list />

    <!-- 底部汇总 -->
    <cart-bottom-bar />
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import CartList from './childComps/CartList'
import CartBottomBar from './childComps/CartBottomBar'


import { mapGetters } from 'vuex' //mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性：
export default {
  name:'Cart',
  components:{
    NavBar,
    CartList,
    CartBottomBar
  },
  data(){
    return{

    }
  },
  computed:{
    // 两种用法
    // 1.
    ...mapGetters([
      'cartLength'
    ])
    // 2.
    // ...mapGetters({
    //   length:'cartLength'
    // })
    

    // cartLength(){
    //   return this.$store.getters.cartLength;
    // }
  },
  created(){
    
  }
}

</script>
<style scoped>
.nav-bar{
  background-color: var(--color-tint);
  color: #fff;
}
</style>