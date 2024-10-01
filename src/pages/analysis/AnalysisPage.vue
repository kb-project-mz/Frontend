<script setup>
import { ref, onMounted } from "vue";
import { useCardTransactionStore } from "@/stores/card-transaction";
import { useAccountTransactionStore } from "@/stores/account-transaction";
import { useAuthStore } from "@/stores/auth.js";
import AIRecommendation from "@/components/analysis/AIRecommendation.vue";
import ConsumptionCalendar from "@/components/analysis/ConsumptionCalendar.vue";
import LineChart from "@/components/analysis/LineChart.vue";
import AnalysisThisMonth from "@/components/analysis/AnalysisThisMonth.vue";
import AnalysisSelectedPeriod from "@/components/analysis/AnalysisSelectedPeriod.vue";
import ConsumptionList from "@/components/analysis/ConsumptionList.vue";
import BarChart from "@/components/analysis/BarChart.vue";

const memberIdx = localStorage.getItem("memberIdx");
const memberName = localStorage.getItem("memberName");
const cardTransactionStore = useCardTransactionStore();
const accountTransactionStore = useAccountTransactionStore();

const cardTransactionData = ref([]);
const cardTransactionThisMonthData = ref([]);
const accountTransactionData = ref([]);
const accountTransactionThisMonthData = ref([]);

const authStore = useAuthStore();
const user = authStore.member;

const isFlipped = ref(false);

const toggleCardFlip = () => {
  isFlipped.value = !isFlipped.value;
};

const isDataLoaded = ref(false);

// 월의 마지막 날짜 가져오기 함수
const getEndDay = (year, month) => {
  const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysInMonth[month - 1];
};

// 소비 내역 불러오기 함수
const fetchTransactionData = async (memberIdx) => {
  await cardTransactionStore.getCardTransactionList(memberIdx);
  cardTransactionData.value = cardTransactionStore.cardTransaction;
  cardTransactionThisMonthData.value = cardTransactionStore.cardTransactionThisMonth;

  await accountTransactionStore.getAccountTransactionList(memberIdx);
  accountTransactionData.value = accountTransactionStore.accountTransaction;
  accountTransactionThisMonthData.value = accountTransactionStore.accountTransactionThisMonth;

  isDataLoaded.value = true;
};

// // 선택한 기간 동안의 소비 내역 필터링
// const fetchSelectedPeriodConsumptionTransaction = () => {
//   const startDate = new Date(startYear.value, startMonth.value - 1, startDay.value);
//   const endDate = new Date(endYear.value, endMonth.value - 1, endDay.value, 23, 59, 59);

//   const filteredTransactionData = transactionData.value.filter((item) => {
//     const consumptionDate = new Date(item.consumptionDate);
//     return consumptionDate >= startDate && consumptionDate <= endDate;
//   });

//   const filteredAccountTransactionData = accountTransactionData.value.filter((item) => {
//     const accountDate = new Date(item.accountDate);
//     return accountDate >= startDate && accountDate <= endDate;
//   });

//   transactionSelectedPeriodData.value = filteredTransactionData;
//   accountTransactionSelectedPeriodData.value = filteredAccountTransactionData;
// };

onMounted(async () => {
  // 데이터 불러오기
  await fetchTransactionData(memberIdx);

  // 만약 상태가 계속 변경되면 무한 렌더링이 발생할 수 있음
  // fetchSelectedPeriodConsumptionTransaction();
});
</script>

<template>
  <div v-if="isDataLoaded" class="mx-[22%] mt-10">
    <button @click="toggleCardFlip" class="p-2 bg-navy text-white rounded">뒤집기</button>
    <div class="flip w-full h-[400px] inline-block perspective-[1100px]">
      <div class="card w-full inline-block relative transition duration-400 transform-style-[preserve-3d]"
        :class="{ 'rotate-y-180': isFlipped }">
        <div class="front absolute w-full backface-visibility-hidden">
          <AnalysisThisMonth :card-transaction-data="cardTransactionThisMonthData"
            :account-transaction-data="accountTransactionThisMonthData" />
        </div>
        <div class="back absolute w-full backface-visibility-hidden rotate-y-180">
          <AnalysisSelectedPeriod />
        </div>
      </div>
    </div>

    <div class="flex gap-[30px] mt-8">
      <div class="w-2/5 mt-8 border border-gray-200 rounded-2xl shadow-lg h-[300px] p-5">
        <LineChart />
      </div>
      <div class="w-3/5 mt-8 border border-gray-200 rounded-2xl shadow-lg h-[300px] p-5">
        <BarChart :account-transaction-data="accountTransactionData" :card-transaction-data="cardTransactionData" />
      </div>
    </div>

    <div class="flex mt-8 gap-[30px]">
      <div class="w-3/5 border border-gray-200 rounded-2xl shadow-lg h-[500px] overflow-auto">
        <ConsumptionCalendar :account-transaction-data="accountTransactionData" :card-transaction-data="cardTransactionData" />
      </div>

      <div class="w-2/5 border border-gray-200 rounded-2xl shadow-lg h-[500px] overflow-hidden">
        <ConsumptionList :card-transaction-data="cardTransactionData" />
      </div>
    </div>

    <div class="mt-16 mb-80 gap-[30px]">
      <AIRecommendation />
    </div>
  </div>
</template>

<style scoped>
.bg-navy {
  background-color: #0b1573;
}

.flip {
  perspective: 1100px;
}

.card {
  transition: 0.4s;
  transform-style: preserve-3d;
}

.front,
.back {
  backface-visibility: hidden;
}

.back {
  transform: rotateY(180deg);
}

.card.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
