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

onMounted(async () => {
    // 데이터 불러오기
    await fetchTransactionData(memberIdx);

    // 만약 상태가 계속 변경되면 무한 렌더링이 발생할 수 있음
    // fetchSelectedPeriodConsumptionTransaction();
});
</script>

<template>
  <div v-if="isDataLoaded" class="mx-[20%] grid grid-cols-1">
    <AnalysisSelectedPeriod />
    <!-- <button @click="toggleCardFlip" class="p-2 bg-navy text-white rounded-full">과거 소비와 비교하기</button>
    <div class="flip w-full h-[400px] inline-block perspective-[1100px]">
      <div class="card w-full inline-block relative transition duration-400 transform-style-[preserve-3d]"
        :class="{ 'rotate-y-180': isFlipped }">
        <div class="front absolute w-full backface-visibility-hidden">
          <AnalysisThisMonth :card-transaction-data="cardTransactionThisMonthData"
            :account-transaction-data="accountTransactionThisMonthData" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5">
            <div class="lg:col-span-2">
                <LineChart />
            </div>
            <div class="lg:col-span-3">
                <BarChart :account-transaction-data="accountTransactionData" :card-transaction-data="cardTransactionData" />
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-5">
            <div class="lg:col-span-3">
                <ConsumptionCalendar :account-transaction-data="accountTransactionData" :card-transaction-data="cardTransactionData" />
            </div>
            <div class="lg:col-span-2">
                <ConsumptionList :card-transaction-data="cardTransactionData" />
            </div>
        </div>

        <div>
            <AIRecommendation />
        </div>
      </div>
    </div> -->


    <div class="grid grid-cols-1 lg:grid-cols-5">
      <div class="lg:col-span-2">
        <LineChart />
      </div>
      <div class="lg:col-span-3">
        <BarChart :account-transaction-data="accountTransactionData" :card-transaction-data="cardTransactionData" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-5">
      <div class="lg:col-span-3">
        <ConsumptionCalendar :account-transaction-data="accountTransactionData" :card-transaction-data="cardTransactionData" />
      </div>
      <div class="lg:col-span-2">
        <ConsumptionList :card-transaction-data="cardTransactionData" />
      </div>
    </div>

    <div>
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
