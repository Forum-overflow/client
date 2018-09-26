<template>
  <div>
    <router-view v-bind:post="post" v-on:updated="getPost"></router-view>
    <v-card color="white" id="card">
      <v-layout row style="padding:10px;">
        <v-layout column>
          <h2>{{ post.owner.name }}</h2>
          <b>owner</b>
          <p>Posts: {{ post.owner.post.length }}</p>
        </v-layout>
        <v-spacer></v-spacer>
        <!-- UPVOTE -->
        <v-btn flat icon color="blue lighten-2" @click="upvoteQuestion" :disabled="post.owner.email === $store.state.emailUser">
          <v-badge left color="#64B5F6">
            <span slot="badge">{{ post.upvote.length }}</span>
            <v-icon>thumb_up</v-icon>
          </v-badge>
        </v-btn>
        <!-- DOWNVOTE -->
        <v-btn flat icon color="red lighten-2" @click="downvoteQuestion" :disabled="post.owner.email === $store.state.emailUser">
          <v-badge left color="#E57373">
            <span slot="badge">{{ post.downvote.length }}</span>
            <v-icon>thumb_down</v-icon>
          </v-badge>
        </v-btn>
        <!-- EDIT -->
        <v-btn color="info" v-if="post.owner.email == $store.state.emailUser" :to="`/post/${post._id}/edit`">Edit</v-btn>
        <!-- REPLY -->
        <v-btn color="success" v-if="$store.state.token" :to="`/post/${post._id}/reply`">Reply</v-btn>
      </v-layout>
      <hr>
      <br>
      <h2>{{ post.title }}</h2>
      <i>{{ post.createdAt }}</i> <br> <br>
      <v-layout row>
        <p>{{ post.description }}</p>
        <v-spacer></v-spacer>

        <v-dialog v-model="deleteModal" persistent max-width="290" v-if="$store.state.emailUser == post.owner.email">
          <v-btn slot="activator" color="error" dark>Delete</v-btn>
          <v-card>
            <v-card-title class="headline">Are you sure to delete this Question?</v-card-title>
            <v-card-text>This question will delete permanently, so becareful</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat @click.native="deleteModal = false">Cancel</v-btn>
              <v-btn color="green darken-1" flat @click="deleteQuestion(post._id)">Sure</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-layout>

      <v-dialog v-model="dialog" max-width="400">
        <v-card>
          <v-alert :value="true" type="success">
            {{ msg }}
          </v-alert>
        </v-card>
      </v-dialog>
    </v-card>
    <!-- ANSWER -->
    <span v-for="(reply, index) in post.reply" :key="index">
      <br>
      <v-card color="white" id="card">
        <v-layout row style="padding:10px;">
          <v-layout column>
            <h2>{{ reply.owner.name }}</h2>
            <b>answerer</b>
            <p>Posts: {{ reply.owner.post.length }}</p>
          </v-layout>
          <v-spacer></v-spacer>
          <!-- UPVOTE -->
          <v-btn flat icon color="blue lighten-2" @click="upvoteReply(reply._id)" :disabled="reply.owner.email === $store.state.emailUser">
            <v-badge left color="#64B5F6">
              <span slot="badge">{{ reply.upvote.length }}</span>
              <v-icon>thumb_up</v-icon>
            </v-badge>
          </v-btn>
          <!-- DOWNVOTE -->
          <v-btn flat icon color="red lighten-2" @click="downvoteReply(reply._id)" :disabled="reply.owner.email === $store.state.emailUser">
            <v-badge left color="#E57373">
              <span slot="badge">{{ reply.downvote.length }}</span>
              <v-icon>thumb_down</v-icon>
            </v-badge>
          </v-btn>
          <v-btn v-if="reply.owner.email == $store.state.emailUser" slot="activator" color="info" @click="triggerEdit(reply)"
            dark>Edit</v-btn>
          <v-dialog v-model="edit" persistent max-width="500px" v-if="reply.owner.email == $store.state.emailUser">
            <v-card>
              <v-card-title>
                <span class="headline">Edit Reply</span>
              </v-card-title>
              <v-card-text>
                <v-textarea name="input-7-1" required v-model="editBody" label="Question"></v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click.native="edit = false">Close</v-btn>
                <v-btn color="blue darken-1" flat @click="editReply">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-layout>
        <hr>
        <br>
        <i>{{ reply.createdAt }}</i> <br> <br>
        <p>{{ reply.body }}</p>
      </v-card>
      <br>
    </span>
  </div>
