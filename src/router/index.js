import { createRouter, createWebHistory } from 'vue-router';
import FindMember from '@/pages/login/FindMember.vue';
import HomePage from '@/pages/home/HomePage.vue';
import LoginPage from '@/pages/login/LoginPage.vue';
import JoinPage from '@/pages/join/JoinPage.vue';
import ConnectPage from '@/pages/mypage/ConnectPage.vue';
import MyPage from '@/pages/mypage/MyPage.vue';
import ChallengePage from '@/pages/challenge/ChallengePage.vue';
import AnalysisPage from '@/pages/analysis/AnalysisPage.vue';
import AssetPage from '@/pages/connection/AssetPage.vue';
import TestStartPage from '@/pages/test/TestStartPage.vue';
import TestQuestionPage from '@/pages/test/TestQuestionPage.vue';
import TestResultPage from '@/pages/test/TestResultPage.vue';
import TestLoadingPage from '@/pages/test/TestLoadingPage.vue';
import GoogleCallBack from '@/pages/login/GoogleCallBack.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'homePage',
      component: HomePage,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/join',
      name: 'join',
      component: JoinPage,
    },
    {
      path: '/google-callback',
      name: 'googleCallback',
      component: GoogleCallBack,
    },
    {
      path: '/connect',
      name: 'connect',
      component: ConnectPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: MyPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/challenge',
      name: 'challenge',
      component: ChallengePage,
      meta: { requiresAuth: true },
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: AnalysisPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/mypage/asset',
      name: 'asset',
      component: AssetPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/FindMember',
      name: 'FindMember',
      component: FindMember,
    },
    {
      path: '/test/start',
      name: 'testStart',
      component: TestStartPage,
    },
    {
      path: '/test/question/:number',
      name: 'testQuestion',
      component: TestQuestionPage,
    },
    {
      path: '/test/loading',
      name: 'testLoading',
      component: TestLoadingPage,
    },
    {
      path: '/test/result/:resultId',
      name: 'testResult',
      component: TestResultPage,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
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
