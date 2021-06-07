export const todoService = {
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
        this.$notifier.showMessage({ content: errorMessage, color: 'error' })
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
        this.$notifier.showMessage({ content: errorMessage, color: 'error' })
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
        this.$notifier.showMessage({ content: errorMessage, color: 'error' })
      }
    },

  },
}
