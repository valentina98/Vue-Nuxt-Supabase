<template>
  <v-container>
    <h1>Register</h1>
    <UserAuthForm buttonText="Register" :submitForm="registerUser" />
  </v-container>
</template>

<script>
import UserAuthForm from '~/components/UserAuthForm'
import { todoService } from '~/mixins/todo.service'

export default {
  components:{
    UserAuthForm,
  },
  mixins: [todoService],
}
</script>
