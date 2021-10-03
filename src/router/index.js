import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'app',
    redirect: '/login'
  },{
    path: '/login',
    name: 'login',
    component: () => import('../components/Login.vue')
  },{
    path: '/home',
    name: 'home',
    redirect:'/welcome',
    component: () => import('../components/Home.vue'),
    children:[{
        path: '/welcome',
        name: 'welcome',
        component: () => import('../components/Welcome.vue'),
      },{
        path: '/users',
        name: 'users',
        component: () => import('../components/user/Users.vue'),
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

// to将要访问的路径
// from代表从哪个路径跳转而来
// next是一个函数，表示放行
router.beforeEach((to, from, next) => {
  // 如果用户访问的登录页，直接放行
  if (to.path === '/login') return next()
  // 从sessionstorage中获取到保存的token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token，强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
