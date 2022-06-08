<template>
  <div id="app">
    <h2>----我是app组件----</h2>
    <!-- <router-link to="/home" tag="button" replace active-class="active">首页</router-link>
    <router-link to="/about" tag="button" replace active-class="active">关于</router-link> -->

    <!-- <router-link to="/home" tag="button" replace>首页</router-link>
    <router-link to="/about" tag="button" replace>关于</router-link> -->

    <!-- <button @click="homeClick">首页</button>
    <button @click="aboutClick">关于</button>
    <button @click="userClick">用户</button> -->

    <router-link to="/home">首页</router-link>
    <router-link to="/about">关于</router-link>
    <!-- <router-link :to="'/user/'+userId">用户</router-link> -->
    <!-- <router-link to="/Profile">档案</router-link> -->
    <!-- <router-link :to="{path:'/profile',query:{name:'Aron',age:'18',height:'1.83'}}">档案</router-link> -->
    <button @click="userClick">用户</button>
    <button @click="profileClick">档案</button>
    <!-- 
      keep-alive里面的东西只会被创建一次，而后都会被缓存，那果希望其中某个不想被缓存 它有两个属性 include和exclude 
      include - > 字符串或正则表达，只有匹配的组件会缓存
      exclude - > 字符串或正则表达，任何匹配的组件都不会被缓存
      -->
    <keep-alive exclude="Profile,User">
      <router-view/>
    </keep-alive>

  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      userId:'lisi'
    }
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
    },

    userClick(){
      this.$router.push('/user/' + this.userId)
    },
    profileClick(){
      this.$router.push({
        path:'/profile',
        query:{
          name:'kobe',
          age:19,
          height:1.8
        }
      })
    }
  }
}
</script>

<style scoped>
.active{
  color:#f00;
}
</style>
