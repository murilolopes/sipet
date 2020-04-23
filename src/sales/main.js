import Vue from 'vue'
import App from './app'
import router from '@sales-router'
import '@sales-components/_globals'

import BootstrapVue from 'bootstrap-vue'
import Vuelidate from 'vuelidate'
import VueMask from 'v-mask'
import VueTheMask from 'vue-the-mask'
import vco from 'v-click-outside'
import VueRouter from 'vue-router'
import VueFeather from 'vue-feather'
import pagarme from 'pagarme'
import swal from 'sweetalert2'
import moment from 'moment'
require('dotenv').config({path: __dirname + '/.env'})

window.Swal = swal
window.moment = moment
Vue.use(VueTheMask)
Vue.use(VueFeather)
Vue.use(Vuelidate)
Vue.use(VueRouter)
Vue.use(VueMask)
Vue.use(vco)

// Don't warn about using the dev version of Vue in development.
Vue.config.productionTip = process.env.NODE_ENV === 'production'

// If running inside Cypress...
if (process.env.VUE_APP_TEST === 'e2e') {
  // Ensure tests fail when Vue emits an error.
  Vue.config.errorHandler = window.Cypress.cy.onUncaughtException
}
pagarme.client.connect({ api_key: 'ak_test_fwVPLNxWd3BnC7yRG8UMYqKYD47NSW' }).then(response => Vue.prototype.$pagarme = response)

Vue.use(BootstrapVue)

Vue.prototype.$api = require('axios')
Vue.prototype.$api.defaults.baseURL  = 'https://pety-api.herokuapp.com/api/v1'
// Vue.prototype.$api.defaults.baseURL  = 'http://localhost:3000/api/v1'

const app = new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')

// If running e2e tests...
if (process.env.VUE_APP_TEST === 'e2e') {
  // Attach the app to the window, which can be useful
  // for manually setting state in Cypress commands
  // such as `cy.logIn()`.
  window.__app__ = app
}
