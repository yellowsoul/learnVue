export default {
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
}