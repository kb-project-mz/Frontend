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
    }
    ,
    {
      path: '/consumption',
      name: 'consumption',
      component: ConsumptionPage
    }
    ,
    {
      path: '/mypage/connection/:memberId',
      name: 'connection',
      component: ConnectionAssetPage
    }
    , 
    {
      path: '/mypage',  
      name: 'mypage',
      component: mypage 
    }
    ,
    { 
      path: '/join',
      name: 'join',         
      component: JoinPage
    }
    ,
    { 
      path: '/login',
      name: 'login',         
      component: LoginPage
    }
    ,
    {
      path: '/login/search',
      name: 'loginSearch',
      component: SearchPage
    }     
    ,
    {
      path: '/test/start',
      name: 'testStart',
      component: TestStartPage
    }
    ,
    {
      path: '/test/question/:number',
      name: 'testQuestion',
      component: TestQuestionPage
    }
    , 
    {
      path: '/test/result',
      name: 'testResult',
      component: TestResultPage
    }
    ,
    {
      path: '/challenge',
      name: 'challenge',
      component: ChallengePage
    }
  
  ]
})

export default router
