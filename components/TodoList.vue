<template>
  <div>
    <v-text-field
      v-model="newTodo"
      type="text"
      placeholder="What should I do"
      @keyup.enter="addTodo"
    ></v-text-field>

    <v-sheet
      class="pa-5"
      v-if=loadingPage
    >
      <v-skeleton-loader
        class="mx-auto"
        type="list-item-three-line"
      ></v-skeleton-loader>
    </v-sheet>

    <todo-item
      v-for="(todo, index) in todosFiltered"
      :key="todo.id"
      :todo="todo"
      :index="index"
      :check-all="!anyRemaining"
      @removedTodo="removeTodo($event)"
    ></todo-item>
    <v-divider class="pa-2"></v-divider>
    <div class="d-flex justify-space-between pa-5">
      <v-checkbox
        v-model="checkedAll"
        label="Check all"
        @change="checkAllTodos"
      />
      <div class="pa-5">{{ remaining }} items left</div>
    </div>
    <v-divider class="pa-2"></v-divider>
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
      filter: 'all',
      checkedAll: false,
      snackbar: false,
      loadingPage: true,
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
      // show that button only if there is a completed todo
      return this.todos.filter((todo) => todo.completed).length > 0
    },
  },
  async created() {
    this.todos = await this.fetchTodos()
    this.subscribeTodos()

    // remove loader
    this.loadingPage = false
  },
  destroyed() {
    this.$db.removeSubscription(this.subscriptionTodos)
  },
  methods: {
    isActive(name) {
      // change the active filter button color
      return this.filter === name ? 'primary' : ''
    },
    async addTodo() {
      // if empty don't add it
      if (this.newTodo.trim().length === 0) return

      // create the item
      await this.createTodo(this.newTodo)

      // clear the input field
      this.newTodo = ''
    },
    checkAllTodos() {
      // loop through of the todos and mark all of them as completed
      this.todos.forEach((todo) => {
        // checkedAll is the value of the checkbox 'Check all'
        todo.completed = this.checkedAll
        this.finishedEdit( todo )
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
