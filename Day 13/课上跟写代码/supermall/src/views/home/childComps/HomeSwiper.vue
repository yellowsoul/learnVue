<template>
  <swiper>
    <swiper-item v-for="item in banners" :key="item.id">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imageLoad">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
// import Swiper from 'components/common/swiper/Swiper'
// import SwiperItem from 'components/common/swiper/SwiperItem'
import {Swiper, SwiperItem} from 'components/common/swiper'
export default {
  nmae:"HomeSwiper",
  components:{
    Swiper,
    SwiperItem
  },
  props:{
    banners:{
      type:Array,
      default:()=>[]
      // default(){
      //   return []
      // }
    }
  },
  data () {
    return {
      isLoad:false
    }
  },
  methods: {
    imageLoad(){
      // 只执行一次，防重复
      if(!this.isLoad){
        this.$emit('swiperImageLoad')
        this.isLoad = true
      }
    }
  },
}
</script>

<style scoped>
</style>
