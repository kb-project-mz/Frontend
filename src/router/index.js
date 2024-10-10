import { createRouter, createWebHistory } from "vue-router";
import FindMember from "@/pages/login/FindMember.vue"
import GuestHomePage from "@/pages/home/GuestHomePage.vue";
import LoginPage from "@/pages/login/LoginPage.vue";
import JoinPage from "@/pages/join/JoinPage.vue";
import ConnectPage from "@/pages/mypage/ConnectPage.vue";
import MyPage from "@/pages/mypage/MyPage.vue";
import ChallengePage from "@/pages/challenge/ChallengePage.vue";
import AnalysisPage from "@/pages/analysis/AnalysisPage.vue";
import AssetPage from "@/pages/connection/AssetPage.vue";
import TestStartPage from "@/pages/test/TestStartPage.vue";
import TestQuestionPage from "@/pages/test/TestQuestionPage.vue";
import TestResultPage from "@/pages/test/TestResultPage.vue";
import TestLoadingPage from "@/pages/test/TestLoadingPage.vue";
import GoogleCallBack from "@/pages/login/GoogleCallBack.vue";
import { useAuthStore } from '@/stores/auth';
import MemberHomePage from "@/pages/home/MemberHomePage.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "guestHomePage",
      component: GuestHomePage,
    },
    {
      path: "/memberHomePage",
      name: "memberHomePage",
      component: MemberHomePage,
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/join",
      name: "join",
      component: JoinPage,
    },
    {
      path: "/google-callback",
      name: "googleCallback",
      component: GoogleCallBack,
    },
    {
      path: "/connect",
      name: "connect",
      component: ConnectPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/mypage",
      name: "mypage",
      component: MyPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/challenge",
      name: "challenge",
      component: ChallengePage,
      meta: { requiresAuth: true },
    },
    {
      path: "/analysis",
      name: "analysis",
      component: AnalysisPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/mypage/asset",
      name: "asset",
      component: AssetPage,
      meta: { requiresAuth: true },
    },
    {
      path: "/FindMember",
      name: "FindMember",
      component: FindMember,
    },
    {
      path: "/test/start",
      name: "testStart",
      component: TestStartPage,
    },
    {
      path: "/test/question/:number",
      name: "testQuestion",
      component: TestQuestionPage,
    },
    {
      path: "/test/loading",
      name: "testLoading",
      component: TestLoadingPage,
    },
    {
      path: "/test/result/:resultId",
      name: "testResult",
      component: TestResultPage,
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/pages/admin/Admin.vue'),
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        const userRole = authStore.member.role;
  
        if (userRole === 'ROLE_ADMIN') {
          next();
        } else {
          alert('관리자 권한이 없습니다.');
          next('/login');
        }
      },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLogin();
  const userRole = authStore.member.role;

  if (to.path.startsWith('/admin') && (!isLoggedIn || userRole !== 'ROLE_ADMIN')) {
    alert("관리자 권한이 필요합니다.");
    authStore.clearAuthState();
    localStorage.clear();
    next('/login');
  } 
  else if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
  } 

  else {
    next();
  }
});

export default router;
