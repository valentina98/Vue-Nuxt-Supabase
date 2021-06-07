<template>
  <v-container>
    <h1>Register</h1>
    <UserAuthForm buttonText="Register" :submitForm="registerUser" />
  </v-container>
</template>

<script>
  import UserAuthForm from '~/components/UserAuthForm'

  export default {
    components:{
      UserAuthForm,
    },
    methods: {
      async registerUser(registrationInfo) {
        const {user, session, error} = await this.$db.auth.signUp(
          registrationInfo
        )
        console.log({user, session, error})
      },
    }
  }

</script>
