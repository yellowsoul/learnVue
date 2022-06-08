import Vue from 'vue'
import Vuex from 'vuex'

import {
  INCREMENT 
} from './mutations-types' //类型常量（官方推荐使用）

//1.安装插件
Vue.use(Vuex)

//2.创建对象
const moduleA = {
  state:{
    name:'zhangsan'
  },
  mutations:{
    updateName(state,payload){
      state.name = payload
    }
  },
  actions:{
    // 这里的context只commit自己的mutations
    aUpdateName(context){ // 可使用对像解构方式取要使用的 context -> {state, conmmit,rootState}
      setTimeout(() => {
        console.log(context) 
        context.commit('updateName','wangwu')
      },1000)
    }
  },
  getters:{
    fullname(state){
      return state.name + '使用moduleA getters'
    },
    fullname2(state,getters){
      return getters.fullname + '222'
    },
    //拿到下面根的state - > 只有在模块里面才有根的概念
    fullname3(state,getters,rootState){
      return getters.fullname2 + rootState.counter
    }
  }
}

const store = new Vuex.Store({
  //保存状态 - > 这些属性都会加入到响应式系统中，它是一种观察者模式，它在监听到某个属性变化的时候会通知使用这个属性的所有页面更新这个值
  state:{
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
  },
  //同步操作（改变state一定是通过mutations）,Vuex要求mutation中的方法必须是同步方法 -> 主要原因是devtools工具可以捕捉跟踪每次快照
  mutations:{
    //方法 ->固定传入 state |（函数分为两部分：左边叫事件类型，右边叫回调函数）
    [INCREMENT](state){
      state.counter ++
    },
    decrement(state){
      state.counter --
    },

    //外部传入自定义递增数值
    incrementCount(state,payload){
      // console.log(count)
      state.counter += payload.count
    },

    //把外部传入的一个对像添加到state.students数组
    addStudent(state,stu){
      state.students.push(stu)
    },

    //更新info数据
    updateInfo(state){
      // 【 基本用法 】
      state.info.name = 'Aron'


      // 【 添加 】
      // 1.所有响应的前提是在store中初始化好所需的属性，所以此种“增加”方式它不在响应式系统里面，界面是不会跟着刷新的;
      // state.info['address'] = '洛杉矶'  
      // 2.想要解决在“state”中未初始化，后续“添加”属性也能支持响应式（添加至响应式系统），那么就得用到之前课堂中学习的知识点：1.Vue操作数组|对象 - > push pop splice ... 2.Vue.set(this.xxx,0,'xxx');
      // Vue.set(state.info,'address','洛杉矶') //添加属性到响应式系统

      // 【 删除 】
      // 1.该方式做不到响应式
      // delete state.info.age
      // 2.响应式方法
      // Vue.delete(state.info,'age')
    }

  },
  //异步操作 - > Action类似于Mutation,但是用来代替Mutation进行异步操作的，处理完成后再通过“Mutation”去改“state”（actions -> mutations -> state）
  actions:{
    // context: 上下文 -> 暂时理解为“store”对象
    // 1.携带的参数和回调写在一起了 -> 不够优雅
    // aUpdateInfo(context,payload){ 
    //   setTimeout(() => {
    //     context.commit('updateInfo')
    //     console.log(payload.message)
    //     payload.success()
    //   },1000)
    // },

    // 2.优雅写法 -> promise
    aUpdateInfo(context,payload){
      return new Promise((resolve,reject) => {
        setTimeout(() => {
          context.commit('updateInfo');
          console.log(payload);
          resolve('resolve回调成功')
        },1000)
      })
    }
  },

  //和计算属性很像
  getters:{
    //计算平方
    powerCounter(state){
      return state.counter * state.counter
    },
    //过滤超过20岁的数据
    more20stu(state){
      return state.students.filter(s => s.age > 20)
    },
    //超过20岁的有几个
    more20stuLength(state,getters){
      return getters.more20stu.length
    },

    //返回一个函数外部传入age，过滤超过age的数据
    moreAgeStu(state){
      // return function(age){
      //   return state.students.filter(s => s.age > age)
      // }
      return age => {
        return state.students.filter(s => s.age > age)
      }
    }
  },
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