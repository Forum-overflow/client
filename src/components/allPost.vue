<template>
  <v-layout row wrap>
      <v-flex :key="`9`" xs9>
        <v-card dark color="#26BCB0">
          <v-layout row>
            <v-flex xs10>
              <h2>Topics</h2>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs3>
              <center>
              Upvotes
              </center>
            </v-flex>
            <v-flex xs3>
              Replies
            </v-flex>
            <v-flex xs3>
              Last Post
            </v-flex>
          </v-layout>
        </v-card>
        <div v-if="loading">
          <br>
          <center>
            <v-progress-circular
              :size="50"
              color="primary"
              indeterminate
            ></v-progress-circular>
          </center>
        </div>
        <v-card color="white" v-for="(post, index) in posts" :key="index" flat>
          <v-layout row style="margin-left:20px; padding:10px;">
            <v-icon size="60">event</v-icon>
            <v-flex :key="`10`" xs7>
              <router-link :to="`/post/${post._id}`"><h3 style="margin-left:10px;">{{ post.title }}</h3></router-link> <!-- MAX LENGTH 44 -->
              <p style="margin-left:10px;">by <i style="color:#AA0000">{{ post.owner.name }}</i></p>
            </v-flex>
            <v-flex xs2>
              {{ post.upvote.length - post.downvote.length }}
            </v-flex>
            <v-flex xs2>
                {{ post.reply.length }}
            </v-flex>
            <v-flex xs2>
              {{ moment(post.createdAt).fromNow() }}
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <v-flex :key="`3`" xs3>
        <!-- SIDEBAR -->
        <v-card dark color="secondary" >
          <h2>Side Bar</h2>
        </v-card>
        <v-card color="white" class="sidebar" flat>
          <v-flex xs12>
            <v-text-field label="Find Question" single-line clearable v-model="findInput"></v-text-field>
          </v-flex>
          <v-select
            :items="sortItem"
            label="Sort"
            v-model="sortCmd"
          ></v-select>
        </v-card>
      </v-flex>
    </v-layout>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  data () {
    return {
      posts: [],
      token: this.$store.state.token,
      moment: moment,
      loading: true,
      sortItem: ['Featured', 'Old question', 'Upvotes ASC', 'Upvotes DESC'],
      sortCmd: null,
      findInput: 'BELOM'
    }
  },
  created () {
    axios({
      url: 'http://localhost:3000/post',
      method: 'get'
    })
      .then(({ data }) => {
        this.loading = false
        this.posts = data
      })
  },
  watch: {
    sortCmd (val) {
      if (val === 'Featured') {
        this.posts = featured(this.posts)
      } else if (val === 'Old question') {
        this.posts = oldQuestion(this.posts)
      } else if (val === 'Upvotes ASC') {
        this.posts = upvoteAsc(this.posts)
      } else if (val === 'Upvotes DESC') {
        this.posts = upvoteDesc(this.posts)
      }
    },
    findInput (val) {
      console.log(val)
    }
  }
}

function featured (posts) {
  for (let i = 0; i < posts.length; i++) {
    if (i + 1 < posts.length && i >= 0) {
      if (posts[i].createdAt < posts[i + 1].createdAt) {
        let tmp = posts[i]
        posts[i] = posts[i + 1]
        posts[i + 1] = tmp
        i -= 2
      }
    }
  }
  return posts
}

function oldQuestion (posts) {
  for (let i = 0; i < posts.length; i++) {
    if (i + 1 < posts.length && i >= 0) {
      if (posts[i].createdAt > posts[i + 1].createdAt) {
        let tmp = posts[i]
        posts[i] = posts[i + 1]
        posts[i + 1] = tmp
        i -= 2
      }
    }
  }
  return posts
}

function upvoteAsc (posts) {
  for (let i = 0; i < posts.length; i++) {
    if (i + 1 < posts.length && i >= 0) {
      if (posts[i].upvote.length > posts[i + 1].upvote.length) {
        let tmp = posts[i]
        posts[i] = posts[i + 1]
        posts[i + 1] = tmp
        i -= 2
      }
    }
  }
  return posts
}

function upvoteDesc (posts) {
  for (let i = 0; i < posts.length; i++) {
    if (i + 1 < posts.length && i >= 0) {
      if (posts[i].upvote.length < posts[i + 1].upvote.length) {
        let tmp = posts[i]
        posts[i] = posts[i + 1]
        posts[i + 1] = tmp
        i -= 2
      }
    }
  }
  return posts
}

</script>

<style scoped>
h1, h2, h3 {
  margin-left: 30px;
  margin-right: 30px;
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.sidebar {
  padding: 10px;
}

</style>
