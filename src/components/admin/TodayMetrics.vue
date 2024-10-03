<script>
import SignUpCard from '@/components/admin/card/SignUpCard.vue';
import LoginCard from '@/components/admin/card/LoginCard.vue';
import VisitCard from '@/components/admin/card/VisitCard.vue';
import WithdrawalCard from '@/components/admin/card/WithdrawalCard.vue';
import apiInstance from '@/util/axios-instance.js';

export default {
  components: {
    SignUpCard,
    LoginCard,
    VisitCard,
    WithdrawalCard
  },
  data() {
    return {
      signUpCount: 0,
      loginCount: 0,
      visitCount: 0,
      withdrawalCount: 0
    };
  },
  mounted() {
    this.fetchTodaySignUpCount();
    this.fetchTodayLoginCount();
    this.fetchTodayVisitCount();
    this.fetchTodayWithdrawalCount();
  },
  methods: {
    async fetchTodaySignUpCount() {
      try {
        const response = await apiInstance.get('/admin/today/sign-up');
        if (response.data.success) {
          this.signUpCount = response.data.data;
        }
      } catch (error) {
        console.error('회원가입 수 가져오기 실패:', error);
      }
    },
    async fetchTodayLoginCount() {
      try {
        const response = await apiInstance.get('/admin/today/login');
        if (response.data.success) {
          this.loginCount = response.data.data;
        }
      } catch (error) {
        console.error('로그인 수 가져오기 실패:', error);
      }
    },
    async fetchTodayVisitCount() {
      try {
        const response = await apiInstance.get('/admin/today/visit');
        if (response.data.success) {
          this.visitCount = response.data.data;
        }
      } catch (error) {
        console.error('방문자 수 가져오기 실패:', error);
      }
    },
    async fetchTodayWithdrawalCount() {
      try {
        const response = await apiInstance.get('/admin/today/withdrawal');
        if (response.data.success) {
          this.withdrawalCount = response.data.data;
        }
      } catch (error) {
        console.error('탈퇴 수 가져오기 실패:', error);
      }
    }
  }
};
</script>


<template>
    <div class="flex justify-around space-x-4 p-6">
      <SignUpCard :value="signUpCount" />
      <LoginCard :value="loginCount" />
      <VisitCard :value="visitCount" />
      <WithdrawalCard :value="withdrawalCount" />
    </div>
  </template>
  
  
  <style scoped>
  /* 추가적인 스타일을 여기서 정의할 수 있습니다 */
  </style>
  