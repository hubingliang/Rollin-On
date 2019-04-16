import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/Layout.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Layout,
      children: [
        {
          path: 'play-list',
          name: 'PlayList',
          component: () => import('./views/play-list/PlayList.vue'),
        },
        {
          path: ':playListId/list-detail',
          name: 'ListDetail',
          component: () => import('./views/list-details/ListDetails.vue'),
        },
        {
          path: 'daily-recommendation',
          name: 'DailyRecommendation',
          component: () => import('./views/list-details/ListDetails.vue'),
        },
        {
          path: 'event',
          name: 'Event',
          component: () => import('./views/event/Event.vue'),
        },
      ],
    },
  ],
})
