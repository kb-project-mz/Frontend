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
import NoConnectedAsset from "@/components/analysis/NoConnectedAsset.vue";
import FixedExpenses from "@/components/analysis/FixedExpenses.vue";

const authData = JSON.parse(localStorage.getItem("auth"));
const memberIdx = authData.memberIdx;
const cardTransactionStore = useCardTransactionStore();
const accountTransactionStore = useAccountTransactionStore();

const cardTransactionData = ref([]);
const cardTransactionThisMonthData = ref([]);
const cardTransactionLastMonthData = ref([]);
const accountTransactionData = ref([]);
const accountTransactionThisMonthData = ref([]);
const accountTransactionLastMonthData = ref([]);

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
  cardTransactionThisMonthData.value =
    cardTransactionStore.cardTransactionThisMonth;
  cardTransactionLastMonthData.value =
    cardTransactionStore.cardTransactionLastMonth;

  await accountTransactionStore.getAccountTransactionList(memberIdx);
  accountTransactionData.value = accountTransactionStore.accountTransaction;
  accountTransactionThisMonthData.value =
    accountTransactionStore.accountTransactionThisMonth;
  accountTransactionLastMonthData.value =
    accountTransactionStore.accountTransactionLastMonth;

  isDataLoaded.value = true;
};

onMounted(async () => {
  await fetchTransactionData(memberIdx);
});
</script>

<template>
  <div v-if="isDataLoaded">
    <div v-if="cardTransactionData.length > 0 || accountTransactionData.length > 0" class="mx-[20%] grid grid-cols-1 gap-10">
      <div class="flex items-end">
        <div class="p-3 bg-customBlue text-white text-center rounded-lg w-fit">
          <router-link to="/mypage/asset">자산 연결하러 가기</router-link>
        </div>
        <div class="p-3 bg-customBlue text-white rounded-lg">
          <button @click="toggleCardFlip">과거 소비와 비교하기</button>
        </div>
      </div>
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
      
      <div class="grid grid-cols-1 lg:grid-cols-5 space-x-10">
        <div class="h-full lg:col-span-2 space-y-10">
          <LineChart :card-transaction-this-month-data="cardTransactionThisMonthData"
                      :card-transaction-last-month-data="cardTransactionLastMonthData"
                      :account-transaction-this-month-data="accountTransactionThisMonthData" 
                      :account-transaction-last-month-data="accountTransactionLastMonthData"/>
          <FixedExpenses />
        </div>
        <div class="h-full lg:col-span-3">
          <BarChart :account-transaction-data="accountTransactionData" :card-transaction-data="cardTransactionData" />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-7 space-x-10">
        <div class="lg:col-span-4">
          <ConsumptionCalendar :account-transaction-data="accountTransactionData"
            :card-transaction-data="cardTransactionData" />
        </div>
        <div class="lg:col-span-3">
          <ConsumptionList :card-transaction-data="cardTransactionThisMonthData" 
            :account-transaction-data="accountTransactionThisMonthData" />
        </div>
      </div>

      <div>
        <AIRecommendation />
      </div>
    </div>
    <div v-else>
      <NoConnectedAsset />
    </div>
  </div>
</template>

<style scoped>
.flip {
  perspective: 5000px;
}

.card {
  transition: 0.4s;
  transform-style: preserve-3d;
}

.front,
.back {
  backface-visibility: hidden;
}
</style>
