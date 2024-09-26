import { createRouter, createWebHistory } from 'vue-router'
import FindMemberId from '@/pages/login/FindMemberId.vue';
import FindPassword from '@/pages/login/FindPassword.vue';
import HomePage from '@/pages/home/HomePage.vue';
import LoginPage from '@/pages/login/LoginPage.vue';
import SearchPage from '@/pages/login/SearchPage.vue';
import JoinPage from '@/pages/join/JoinPage.vue';
import ConnectPage from '@/pages/mypage/ConnectPage.vue';
import MyPage from '@/pages/mypage/MyPage.vue';
import ChallengePage from '@/pages/challenge/ChallengePage.vue';
import ConsumptionPage from '@/pages/consumption/ConsumptionPage.vue'
import ConnectionAssetPage from '@/pages/connection/ConnectionAssetPage.vue';
import TestStartPage from '@/pages/test/TestStartPage.vue';
import TestQuestionPage from '@/pages/test/TestQuestionPage.vue';
import TestResultPage from '@/pages/test/TestResultPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    { 
      path: '/login',
      name: 'login',
      component: LoginPage
    },
		// {
		// 	path: '/login/google',
		// 	name: 'GoogleLogin',
		// 	component: GoogleLoginComponent
		// },
    { 
      path: '/search',
      name: 'search',
      component: SearchPage
    },
    { 
      path: '/join',
      name: 'join',
      component: JoinPage
    },
    {
      path: '/connect',
      name: 'connect',
      component: ConnectPage
    },
    {
      path: '/mypage',  
      name: 'mypage',
      component: MyPage 
    },
    {
      path: '/challenge',
      name: 'challenge',
      component: ChallengePage
    },
    {
      path: '/consumption',
      name: 'consumption',
      component: ConsumptionPage
    },
    {
      path: '/mypage/connection/:memberId',
      name: 'connection',
      component: ConnectionAssetPage
    }
    , 
    {
      path: '/findMemberId',
      name: 'findMemberId',
      component: FindMemberId
    }
    ,
    {
      path: '/findPassword',
      name: 'findPassword',
      component: FindPassword
    }   
    ,
    {
      path: '/test/start',
      name: 'testStart',
      component: TestStartPage
    },
    {
      path: '/test/question/:number',
      name: 'testQuestion',
      component: TestQuestionPage
    },
    {
      path: '/test/result',
      name: 'testResult',
      component: TestResultPage
    },
  ]
})

export default router;
