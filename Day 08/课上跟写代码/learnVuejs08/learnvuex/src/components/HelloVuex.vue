<template>
  <div>
    <h2>我是子组件</h2>
    <h2>{{$store.state.counter}}</h2>
    <h2>{{$store.getters.powerCounter}}</h2>
    <h2>{{$store.getters.more20stu}}</h2>
    <h2>{{$store.state.info}}</h2>
  </div>
</template>

<script>
export default {
  name:'HelloVuex',
  // props:{
  //   counter:Number
  // },
}
</script>

<style scoped>
</style>
