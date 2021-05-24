import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from './utils/axios'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import '../src/assets/styles/common.less'
import userData from './utils/userdata'
Vue.use(ViewUI)
Vue.config.productionTip = false
Vue.prototype.$axios = Axios
Vue.prototype.$store = store
Vue.prototype.$UserData = userData
router.beforeEach((to, from, next) => {
  const userdata = userData.getUserData()
  const datas = JSON.parse(userdata)
  if (to.path !== '/' && !datas) {
    next({
      path: '/'
    })
  } else {
    if (to.path === '/' && datas) {
      next({
        path: '/index'
      })

    } else {
      next()
    }
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')