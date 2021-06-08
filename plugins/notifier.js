
export default ({ app, store }, inject) => {
  inject('notifier', {
    showMessage ({ content = '', color = '' }) {
      // store.commit('showSnackbarMessage', { content, color })
      store.dispatch('showSnackbarMessage', { content, color })
    }
  })
}
