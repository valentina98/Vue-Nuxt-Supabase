<template>
  <div class="todo-item">
    <div class="todo-item-left">
      <input v-model="completed" type="checkbox" @change="doneEditTodo" />
      <div
        v-if="!editing"
        class="todo-item-label"
        :class="{ completed: completed }"
        @dblclick="editTodo"
      >
        {{ title }}
      </div>
      <input
        v-else
        v-model="title"
        v-focus
        type="text"
        class="todo-item-edit"
        @blur="doneEditTodo"
        @keyup.enter="doneEditTodo"
        @keyup.esc="cancelEdit"
      />
    </div>
    <div class="remove-item" @click="removeTodo(index)">&times;</div>
  </div>
</template>

<script>
export default {
  name: 'TodoItem',
  directives: {
    focus: {
      inserted(el) {
        el.focus()
      },
    },
  },
  props: {
    todo: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    checkAll: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      id: this.todo.id,
      title: this.todo.title,
      completed: this.todo.completed,
      editing: this.todo.editing,
      beforeEditCache: '',
    }
  },
  watch: {
    checkAll() {
      if (this.checkAll) {
        this.completed = true
      } else {
        this.completed = this.todo.completed
      }
    },
  },
  methods: {
    removeTodo(index) {
      this.$emit('removedTodo', index)
    },
    editTodo() {
      this.beforeEditCache = this.title
      this.editing = true
    },
    doneEditTodo() {
      if (this.title.trim().length === 0) {
        // if empty
        this.title = this.beforeEditCache
      }
      this.editing = false

      this.$emit('finishedEdit', {
        index: this.index,
        todo: {
          id: this.id,
          title: this.title,
          completed: this.completed,
          editing: this.editing,
        },
      })
    },
    cancelEdit() {
      this.title = this.beforeEditCache
      this.editing = false
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
button {
  font-size: 14px;
  background-color: white;
  appearance: none;
}
</style>
