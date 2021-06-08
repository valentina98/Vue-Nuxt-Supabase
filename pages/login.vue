<template>
  <v-container>
    <h1>Login</h1>
    <UserAuthForm buttonText="Login" :submitForm="loginUser" />
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
