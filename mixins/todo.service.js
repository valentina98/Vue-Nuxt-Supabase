import store from '~/store/store'

export const todoService = {
  store,
  methods: {
    /**
     * @param todo.id
     * @returns {Promise<void>}
     */
    async removeTodo(index) {
      const { response, error } = await this.$db
        .from('todos')
        .delete()
        .match({ id: index })

      if(error){
        this.$notifier.showMessage({ content: "An error occured!", color: 'error' })
      }
    },
    /**
     * @param -
     * @returns {Promise<todos[]>}
     */
    async fetchTodos() {
      const { error, data } = await this.$db.from('todos').select().order('id')

      if (error) {
        this.$notifier.showMessage({ content: "An error occured!", color: 'error' })
        return
      }

      return data
    },
    /**
     * @param todo
     * @returns {Promise<void>}
     */
    async createTodo(todo) {
      const { response, error } = await this.$db.from('todos').insert([
        {
          title: todo,
          completed: false,
        },
      ])

      if (error) {
        this.$notifier.showMessage({ content: "An error occured!", color: 'error' })
      }
    },
    /**
     * @param todo
     * @returns {Promise<void>}
     */
    async finishedEdit(todo) {
      const { response, error } = await this.$db
        .from('todos')
        .update(todo)
        .eq('id', todo.id)

      if (error) {
        this.$notifier.showMessage({ content: "An error occured!", color: 'error' })
      }
    },
    /**
     * @param user.email
     * @returns {Promise<void>}
     */
    async loginUser(loginInfo) {
      const {user, session, error} = await this.$db.auth.signIn(
        loginInfo
      )
      if(error) {
        this.$notifier.showMessage({ content: "An error occured!", color: 'error' })
      }
      else {
        this.$store.dispatch('login', user.email)
        window.location.assign('../')
        console.log(this.$store.state)
        this.$notifier.showMessage({ content: "You logged in.", color: 'success' })
      }
    },
    /**
     * @param -
     * @returns {Promise<void>}
     */
    async logoutUser() {
      const { error } = await this.$db.auth.signOut()
      if(error) {
        this.$notifier.showMessage({ content: "An error occured!", color: 'error' })
      }
      else {
        this.$store.dispatch('logout')
        this.$notifier.showMessage({ content: "You logged out.", color: 'success' })
      }
    },
    /**
     * @param {email: '', password: ''}
     * @returns {Promise<void>}
     */
    async registerUser(registrationInfo) {
      const {user, session, error} = await this.$db.auth.signUp(
        registrationInfo
      )
      if(error) {
        this.$notifier.showMessage({ content: "An error occured!", color: 'error' })
      }
      else {
        window.location.assign('../')
        this.$notifier.showMessage({ content: "You need to confirm your email and log in.", color: 'success' })
      }
    },

  },
}
