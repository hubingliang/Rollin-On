import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './registerServiceWorker'
import VueLazyload from 'vue-lazyload'
import axios from '@/lib/axios'
import massage from '@/components/notification/notification.ts'

Vue.config.productionTip = false
Vue.use(massage)
Vue.use(axios)
Vue.use(VueLazyload, {
  listenEvents: [ 'scroll' ],
  error: '/img/default_album.jpg',
  loading: '/img/default_album.jpg',
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
