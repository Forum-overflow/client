<template>
  <v-container class="container" grid-list-md text-xs-left>
    <v-layout row>
      <v-flex xs9>
        <v-btn v-if="token" to="/addPost" color="orange darken-2" style="margin: 0" dark>
          <v-icon left>edit</v-icon>Ask Question
        </v-btn>
      </v-flex>
      <v-flex xs3>
      </v-flex>
    </v-layout>
    <!-- CONTENT -->
    <router-view></router-view>
  </v-container>
</template>
<script>
import allPost from '@/components/allPost.vue'
export default {
  data () {
    return {
      token: null
    }
  },
  components: {
    allPost
  },
  created () {
    this.token = this.$store.state.token
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.container {
  width: 70%;
}
</style>
