import Vue from 'vue'
import App from './App'

import axios from 'axios'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  render: h => h(App)
})


// 1.axios的基本使用
// axios({
//   url:'http://123.207.32.32:8000/home/multidata',
//   method:'get'
// }).then(res => {
//   console.log(res);
// })

// axios({
//   url:baseURL+'/home/data',
//   //专门针对get请求的参数拼接
//   params:{
//     type:'pop',
//     page:1
//   }
// }).then(res => {
//   console.log(res);
// })


// 2.axios发送并发请求
// axios.all([
//   axios({
//     url:'http://123.207.32.32:8000/home/multidata'
//   }),
//   axios({
//     url:baseURL+'/home/data',
//     params:{
//       type:'sell',
//       page:5
//     }
//   })
// ]).then(results => {
//   console.log(results)
//   console.log(results[0])
//   console.log(results[1])
// })


// 3.使用全局的axios和对应的配置在进行网络请求
// axios.defaults.baseURL = 'http://152.136.185.210:7878/api/hy66'
// axios.defaults.timeout = 5000
// axios.all([
//   axios({
//     url:'/home/multidata'
//   }),
//   axios({
//     url:'/home/data',
//     params:{
//       type:'sell',
//       page:5
//     }
//   })
// ]).then(axios.spread((res1,res2) => { //axios提供了这个方法，将数组展开，结果单独的拿出来（个人还是感觉上一种好用些）
//   console.log(res1)
//   console.log(res2)
// }))

// axios({
//   url:'/category'
// })



// 4.创建对应的axios的实例
// const instance1 = axios.create({
//   baseURL:'http://152.136.185.210:7878/api/hy66',
//   timeout:5000
// })
// instance1({
//   url:'/home/multidata'
// }).then(res => {
//   console.log(res)
// })

// instance1({
//   url:'/home/data',
//   params:{
//     type:'pop',
//     page:1
//   }
// }).then(res => {
//   console.log(res)
// })

// // 在真实开发时可能会有多个请求接口，使用每个实例都有独立的配置，
// const instance2 = axios.create({
//   baseURL:'http://222.111.333.333:7878/api/hy66',
//   timeout:10000
// })


// 5.封装requset模块
import { request } from './network/request';

// request({
//   url:'/home/multidata'
// },res => {
//   console.log(res)
// },err => {
//   console.log(err)
// })


// request({
//   baseConfig:{
//     url:'/home/multidata'
//   },
//   success(res){
//     console.log(res)
//   },
//   failure(err) {
//     console.log(err)
//   }
// })

request({
  url:'/home/multidata'
}).then(res => {
  console.log(res)
}).catch(err => {
  // console.log(err)
})

/**
 * 旧：
 * url:服务器接口 -> 首页数据
 * 123.207.32.32:8000/home/multidata
 * 不支持post请求
 * 支持跨域jsonp,(url?callback=json123)
 * 
 * url: -> 列表
 * 123.207.32.32:8000/home/data?type=pop&page=1
 * http://123.207.32.32:8000/home/data?type=sell&page=1
 * 
 */



/**
 * 最新接口地址：
 * baseURL = "http://152.136.185.210:7878/api/hy66" 
 * http://152.136.185.210:7878/api/hy66/home/data?type=pop&page=1
 */