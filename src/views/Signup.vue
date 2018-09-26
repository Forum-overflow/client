<template>
  <v-container id="container">
    <h1>SIGNUP</h1>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field v-model="name" :rules="nameRules" label="Name" required></v-text-field>
      <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
      <v-text-field v-model="password" :rules="passwordRules" label="Password" type="password" required></v-text-field>
      <v-btn :disabled="!valid" @click="submit">
        submit
      </v-btn>
      <v-btn @click="clear">clear</v-btn>
    </v-form>
  </v-container>
</template>
<script>
import axios from 'axios'

export default {
  data: () => ({
    valid: true,
    name: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 10) || 'Name must be less than 10 characters'
    ],
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+/.test(v) || 'E-mail must be valid'
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 6) || 'Password must be greater than 6 characters'
    ]
  }),

  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        axios({
          url: 'http://localhost:3000/signup',
          method: 'post',
          data: {
            name: this.name,
            email: this.email,
            password: this.password
          }
        })
          .then(response => {
            this.clear()
            this.$router.push('/login')
          })
          .catch(err => {
            alert(JSON.stringify(err))
          })
      }
    },
    clear () {
      this.$refs.form.reset()
    }
  },
  created () {
    if (localStorage.getItem('token')) {
      this.$router.replace('/')
    }
  }
}
</script>

<style>

</style>
