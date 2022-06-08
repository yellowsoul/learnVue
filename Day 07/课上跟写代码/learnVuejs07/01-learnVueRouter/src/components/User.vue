<template>
  <div>
    <h2>我是用户界面</h2>
    <p>我是用户的相关信息，嘿嘿嘿</p>
    <h2>{{userId}}</h2>
    <h3>{{$route.params.id}}</h3>
    <button @click="btnClick">按钮看看"router"是不是同个东西（是的- -）</button>
  </div>
</template>

<script>
  export default {
    name:"User",
    data(){
      return {
        message:''
      }
    },
    computed:{
      userId(){
        return this.$route.params.id
      },
      created(){
        console.log('User created');
      },
      destroyed(){
        console.log('User destroyed')
      }
    },
    methods:{
      btnClick(){
        
        //和入口main.js里挂载的router对比是不是同个东西
        console.log(this.$router);
        //再看看route是什么
        console.log(this.$route);

        //结论：所有的组件都继承自Vue类的原型,方法在main.js里在添加Vue.prototype.test
        //this.test()
        // console.log(this.name)

        /**
         * //在Vue.use(VueRouter)的时候 其实就相当于执行VueRouter install(安装)
         * 其实这个就是内部做的事，（this.$options.router这个是在new Vue传进来的）this._routerRoot = this - >是Vue实例
         * Vue.prototype.$router = _return this._routerRoot._router; 
         * 
         * //注册全局组
         * Vue.component(RouterView,View)
         * Vue.component(RouterLink,Link)
         * 
         * 本质 - > 可以稍微理解一点了吧 (:
         * **/
      }
    }
  }
</script>

<style scoped>

</style>