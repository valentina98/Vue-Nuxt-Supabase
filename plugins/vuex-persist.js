import VuexPersistence from 'vuex-persist';
import Cookies from 'js-cookie'

export default ({ store }) => {
  new VuexPersistence({
    restoreState: (key, storage) => Cookies.getJSON(key),
    saveState: (key, state, storage) =>
      Cookies.set(key, state, {
        expires: 3
      })
  }).plugin(store);
};
