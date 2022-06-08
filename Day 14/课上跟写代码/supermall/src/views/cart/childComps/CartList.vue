<template>
  <scroll class="cart-list" ref="scroll">
    <cart-list-item 
      v-for="(item, index) in cartList" 
      :key="index"
      :item-info="item"
    />
  </scroll>
</template>

<script>
import Scroll from 'components/common/scroll/Scroll'
import CartListItem from './CartListItem'

import { mapGetters } from 'vuex'
export default {
  name:'CartList',
  components:{
    Scroll,
    CartListItem
  },
  data(){
    return {
      
    }
  },
  computed: {
    ...mapGetters(['cartList'])
  },
  activated(){
    this.$refs.scroll.refresh()
  }
}
</script>

<style scoped>
  .cart-list {
    position: absolute;
    top: 44px;
    left: 0;
    right: 0;
    bottom: 93px;
    overflow: hidden;
  }

</style>