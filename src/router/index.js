import { createRouter, createWebHistory } from "vue-router";
import HomePage from "@/pages/home/HomePage.vue";
import Login from "@/pages/login/LoginPage.vue";
import FindUsername from "@/pages/login/FindUsername.vue";
import FindPassword from "@/pages/login/FindPassword.vue";
import ChallengePage from "@/pages/challenge/ChallengePage.vue";
import ConsumptionPage from "@/pages/consumption/ConsumptionPage.vue";
import ConnectionAssetPage from "@/pages/connection/ConnectionAssetPage.vue";
import BeforeLoginPage from "@/pages/consumption/BeforeLoginPage.vue";
import JoinPage from "@/pages/join/JoinPage.vue";
import AfterConnectionPage from "@/pages/mypage/AfterConnectionPage.vue";
import BeforeConnectionPage from "@/pages/mypage/BeforeConnectionPage.vue";
import MyPage from "@/pages/mypage/MyPage.vue";
import LoginPage from "@/pages/login/LoginPage.vue";
import TestStartPage from "@/pages/test/TestStartPage.vue";
import TestQuestionPage from "@/pages/test/TestQuestionPage.vue";
import TestResultPage from "@/pages/test/TestResultPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomePage,
    },
    {
      path: "/consumption",
      name: "consumption",
      component: ConsumptionPage,
    },
    {
      path: "/mypage/connection/:memberId",
      name: "connection",
      component: ConnectionAssetPage,
    },
    {
      path: "/mypage",
      name: "mypage",
      component: MyPage,
    },
    {
      path: "/join",
      name: "join",
      component: JoinPage,
    },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
    },
    {
      path: "/find-username",
      name: "FindUsername",
      component: FindUsername,
    },
    {
      path: "/find-password",
      name: "FindPassword",
      component: FindPassword,
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
      path: "/test/result",
      name: "testResult",
      component: TestResultPage,
    },
    {
      path: "/challenge",
      name: "challenge",
      component: ChallengePage,
    },
  ],
});

export default router;
