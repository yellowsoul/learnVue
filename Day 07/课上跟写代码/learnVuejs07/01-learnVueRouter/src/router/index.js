//配置路由相关的信息
import Vue from 'vue'
import VueRouter from 'vue-router'

// import Home from '../components/Home.vue'
// import About from '../components/About.vue'
// import User from '../components/User.vue'

//路由懒加载
const Home = () => import('../components/Home')
const HomeNews = () => import('../components/HomeNews')
const HomeMessage = () => import('../components/HomeMessage')
const About = () => import('../components/About')
const User = () => import('../components/User')
const Profile = () => import ('../components/Profile')

//1.通过Vue.use(插件)，安装插件
Vue.use(VueRouter)

//2.创建VueRouter对象
const routes = [
  {
    path:'/',
    //redirect重定向：
    redirect:'/home'
  },
  {
    path:'/home',
    component:Home,
    meta:{
      title:'首页'
    },
    children:[
      // {
      //   path:'',
      //   redirect:'news'
      // },
      {
        path:'news',
        component:HomeNews
      },
      {
        path:'message',
        component:HomeMessage
      }
    ]
  },
  {
    path:'/about',
    component:About,
    meta:{
      title:'关于'
    },
    beforeEnter:(to, form, next) => {
      // ...路由独享守卫，在用户访问该页面（before）之前时可能需要登录才能访问，那就可以使用条件判断是否登录，使用next({path:'/'})
      // console.log('about beforeEach')
      next()
    }
  },
  {
    path:'/user/:id',
    component:User,
    meta:{
      title:'用户'
    }
  },
  {
    path:'/profile',
    component:Profile,
    meta:{
      title:'档案'
    }
  }
]
const router = new VueRouter({
  //配置路由和组件之间的应用关系
  routes,
  mode:'history',
  linkActiveClass:'active'
})

//全局导航守卫  前置钩子（hook）-> 跳转之前进行的回调
//前置守卫(guard)
router.beforeEach((to,from,next) => {
  //从from跳转到to
  document.title = to.matched[0].meta.title;
  // console.log(to);
  // console.log('++++')
  next()
})

//后置钩子(hook) ->  跳转之后进行的回调
router.afterEach((to, from) => {
  // console.log('----')
})

//3.将router对象传入到Vue实例中
export default router