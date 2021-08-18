import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import moment from 'moment'
import Homepage from './components/Homepage.vue'
import RegistrationForm from './components/RegistrationForm.vue'
import InfoAccount from './components/InfoAccount.vue'
import ListUsers from './components/ListUsers.vue'
import ListAssets from './components/ListAssets.vue'
import error404 from './components/error404.vue'
import redirect from './components/redirect.vue'

Vue.use(VueRouter)
const routes=[
  {path: '/', component: Homepage, props: true},
  {path: '/registration', component: RegistrationForm, props: true},
  {path: '/account/:username', component: InfoAccount, props: true},
  {path: '/listusers/', component: ListUsers, props: true},
  {path: '/listassets/', component: ListAssets, props: true},
  {path: '*', component: error404 },
  {path: '/redirecting', component: redirect}
]
const router = new VueRouter({
  routes
})

Vue.filter('formatDate', function(value) {
  if (value) {
      return moment(String(value)).format('MM/DD/YYYY')
  }
});

Vue.config.productionTip = false

new Vue({
  router:router,
  render: h => h(App),
}).$mount('#app')



