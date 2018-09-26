<template>
  <span>
    <h1>EDIT QUESTION</h1>
    <v-form ref="form">
      <v-text-field label="Title" v-model="title"></v-text-field>
      <v-textarea name="input-7-1" required v-model="description" label="Question"></v-textarea>
      <v-btn :to="`/post/${post._id}`" >cancel</v-btn>
      <v-btn @click="update">update</v-btn>
    </v-form>
  </span>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      title: this.post.title,
      description: this.post.description
    }
  },
  props: ['post'],
  methods: {
    update () {
      axios({
        url: `http://localhost:3000/post/${this.post._id}`,
        headers: {
          'token': this.$store.state.token
        },
        data: {
          title: this.title,
          description: this.description
        },
        method: 'put'
      })
        .then(({ data }) => {
          this.$emit('updated', data)
          this.$router.push({ path: `/post/${this.post._id}` })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style>

</style>
