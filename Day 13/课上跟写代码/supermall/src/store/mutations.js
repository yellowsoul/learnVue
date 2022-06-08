import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types' //mutations - 类型常量（官方推荐使用）

export default {

    // mutations唯一的目的就是修改state中的状态
    // mutations中的每一个方法尽可能完成的事件比较单一一点
    // 官方推荐用actions，它不止是操作异步的一些方法，比较复杂的判断也可以推荐放在里面操作；
    // addToCart(state, payload){
      //...
    // }
    
    [ADD_COUNTER](state,payload){
      payload.count ++
    },
    [ADD_TO_CART](state,payload){
      payload.checked = true
      state.cartList.push(payload)
    }
    

}