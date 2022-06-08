<template>
  <div>
    <h2>我是Profile页面</h2>
    <h3>{{$route.query.name}}</h3>
    <h3>{{$route.query.age}}</h3>
    <h3>{{$route.query.height}}</h3>
  </div>
</template>

<script>
  export default {
    name:"Profile",
    data(){
      return {
      }
    },
    created(){
      console.log('Profile created');
    },
    destroyed(){
      console.log('Profile destroyed')
    }
  }
</script>

<style scoped>

</style>