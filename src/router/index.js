import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../pages/HomeView.vue";
import ConsumptionPage from "@/pages/consumption/ConsumptionPage.vue";
import ConnectionAssetPage from "@/pages/connection/ConnectionAssetPage.vue";
import mypage from "@/pages/mypage/MyPage.vue";
import JoinPage from "@/pages/join/JoinPage.vue";
import LoginPage from "@/pages/login/LoginPage.vue";
import SearchPage from "@/pages/login/SearchPage.vue";
import TestStartPage from "@/pages/test/TestStartPage.vue";
import TestQuestionPage from "@/pages/test/TestQuestionPage.vue";
import TestResultPage from "@/pages/test/TestResultPage.vue";
import ChallengePage from "@/pages/challenge/ChallengePage.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ChallengePage
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
