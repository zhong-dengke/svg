import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showState: true,
    tunnelId: 'dsds21a234545s4d4s21d545d4s',
  },
  mutations: {
    setShowState(state, payLoad) {
      state.showState = payLoad;
    },
    setTunnelId(state, payLoad) {
      state.tunnelId = payLoad;
    },
  },
  actions: {
  },
  modules: {
  }
})
