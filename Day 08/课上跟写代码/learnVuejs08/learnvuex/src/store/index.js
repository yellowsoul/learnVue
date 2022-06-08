import Vue from 'vue'
import Vuex from 'vuex'

//官方推荐抽取 -> “root根”模块利于管理
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
//官方推荐模块导入
import moduleA from './modules/moduleA'

//1.安装插件
Vue.use(Vuex)

//2.创建对象
//root根的state -> 也可以抽，一般不抽，灵活掌握
const state = {
  counter:1000,
  students:[
    {id:110,name:'Aron',age:29},
    {id:111,name:'kobe',age:24},
    {id:112,name:'james',age:30},
    {id:113,name:'curry',age:10}
  ],
  info: {
    name:'kobe',
    age:40,
    height:1.98
  }
}
const store = new Vuex.Store({
  //保存状态 - > 这些属性都会加入到响应式系统中，它是一种观察者模式，它在监听到某个属性变化的时候会通知使用这个属性的所有页面更新这个值
  state,
  //同步操作（改变state一定是通过mutations）,Vuex要求mutation中的方法必须是同步方法 -> 主要原因是devtools工具可以捕捉跟踪每次快照
  mutations,
  //异步操作 - > Action类似于Mutation,但是用来代替Mutation进行异步操作的，处理完成后再通过“Mutation”去改“state”（actions -> mutations -> state）
  actions,

  //和计算属性很像
  getters,
  //模块 ->将store分割成模块，每个模块拥有自己的state、mutations、actions、getters等
  modules:{
    a:moduleA
  }
})

//3.导出store对象
export default store


//es6 小知识点 -> 对象解构 
const obj = {
  name:'Aron',
  age:18,
  height:1.88
}

const {name, age, height} = obj;
console.log(name, age, height)