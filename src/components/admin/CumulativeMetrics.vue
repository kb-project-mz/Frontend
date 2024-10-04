<script>
import CumulativeSignUpCard from '@/components/admin/card/CumulativeSignUpCard.vue';
import CumulativeLoginCard from '@/components/admin/card/CumulativeLoginCard.vue';
import CumulativeVisitCard from '@/components/admin/card/CumulativeVisitCard.vue';
import CumulativeWithdrawalCard from '@/components/admin/card/CumulativeWithdrawalCard.vue';
import apiInstance from '@/util/axios-instance.js';

export default {
  components: {
    CumulativeSignUpCard,
    CumulativeLoginCard,
    CumulativeVisitCard,
    CumulativeWithdrawalCard
  },
  data() {
    return {
      CumulativesignUpCount: 0,
      CumulativeloginCount: 0,
      CumulativevisitCount: 0,
      CumulativewithdrawalCount: 0
    };
  },
  mounted() {
    this.fetchTotalSignUpCount();
    this.fetchTotalLoginCount();
    this.fetchTotalVisitCount();
    this.fetchTotalWithdrawalCount();
  },
  methods: {
    async fetchTotalSignUpCount() {
      try {
        const response = await apiInstance.get('/admin/total/sign-up');
        if (response.data.success) {
          this.signUpCount = response.data.data;
        }
      } catch (error) {
        console.error('회원가입 수 가져오기 실패:', error);
      }
    },
    async fetchTotalLoginCount() {
      try {
        const response = await apiInstance.get('/admin/total/login');
        if (response.data.success) {
          this.loginCount = response.data.data;
        }
      } catch (error) {
        console.error('로그인 수 가져오기 실패:', error);
      }
    },
    async fetchTotalVisitCount() {
      try {
        const response = await apiInstance.get('/admin/total/visit');
        if (response.data.success) {
          this.visitCount = response.data.data;
        }
      } catch (error) {
        console.error('방문자 수 가져오기 실패:', error);
      }
    },
    async fetchTotalWithdrawalCount() {
      try {
        const response = await apiInstance.get('/admin/total/withdrawal');
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
  