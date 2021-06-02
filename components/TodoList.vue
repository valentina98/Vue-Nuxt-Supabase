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
    ></todo-item>
    <v-divider></v-divider>
    <div class="extra-container pa-5 d-flex">
      <v-checkbox
        v-model="checkedAll"
        label="Check all"
        @change="checkAllTodos"
      />
      <div class="pa-5">{{ remaining }} items left</div>
    </div>
    <v-divider></v-divider>
    <div class="extra-container">
      <div>
        <v-btn
          depressed
          elevation="2"
          :color="isActive('all')"
          @click="filter = 'all'"
        >
          All
        </v-btn>
        <v-btn
          depressed
          elevation="2"
          :color="isActive('active')"
          @click="filter = 'active'"
        >
          Active
        </v-btn>

        <v-btn
          depressed
          elevation="2"
          :color="isActive('completed')"
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
import { todoService } from '~/mixins/todo.service'

export default {
  name: 'TodoList',
  components: {
    TodoItem,
  },
  mixins: [todoService],
  data() {
    return {
      database: null,
      todos: [],
      subscriptionTodos: undefined,
      newTodo: '',
      beforeEditCache: '',
      filter: 'all',
      checkedAll: false,
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
      } else {
        return []
      }
    },
    showClearCompletedButton() {
      return this.todos.filter((todo) => todo.completed).length > 0
    },
  },
  async created() {
    this.todos = await this.fetchTodos()
    this.subscribeTodos()
  },
  destroyed() {
    this.$db.removeSubscription(this.subscriptionTodos)
  },
  methods: {
    isActive(name) {
      return this.filter === name ? 'primary' : ''
    },
    async addTodo() {
      if (this.newTodo.trim().length === 0) return

      await this.createTodo(this.newTodo)

      // clear the input field
      this.newTodo = ''
    },
    checkAllTodos() {
      this.todos.forEach((todo) => {
        todo.completed = !!this.checkedAll
        this.finishedEdit({ todo })
      })
    },
    clearCompleted() {
      const completedTodos = this.todos.filter((todo) => todo.completed)
      completedTodos.forEach((todo) => this.removeTodo(todo.id))
    },

    // TODO: fix that mess
    subscribeTodos() {
      this.subscriptionTodos = this.$db
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
  },
}
</script>
