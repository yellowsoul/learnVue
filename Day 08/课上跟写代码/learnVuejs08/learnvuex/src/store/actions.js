export default {
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
}