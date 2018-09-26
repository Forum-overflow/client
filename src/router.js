import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/',
          component: () => import('./components/allPost.vue')
        },
        {
          path: '/post/:id',
          component: () => import('./views/Post.vue'),
          children: [
            {
              path: '/post/:id/edit',
              component: () => import('./components/EditPost.vue')
            },
            {
              path: '/post/:id/reply',
              component: () => import('./components/AddReply.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('./views/Signup.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/addPost',
      name: 'addPost',
      component: () => import('./views/AddPost.vue')
    }
  ]
})
