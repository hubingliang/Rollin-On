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
      name: 'home',
      component: Layout,
      children: [
        {
          path: 'daily-recommendation',
          name: 'DailyRecommendation',
          component: () => import('./views/daily-recommendation/DailyRecommendation.vue'),
        },
        {
          path: 'play-list',
          name: 'PlayList',
          component: () => import('./views/play-list/PlayList.vue'),
        },
        {
          path: ':playListId/list-detail',
          name: 'ListDetail',
          component: () => import('@/views/list-detail/ListDetail.vue'),
        },
      ],
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/player/Player.vue'),
    },
  ],
})
