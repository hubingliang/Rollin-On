import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './registerServiceWorker'
import VueLazyload from 'vue-lazyload'
import axios from '@/lib/axios'

Vue.config.productionTip = false
Vue.use(axios)
Vue.use(VueLazyload)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
