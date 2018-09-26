<template>
  <v-container id="container">
    <h1>LOGIN</h1>
    <v-alert v-if="error" :value="true" type="error" transition="scale-transition">
      {{ msgError }}
    </v-alert>
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field v-model="email" :rules="emailRules" label="E-mail"></v-text-field>
      <v-text-field v-model="password" :rules="passwordRules" label="Password" type="password"></v-text-field>
      <v-layout row>
        <v-btn :disabled="!valid" @click="submit">
          submit
        </v-btn>
        <div class="g-signin2" id="google-signin-button"></div>
      </v-layout>

    </v-form>
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>
            Message
          </v-card-title>

          <v-card-text>
            <v-alert :value="true" color="success" icon="new_releases">
              Successfully Login
            </v-alert>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="dialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios'

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default {
  async mounted () {
    await sleep(500)
    gapi.signin2.render('google-signin-button', {
      onsuccess: this.onSignIn
    })
  },
  data: () => ({
    valid: true,
    email: '',
    emailRules: [
      v => /.+@.+/.test(v) || 'E-mail must be valid'
    ],
    password: '',
    passwordRules: [
      v => (v && v.length >= 6) || 'Password must be greater than 6 characters'
    ],
    dialog: false,
    msgError: '',
    error: false
  }),
  methods: {
    onSignIn (googleUser) {
      // console.log()
      this.$store.dispatch('auth2Google', gapi.auth2)

      var profile = googleUser.getBasicProfile()
      axios({
        url: 'http://localhost:3000/signin-other',
        method: 'post',
        data: {
          name: profile.getName(),
          email: profile.getEmail()
        }
      })
        .then(({ data }) => {
          this.dialog = true
          gapi.auth2.getAuthInstance().signOut().then(function () {
            localStorage.setItem('token', data.token)
            localStorage.setItem('name', data.name)
            localStorage.setItem('email', data.email)
          })
        })
        .catch(({ response }) => {
          console.log(response)
        })
    },
    submit () {
      this.error = false
      if (this.$refs.form.validate()) {
        axios({
          url: 'http://localhost:3000/signin',
          method: 'post',
          data: {
            email: this.email,
            password: this.password
          }
        })
          .then(response => {
            this.dialog = true
            let output = response.data
            localStorage.setItem('token', output.token)
            localStorage.setItem('name', output.name)
            localStorage.setItem('email', output.email)
          })
          .catch(({ response }) => {
            this.msgError = response.data.message
            this.error = true
          })
      }
    },
    clear () {
      this.$refs.form.reset()
    }
  },
  watch: {
    dialog (val) {
      if (!val) {
        window.location.replace('/')
      }
    }
  },
  created () {
    if (this.$store.state.token) {
      this.$router.replace({ path: '/' })
    }
  }
}
</script>

<style>

</style>
