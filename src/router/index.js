import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import ConsumptionPage from '@/pages/consumption/ConsumptionPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/consumption',
      name: 'consumption',
      component: ConsumptionPage
    }
  ]
})

export default router
