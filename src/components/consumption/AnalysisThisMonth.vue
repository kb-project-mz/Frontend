<script setup>
import { ref, onMounted } from "vue";
import { useConsumptionHistoryStore } from "@/stores/consumption-history";
import { useAccountHistoryStore } from "@/stores/account-history";
import MostAndMaximumUsed from "@/components/consumption/MostAndMaximumUsed.vue";
import CategoryChart from "@/components/consumption/CategoryChart.vue";
import TotalOutcome from "@/components/consumption/TotalOutcome.vue";
import TotalIncome from "@/components/consumption/TotalIncome.vue";
import AverageConsumption from "@/components/consumption/AverageConsumption.vue";

const memberId = 1;
const consumptionHistoryStore = useConsumptionHistoryStore();
const accountHistoryStore = useAccountHistoryStore();

const historyData = ref([]);
const historyThisMonthData = ref([]);
const accountHistoryData = ref([]);
const accountHistoryThisMonthData = ref([]);

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;

const fetchConsumptionHistory = async (memberId) => {
  await consumptionHistoryStore.getCardHistoryList(memberId);
  historyData.value = consumptionHistoryStore.cardHistory;
  historyThisMonthData.value = consumptionHistoryStore.cardHistoryThisMonth;

  await accountHistoryStore.getAccountHistoryList(memberId);
  accountHistoryData.value = accountHistoryStore.accountHistory;
  accountHistoryThisMonthData.value = accountHistoryStore.accountHistoryThisMonth;
};

onMounted(async () => {
    await fetchConsumptionHistory(memberId);
});
</script>

<template>
  <div class="text-lg mb-1">이번 달 홍길동 님의 소비 패턴을 분석해보았어요.</div>
  <div class="text-xl font-semibold mb-6">{{ year }}년 {{ month }}월</div>
  <MostAndMaximumUsed period="이번 달" />
  <div class="flex mt-8">
    <div class="w-1/2 mr-4">
      <CategoryChart />
    </div>
    <div class="w-1/2 ml-4">
      <div>
        <TotalOutcome :historyData="historyThisMonthData" :accountHistoryData="accountHistoryThisMonthData" />
      </div>
      <div class="mt-8">
        <TotalIncome :accountHistoryData="accountHistoryThisMonthData" />
      </div>
      <div class="mt-8">
        <AverageConsumption />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
