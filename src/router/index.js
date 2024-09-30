import { createRouter, createWebHistory } from 'vue-router'
import FindMemberId from '@/pages/login/FindMemberId.vue';
import FindPassword from '@/pages/login/FindPassword.vue';
import HomePage from '@/pages/home/HomePage.vue';
import LoginPage from '@/pages/login/LoginPage.vue';
import JoinPage from '@/pages/join/JoinPage.vue';
import ConnectPage from '@/pages/mypage/ConnectPage.vue';
import MyPage from '@/pages/mypage/MyPage.vue';
import ChallengePage from '@/pages/challenge/ChallengePage.vue';
import ConsumptionPage from '@/pages/consumption/ConsumptionPage.vue'
import AssetPage from '@/pages/connection/AssetPage.vue';
import TestStartPage from '@/pages/test/TestStartPage.vue';
import TestQuestionPage from '@/pages/test/TestQuestionPage.vue';
import TestResultPage from '@/pages/test/TestResultPage.vue';
import { useAuthStore } from '@/stores/auth';
import GoogleCallBack from '@/pages/login/GoogleCallBack.vue';

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
    { 
      path: '/join',
      name: 'join',
      component: JoinPage
    },
		{
			path: '/google-callback',
			name: 'googleCallback',
			component: GoogleCallBack
		},
    {
      path: '/connect',
      name: 'connect',
      component: ConnectPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/mypage',  
      name: 'mypage',
      component: MyPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/challenge',
      name: 'challenge',
      component: ChallengePage,
      meta: { requiresAuth: true }
    },
    {
      path: '/consumption',
      name: 'consumption',
      component: ConsumptionPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/mypage/asset',
      name: 'asset',
      component: AssetPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/findMemberId',
      name: 'findMemberId',
      component: FindMemberId
    },
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
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = !!localStorage.getItem('auth');
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router;
