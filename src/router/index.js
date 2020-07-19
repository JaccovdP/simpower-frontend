import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import League from '../views/League.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Simpower Leagues'
    }
  },
  {
    path: '/league/:slug/:tab',
    name: 'League',
    component: League,
    meta: {
      title: 'Simpower Leagues'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
