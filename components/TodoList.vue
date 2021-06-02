<template>
  <div>
    <v-text-field
      v-model="newTodo"
      type="text"
      class="todo-input"
      placeholder="What should I do"
      @keyup.enter="addTodo"
    ></v-text-field>
    <todo-item
      v-for="(todo, index) in todosFiltered"
      :key="todo.id"
      :todo="todo"
      :index="index"
      :check-all="!anyRemaining"
      @removedTodo="removeTodo($event)"
      @finishedEdit="finishedEdit"
    ></todo-item>

    <div class="extra-container">
      <div>
        <label>
          <input
            type="checkbox"
            :checked="!anyRemaining"
            @change="checkAllTodos"
          />
          Check all
        </label>
      </div>
      <div>{{ remaining }} items left</div>
    </div>

    <div class="extra-container">
      <div>
        <v-btn
          depressed
          elevation="2"
          :class="{ active: filter == 'all' }"
          @click="filter = 'all'"
        >
          All
        </v-btn>
        <v-btn
          depressed
          elevation="2"
          :class="{ active: filter == 'active' }"
          @click="filter = 'active'"
        >
          Active
        </v-btn>

        <v-btn
          depressed
          elevation="2"
          :class="{ active: filter == 'completed' }"
          @click="filter = 'completed'"
        >
          Completed
        </v-btn>
      </div>
      <div>
        <v-btn
          v-if="showClearCompletedButton"
          depressed
          elevation="2"
          @click="clearCompleted"
        >
          Clear completed
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import TodoItem from './TodoItem'
import DatabaseService from './Database.service'

export default {
  name: 'TodoList',
  components: {
    TodoItem,
  },
  data() {
    return {
      database: null,
      todos: [],
      subscriptionTodos: undefined,
      newTodo: '',
      beforeEditCache: '',
      filter: 'all',
    }
  },
  computed: {
    remaining() {
      return this.todos.filter((todo) => !todo.completed).length
    },
    anyRemaining() {
      return this.remaining !== 0
    },
    todosFiltered() {
      if (this.filter === 'all') {
        return this.todos
      } else if (this.filter === 'active') {
        return this.todos.filter((todo) => !todo.completed)
      } else if (this.filter === 'completed') {
        return this.todos.filter((todo) => todo.completed)
      }
    },
    showClearCompletedButton() {
      return this.todos.filter((todo) => todo.completed).length > 0
    },
  },
  created() {
    const database = new DatabaseService()
    this.database = database.getInstance()
  },
  async mounted() {
    await this.fetchTodos()
    this.subscribeTodos()
  },
  destroyed() {
    this.unsubscribeTodos()
  },
  methods: {
    async addTodo() {
      if (this.newTodo.trim().length === 0) {
        // if empty
        return
      }
      const { response, error } = await this.database.from('todos').insert([
        {
          title: this.newTodo,
          completed: false,
        },
      ])
      this.newTodo = ''
    },
    async removeTodo(index) {
      console.log(index)
      // const { response, error } = await this.database
      //   .from('todos')
      //   .delete()
      //   .match({ id: index })
    },
    checkAllTodos() {
      this.todos.forEach((todo) => {
        todo.completed = event.target.checked
        this.finishedEdit({ todo })
      })
    },
    clearCompleted() {
      const completedTodos = this.todos.filter((todo) => todo.completed)
      completedTodos.forEach((todo) => this.removeTodo(todo.id))
    },
    async finishedEdit(data) {
      // console.log(data.todo)

      const { response, error } = await this.database
        .from('todos')
        .update(data.todo)
        .eq('id', data.todo.id)
    },

    async fetchTodos() {
      const { error, data } = await this.database
        .from('todos')
        .select()
        .order('id')

      if (error) {
        console.error(error)
        return
      }

      this.setTodos(data)
    },
    setTodos(todos) {
      this.todos = todos
    },
    subscribeTodos() {
      this.subscriptionTodos = this.database
        .from('todos')
        .on('INSERT', (payload) => {
          console.log('Change received!', payload.new)
          this.todos.push(payload.new)
        })
        .on('UPDATE', (payload) => {
          console.log('Change received!', payload)
          const elementPos = this.todos
            .map(function (x) {
              return x.id
            })
            .indexOf(payload.new.id)
          // const objectFound = this.todos[elementPos]
          this.todos.splice(elementPos, 1, payload.new)
        })
        .on('DELETE', (payload) => {
          console.log('Change received!', payload)
          const elementPos = this.todos
            .map(function (x) {
              return x.id
            })
            .indexOf(payload.new.id)
          this.todos.splice(elementPos, 1)
        })
        .subscribe()
    },
    unsubscribeTodos() {
      this.database.removeSubscription(this.subscriptionTodos)
    },
  },
}
</script>

<style>
.todo-input {
  width: 100%;
  padding: 10px 18px;
  font-size: 18px;
  margin-bottom: 16px;
}
.extra-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  border-top: 1px solid black;
  padding-top: 14px;
  margin-bottom: 14px;
}
</style>
