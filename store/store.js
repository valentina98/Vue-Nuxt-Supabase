import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
// import Cookies from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: '',
    loggedIn: false,
    snackbarContent: '',
    snackbarColor: ''
  },
  mutations: {
    setLoggedIn (state, loggedIn) {
      state.loggedIn = loggedIn
    },
    setUser (state, user) {
      state.user = user
    },
  },
  actions: {
    login ({ commit }, user) {
      commit('setLoggedIn', true)
      commit('setUser', user)
    },
    logout ({ commit }) {
      commit('setLoggedIn', false)
      commit('setUser', '')
    },
    showSnackbarMessage (state, payload) {
      state.snackbarContent = payload.content
      state.snackbarColor = payload.color
    },
  },
  plugins: [new VuexPersistence().plugin]
})
