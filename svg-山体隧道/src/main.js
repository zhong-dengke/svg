import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from './utils/axios'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import '../src/assets/styles/common.less'
Vue.use(ViewUI)
Vue.config.productionTip = false
Vue.prototype.$axios = Axios
Vue.prototype.$store = store

router.beforeEach((to, from, next) => {
  console.log('to', to)
  if (to.fullPath === '/index' || to.fullPath === '/') {
    store.commit('setShowState', false)
  } else {
    store.commit('setShowState', true)
  }
  next();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
