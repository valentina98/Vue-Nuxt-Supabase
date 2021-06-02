<template>
  <div class="todo-item">
    <div class="todo-item-left">
      <v-checkbox v-model="todoItem.completed" @change="doneEditTodo" />
      <div
        v-if="!todo.editing"
        class="todo-item-label"
        :class="{ completed: todo.completed }"
        @dblclick="editTodo"
      >
        {{ todoItem.title }}
      </div>
      <v-text-field
        v-else
        v-focus
        v-model="todoItem.title"
        type="text"
        @blur="doneEditTodo"
        @keyup.enter="doneEditTodo"
        outlined
        @keyup.esc="cancelEdit"
      />
    </div>
    <v-btn color="primary" icon class="remove-item" @click="removeTodo(index)">
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
    index: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      beforeEditCache: '',
      todoItem: null,
    }
  },
  watch: {
    todo: {
      deep: true,
      handler() {
        this.finishedEdit(this.todoItem)
      },
    },
  },
  created() {
    this.todoItem = this.todo
  },
  methods: {
    removeTodo(index) {
      this.$emit('removedTodo', index)
    },
    editTodo() {
      this.beforeEditCache = this.todoItem.title
      this.todoItem.editing = true
    },
    async doneEditTodo() {
      if (this.todoItem.title.trim().length === 0) {
        // if empty
        this.todoItem.title = this.beforeEditCache
      }

      this.todoItem.editing = false

      await this.finishedEdit(this.todoItem)
    },
    cancelEdit() {
      this.todoItem.title = this.beforeEditCache
      this.todoItem.editing = false
    },
  },
}
</script>

<style>
.todo-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.remove-item {
  cursor: pointer;
  margin-left: 14px;
}
.todo-item-left {
  display: flex;
  align-items: center;
}
.todo-item-label,
.todo-item-edit {
  font-size: 18px;
  padding: 10px;
  margin-left: 12px;
}
.todo-item-edit {
  width: 100%;
  border: 1px solid #ccc;
}
</style>
