<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title>Todo List</v-card-title>
        <v-card-text>
          <todo-list></todo-list>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import TodoList from '~/components/TodoList'

export default {
  components: {
    TodoList,
  },
}
</script>
