<template>
  <v-container id="container">
    <center><h1>Add Post</h1></center>
    <v-text-field v-model="title" label="Title"></v-text-field>
    <v-textarea name="input-7-1" required v-model="description" label="Question" hint="Make sure the question is clear"></v-textarea>
    <v-layout row right>
      <v-btn :disabled="!valid" dark color="orange darken-1" v-on:click="submit">Submit</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      title: '',
      description: '',
      valid: false,
      token: null
    }
  },
  watch: {
    title (newTitle) {
      if (newTitle.length >= 1) {
        this.valid = true
      } else {
        this.valid = false
      }
    }
  },
  methods: {
    submit () {
      axios({
        url: 'http://localhost:3000/post',
        method: 'post',
        data: {
          title: this.title,
          description: this.description
        },
        headers: {
          "token": this.token
        }
      })
        .then(({ body }) => {
          this.$router.push({ path: '/' })
        })
        .catch(err => {
          alert(JSON.stringify(err))
        })
    }
  },
  created () {
    this.token = this.$store.state.token
    if (!this.token) {
      this.$router.replace({ path: '/' })
    }
  }
}
</script>

<style>

</style>
