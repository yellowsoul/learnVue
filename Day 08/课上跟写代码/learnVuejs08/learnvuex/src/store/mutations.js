import { INCREMENT } from "./mutations-types" //类型常量（官方推荐使用）
export default {
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

}