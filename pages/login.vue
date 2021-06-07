<template>
  <v-container>
    <h1>Login</h1>
    <UserAuthForm buttonText="Login" :submitForm="loginUser" />
  </v-container>
</template>

<script>
  import UserAuthForm from '~/components/UserAuthForm'
  import { store } from '~/plugins/store'
  import VuexPersistence from 'vuex-persist'

  export default {
    components:{
      UserAuthForm,
    },
    methods: {
      async loginUser(loginInfo) {
        const {user, session, error} = await this.$db.auth.signIn(
          loginInfo
        )
        console.log({user, session, error})
        this.store.setItem('user',user)
        console.log(this.store)
      },
    }
  }

</script>
