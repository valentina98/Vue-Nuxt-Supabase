export const todoService = {
  methods: {
    async removeTodo(index) {
      const { response, error } = await this.$db
        .from('todos')
        .delete()
        .match({ id: index })
    },
    async fetchTodos() {
      const { error, data } = await this.$db.from('todos').select().order('id')

      if (error) {
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
    },
  },
}
