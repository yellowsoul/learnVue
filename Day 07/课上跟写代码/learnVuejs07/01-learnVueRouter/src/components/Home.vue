<template>
  <div>
    <h2>我是首页</h2>
    <p>我是首页，哈哈哈</p>

    <router-link to="/home/news">新闻</router-link>
    <router-link to="/home/message">消息</router-link>

    <router-view></router-view>
    <h2>{{message}}</h2>
  </div>
</template>

<script>
export default {
  name:'Home',
  data(){
    return{
      message:'你好啊',
      path: '/home/news'
    }
  },
  //创建组件的时候回调
  created(){
    console.log('home created');
  },
  // //template挂载到DOM后回调
  // mounted(){
  //   console.log('mounted');
  // },
  // //界面发生刷新的时候回调
  // updated(){
  //   console.log('updated');
  // },
  //销毁
  destroyed(){
    console.log('home destroyed')
  },


  // 这两个函数, 只有该组件被保持了状态使用了keep-alive时, 才是有效的
  activated() {
    this.$router.push(this.path);
    // console.log('activated');
  },

  deactivated() {
    console.log('deactivated');
  },
  
  //组件内的守卫 - before -> 离开之前
  beforeRouteLeave (to, from, next) {
    //导航离开该组件的对应路由时调用
  //可以访问组件实例 'this'
    console.log(this.$route.path);
    this.path = this.$route.path;
    next()
  }
}

</script>
<style scoped>
</style>