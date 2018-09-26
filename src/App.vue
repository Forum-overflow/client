<template>
  <v-app>
    <v-toolbar color="#26BCB0" fixed>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn to="/" flat>Home</v-btn>
        <v-btn to="/about" flat>About</v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-title v-if="token">Welcome {{ name }}</v-toolbar-title>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn to="/login" v-if="!token" flat>Login</v-btn>
        <v-btn to="/signup" v-if="!token" flat>Sign Up</v-btn>
        <v-btn v-if="token" @click="logout" flat>Logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content  class="content" >
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      token: localStorage.getItem('token'),
      name: localStorage.getItem('name')
    }
  },
  methods: {
    logout () {
      localStorage.clear()
      // this.$store.state.auth2.signOut().then(function () {
      //   console.log('User signed out.');
      // });
      window.location.replace('/')
    }
  }
}
</script>

<style>
#container {
  width: 50%;
}
.content {
  margin-top: 70px;
  background-color: #EAEDF1;
}
</style>
