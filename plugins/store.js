import Vue from 'vue'
import Vuex, { Payload, Store } from 'vuex'
import VuexPersistence from 'vuex-persist'
import Cookies from 'js-cookie'

Vue.use(Vuex)

const store = new Vuex.Store({
   state: {
    user: '',
    navigation: { path: '/' }
  },
  plugins: [new VuexPersistence().plugin]
})

export default store
