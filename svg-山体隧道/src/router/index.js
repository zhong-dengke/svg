import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  // 首页
  {
    path: '/index',
    name: 'index',
    component: () => import('../views/index')
  },
  {
    path: '/',
    name: 'login',
    component: () => import( /* webpackChunkName: "about" */ '../views/login')
  },
  // 配置页
  {
    path: '/projectManage',
    name: 'projectManage',
    redirect:'/projectManage/baseCfg',
    component: () => import('../views/projectManage'),
    children: [{
      path: 'baseCfg',
      name: 'baseCfg',
      component: () => import('../views/projectManage/components/baseCfg.vue'),
    }]
  },
  // 数字地图
  {
    path: '/digitalMap',
    name: 'digitalMap',
    component: () => import('../views/digitalMap')
  },
   // 重定向
   {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router