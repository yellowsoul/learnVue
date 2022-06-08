<template>
  <div id="app">
    <h2>----------App内容：modules中的内容----------</h2>
    <h2 style="color:pink">{{$store.state.a.name}}</h2>
    <button @click="updateName">修改名字moduleA名字</button>
    <h2>{{$store.getters.fullname}}</h2>
    <h2>{{$store.getters.fullname2}}</h2>
    <h2>{{$store.getters.fullname3}}</h2>
    <button @click="asyncUpdateName">异步修改moduleA名字</button>
    


    <h2>----------App内容：info对象的内容是否是响应式的----------</h2>
    <h2>{{$store.state.info}}</h2>
    <button @click="updateInfo">修改info信息</button>


    <h2>----------App内容----------</h2>
    <h2>{{message}}</h2>
    <h2>{{$store.state.counter}}</h2>
    <!-- 不要使用这钟直接改的方法式因为到时候踪不到sate状态， -- 官方提供了专门的工具方法去修改和跟踪状态（使用Devtools浏览器插件） Actions -> Mutations -> State
    Actions -> 处理异步操作 Mutations -> 处理同步 state ->状态
    <button @click="$store.state.counter++">+</button>
    <button @click="$store.state.counter--">-</button>
    -->

    <button @click="addition">+</button>
    <button @click="subtraction">-</button>
    <button @click="addCount(5)">+5</button>
    <button @click="addCount(10)">+10</button>
    <button @click="addStudent">添加对象</button>


    <h2>----------App内容：getters相关信息----------</h2>
    <h2>{{$store.getters.powerCounter}}</h2>
    <h2>{{$store.getters.more20stu}}</h2>
    <h2>{{$store.getters.more20stuLength}}</h2>
    <h2>{{$store.getters.moreAgeStu(29)}}</h2>

    
    <h2>----------Hello Vuex内容----------</h2>
    <hello-vuex/>
  </div>
</template>

<script>
import HelloVuex from './components/HelloVuex'
import {INCREMENT} from './store/mutations-types' //mutations - 类型常量（官方推荐使用）
export default {
  name: 'App',
  components:{
    HelloVuex
  },
  data(){
    return{
      message:'我是App组件',
    }
  },
  // computed:{
  //   more20stu(){
  //     return this.$store.state.students.filter(s => s.age > 20)
  //   }
  // },
  methods:{
    //使用commit的方式进行提交（传入事件类型）
    addition(){
      this.$store.commit(INCREMENT)
    },
    subtraction(){
      this.$store.commit('decrement')
    },

    //自定义递增数值
    addCount(count){
      //payload:负载 - 第二个参数我们称为
      //1.普通的提交风格
      // this.$store.commit('incrementCount',count)

      //2.特殊的提交风格 ->可传入多个参数，那么在mutations里面此事件类型的回调函数接收的就是一个对象（包含着这它们）
      this.$store.commit({
        type:'incrementCount',
        count
      })
    },

    //传入一个对象
    addStudent(){
      const stu = {id:114,name:'alan',age:35}
      this.$store.commit('addStudent',stu)
    },

    //更新info
    updateInfo(){
      //同步 - mutations
      // this.$store.commit('updateInfo')

      //异步 - actions
      // 1. 携带的参数和回调写在一起了 -> 不够优雅
      // this.$store.dispatch('aUpdateInfo',{  
      //   message:'我是携带的信息',
      //   success:() => {
      //     console.log('里面已经完成了')
      //   }
      // })

      // 2.优雅 -> 使用promise
      this.$store
      .dispatch('aUpdateInfo','我是携带的信息')
      .then( res => {
        console.log(res+'里面完成了提交')
      })

    },

    //修改模块moduleA的name ->所有模块之间的事件类型名称不能重复
    updateName(){
      this.$store.commit('updateName','lisi')
    },

    //异步修moduleA名字
    asyncUpdateName(){
      this.$store.dispatch('aUpdateName')
    }
  }
}
</script>

<style>

</style>
