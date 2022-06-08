export default {
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