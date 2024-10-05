<script setup>
import { ref, onMounted, computed } from 'vue';
import { useTransactionAnalysisStore } from '@/stores/transaction-analysis';

const memberIdx = localStorage.getItem("memberIdx");

const transactionAnalysisStore = useTransactionAnalysisStore();

const recommendation = ref("");

const isLoaded = ref(false);

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

const getEndDay = (year, month) => {
  const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysInMonth[month - 1];
};

const splitRecommendation = computed(() => {
  return recommendation.value.split(/(?<=[.!?])/g);
});

onMounted(async () => {
  // recommendation.value = await transactionAnalysisStore.fetchAiRecommendation(memberIdx, currentYear, currentMonth + 1, getEndDay(currentYear, currentMonth));
  recommendation.value = "홍길동 님은 이번 달 배달의 민족에 소비를 많이 하신 편입니다. 배달의 민족에서 5번만 소비를 덜하게 된다면, 평균 50,000원을 아낄 수 있어요 ! 다음 달에는 배달 음식을 조금 줄여보는 것이 어떨까요?";
  isLoaded.value = true;
});
</script>

<template>
  <div class="pt-5 pb-8 px-8 bg-white border border-gray-200 rounded-2xl shadow">
    <div class="mb-5 text-2xl font-bold">
      내 지갑 속 AI
    </div>
    <div class="mb-8 flex items-center justify-end">
      <div class="max-w-fit py-5 px-8 mr-10 bg-white border border-gray-200 rounded-2xl shadow-lg items-end">
        어떻게 하면 다음달 소비를 줄일 수 있을까요?
      </div>
      <img src="https://item.kakaocdn.net/do/a82271aeb7610a35edd4ec9e68704c8dac8e738cb631e72fdb9a96b36413984e" alt="사용자 프로필 사진">
    </div>
    
    <div class="flex items-center">
      <img src="https://item.kakaocdn.net/do/a82271aeb7610a35edd4ec9e68704c8db3a18fdf58bc66ec3f4b6084b7d0b570" alt="AI 프로필 사진">
      <div class="max-w-fit bg-yellow py-5 px-8 ml-10 border border-gray-200 rounded-2xl shadow-lg">
        <div v-if="isLoaded">
          <div v-for="(sentence, index) in splitRecommendation" :key="index">
            {{ sentence }}<span v-if="index === splitRecommendation.length - 1"> 🤗</span>
          </div>
        </div>
        <div v-else>
          <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>  
    </div>
  </div>
</template>

<style scoped>
img {
  width: 4rem;
  height: 4rem;
  border-radius: 70%;
  object-fit: cover;
}
.bg-yellow {
  background-color: #FFF7D0;
}
</style>
