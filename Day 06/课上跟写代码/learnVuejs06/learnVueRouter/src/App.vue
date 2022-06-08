<template>
  <div id="app">
    <router-view></router-view>
    <!-- <router-link to="/home" tag="button" replace active-class="active">首页</router-link>
    <router-link to="/about" tag="button" replace active-class="active">关于</router-link> -->

    <!-- <router-link to="/home" tag="button" replace>首页</router-link>
    <router-link to="/about" tag="button" replace>关于</router-link> -->

    <button @click="homeClick">首页</button>
    <button @click="aboutClick">关于</button>

  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{}
  },
  methods:{
    homeClick(){
      // 通过代码的方式修改路由 vue-router
      // this.$router.push('/home')
      this.$router.replace('/home')
      
      console.log('homeClick');
    },
    aboutClick(){
      // this.$router.push('/about')
      this.$router.replace('/about')
      console.log('aboutClick')
    }
  }
}
</script>

<style scoped>
.active{
  color:#f00;
}
</style>
