import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import NProgress from 'nprogress/nprogress'
import { allRoutes } from './routes'

Vue.use(VueRouter)
Vue.use(VueMeta, {
  keyName: 'page',
})

const router = new VueRouter({
  routes: allRoutes,
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
})
export default router
