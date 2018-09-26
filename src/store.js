import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
    emailUser: localStorage.getItem('email'),
    auth2: localStorage.getItem('auth2')
  },
  mutations: {
    loginGoogle (state, param) {
      state.auth2 = param
    }
  },
  actions: {
    auth2Google (context, param) {
      context.commit('loginGoogle', param)
    }
  }
})
