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
  await fetchTransactionData(memberIdx);
});
</script>

<template>
  <div v-if="isDataLoaded" class="mx-[20%] grid grid-cols-1 gap-10">
    <button @click="toggleCardFlip" class="p-2 bg-navy text-white rounded">과거 소비와 비교하기</button>
    <div class="flip w-full inline-block relative">
      <div class="card w-full inline-block relative flex" :class="{ '[transform:rotateY(180deg)]': isFlipped }">
        <div class="front w-full absolute">
          <AnalysisThisMonth :card-transaction-data="cardTransactionThisMonthData"
            :account-transaction-data="accountTransactionThisMonthData" />
        </div>
        <div class="back w-full [transform:rotateY(180deg)]">
          <AnalysisSelectedPeriod />
        </div>
      </div>
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
        <ConsumptionCalendar :account-transaction-data="accountTransactionData"
          :card-transaction-data="cardTransactionData" />
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
  perspective: 5000px;
}

.card {
  transition: 0.4s;
  transform-style: preserve-3d;
}

.front, .back {
  backface-visibility: hidden;
}
</style>