</template>

<script>
import axios from 'axios'

// helper sort dari lama sampai yang baru
function sortDescCreated (data) {
  for (let i = 0; i < data.reply.length; i++) {
    if (i+1 < data.reply.length && i >= 0) {
      if (data.reply[i].createdAt > data.reply[i+1].createdAt) {
        let tmp = data.reply[i]
        data.reply[i] = data.reply[i+1]
        data.reply[i+1] = tmp
        i-=2
      }
    }
  }
  return data
}
export default {
  data () {
    return {
      post: { owner: { name: '', post: {} }, upvote: [], downvote: [] },
      dialog: false,
      msg: '',
      edit: false,
      editBody: '',
      idEditReply: '',
      deleteModal: false
    }
  },
  methods: {
    triggerEdit (value) {
      this.idEditReply = value._id
      this.editBody = value.body
      this.edit = true
    },
    getPost () {
      axios({
        url: `http://localhost:3000/post/${this.$route.params.id}`
      })
        .then(({ data }) => {
          this.post = sortDescCreated(data)
        })
        .catch(err => {
          console.log(err)
          alert(JSON.stringify(err))
        })
    },
    upvoteQuestion () {
      axios({
        url: `http://localhost:3000/post/upvote`,
        method: 'patch',
        headers: {
          'token': this.$store.state.token
        },
        data: {
          postId: this.post._id
        }
      })
        .then(({ data }) => {
          this.dialog = true
          this.msg = 'Successfully Upvote Question'
          this.getPost()
        })
        .catch(({ response }) => {
          if (response.data.message === 'jwt malformed') {
            alert(`Login terlebih dahulu`)
          } else {
            alert(response.data.message)
          }
        })
    },
    downvoteQuestion () {
      axios({
        url: `http://localhost:3000/post/downvote`,
        method: 'patch',
        headers: {
          'token': this.$store.state.token
        },
        data: {
          postId: this.post._id
        }
      })
        .then(({ data }) => {
          this.dialog = true
          this.msg = 'Successfully Downvote Question'
          this.getPost()
        })
        .catch(({ response }) => {
          if (response.data.message === 'jwt malformed') {
            alert(`Login terlebih dahulu`)
          } else {
            alert(response.data.message)
          }
        })
    },
    upvoteReply (id) {
      axios({
        url: 'http://localhost:3000/reply/upvote',
        method: 'patch',
        headers: {
          'token': this.$store.state.token
        },
        data: {
          replyId: id
        }
      })
        .then(({ data }) => {
          this.dialog = true
          this.msg = 'Successfully Upvote Reply'
          this.getPost()
        })
        .catch(({ response }) => {
          if (response.data.message === 'jwt malformed') {
            alert(`Login terlebih dahulu`)
          } else {
            alert(response.data.message)
          }
        })
    },
    downvoteReply (id) {
      axios({
        url: 'http://localhost:3000/reply/downvote',
        method: 'patch',
        headers: {
          'token': this.$store.state.token
        },
        data: {
          replyId: id
        }
      })
        .then(({ data }) => {
          this.dialog = true
          this.msg = 'Successfully Downvote Reply'
          this.getPost()
        })
        .catch(({ response }) => {
          if (response.data.message === 'jwt malformed') {
            alert(`Login terlebih dahulu`)
          } else {
            alert(response.data.message)
          }
        })
    },
    editReply (value) {
      axios({
        url: 'http://localhost:3000/reply',
        method: 'put',
        headers: {
          'token': this.$store.state.token
        },
        data: {
          body: this.editBody,
          replyId: this.idEditReply
        }
      })
        .then(({ data }) => {
          this.getPost()
          this.edit = false
          this.editBody = ''
          this.idEditReply = ''
        })
        .catch(({ response }) => {
          alert(JSON.stringify(response.data))
        })
    },
    deleteQuestion (id) {
      axios({
        url: `http://localhost:3000/post/${id}`,
        method: 'delete',
        headers: {
          'token': this.$store.state.token
        }
      })
        .then(({ data }) => {
          this.deleteModal = false
          this.$router.push({ path: '/' })
        })
        .catch(({ response }) => {
          alert(response.data.message)
        })
    }
  },
  created () {
    this.getPost()
  }
}
</script>

<style>
#card {
  padding: 15px;
}

</style>
