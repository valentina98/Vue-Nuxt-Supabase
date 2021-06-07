<template>
  <div class="d-flex flex-row align-center" >
    <v-checkbox class="pa-2" v-model="todo.completed" @change="doneEditTodo" />
    <div class="pa-2">
      <div
        v-if="!editing"
        :class='[{"text-decoration-line-through": todo.completed}]'
        @dblclick="editTodo"
      >
        {{ todo.title }}
      </div>
      <v-text-field
        hide-details
        v-else
        v-focus
        v-model="todo.title"
        type="text"
        @blur="doneEditTodo"
        @keyup.enter="doneEditTodo"
        outlined
        @keyup.esc="cancelEdit"
      />
    </div>
    <v-spacer></v-spacer>
    <v-btn color="primary" icon @click="removeTodo(todo.id)">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </div>
</template>

<script>
import {todoService} from "~/mixins/todo.service";

export default {
  name: 'TodoItem',
  directives: {
    focus: {
      inserted(el) {
        el.focus()
      },
    },
  },
  mixins: [todoService],
  props: {
    todo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      beforeEditCache: '',
      editing: false,
    }
  },
  methods: {
    editTodo() {
      this.beforeEditCache = this.todo.title
      this.editing = true
    },
    doneEditTodo() {
      if (this.todo.title.trim().length === 0) {
        // if empty
        this.todo.title = this.beforeEditCache
      }

      this.editing = false

      this.finishedEdit(this.todo)
    },
    cancelEdit() {
      this.todo.title = this.beforeEditCache
      this.editing = false
    },
  },
}
</script>

