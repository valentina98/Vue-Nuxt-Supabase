export const state = () => ({
  user: '',
  loggedIn: false,
})

export const mutations = {
  SET_LOGGED_IN (state, loggedIn) {
    state.loggedIn = loggedIn
  },
  SET_USER (state, user) {
    state.user = user
  },
}

export const actions = {
  login ({ commit }, user) {
    commit('SET_LOGGED_IN', true)
    commit('SET_USER', user)
  },
  logout ({ commit }) {
    commit('SET_LOGGED_IN', false)
    commit('SET_USER', '')
  },
}
