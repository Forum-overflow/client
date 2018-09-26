<template>
  <span>
    <h1>Reply QUESTION</h1>
    <v-form ref="form">
      <v-textarea name="input-7-1" required v-model="body" label="Reply"></v-textarea>

      <v-btn @click="reply">reply</v-btn>
    </v-form>
  </span>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      body: ''
    }
  },
  props: ['post'],
  methods: {
    reply () {
      axios({
        url: 'http://localhost:3000/reply',
        method: 'post',
        headers: {
          'token': this.$store.state.token
        },
        data: {
          body: this.body,
          postId: this.post._id
        }
      })
        .then(({ data }) => {
          this.body = ''
          this.$emit('updated', data)
          this.$router.push({ path: `/post/${this.post._id}` })
        })
        .catch(({ response }) => {
          console.log(response)
        })
    }
  },
  created () {
    if (!this.$store.state.token) {
      this.$router.replace({ path: `/post/${this.post._id}` })
    }
  }
}
</script>

<style>

</style>
