<script setup>
import { ref, onMounted } from "vue";
import { useCardTransactionStore } from "@/stores/card-transaction";
import { useAccountTransactionStore } from "@/stores/account-transaction";
import MostAndMaximumUsed from "@/components/analysis/MostAndMaximumUsed.vue";
import CategoryChart from "@/components/analysis/CategoryChart.vue";
import TotalAmount from "@/components/analysis/TotalAmount.vue";
import AverageConsumption from "@/components/analysis/AverageConsumption.vue";

const cardTransactionStore = useCardTransactionStore();
const accountTransactionStore = useAccountTransactionStore();

const cardTransactionData = ref(null);
const accountTransactionData = ref(null);

const today = new Date(2024, 8, 23);  // 9월 23일

const selectedStartYear = ref(0);
const selectedStartMonth = ref(0);
const selectedStartDate = ref(0);
const selectedEndYear = ref(0);
const selectedEndMonth = ref(0);
const selectedEndDate = ref(0);

const startDate = ref(null);
const endDate = ref(null);

const getEndDay = (year, month) => {
  const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysInMonth[month];
}

const getLastMonth = () => {
  const year = today.getFullYear();
  const month = today.getMonth();

  let lastMonthYear = year;
  let lastMonth = month - 1;

  if (lastMonth < 0) {
    lastMonth = 11;
    lastMonthYear--;
  }

  return new Date(lastMonthYear, lastMonth, getEndDay(lastMonthYear, lastMonth));
}

const isLoaded = ref(false);

onMounted(() => {
  const lastMonthLastDate = getLastMonth();
  selectedStartYear.value = lastMonthLastDate.getFullYear();
  selectedStartMonth.value = lastMonthLastDate.getMonth() + 1;
  selectedStartDate.value = 1;
  selectedEndYear.value = lastMonthLastDate.getFullYear();
  selectedEndMonth.value = lastMonthLastDate.getMonth() + 1;
  selectedEndDate.value = lastMonthLastDate.getDate();

  cardTransactionData.value = cardTransactionStore.getSelectedPeriodCardTransactionData(
    selectedStartYear.value, selectedStartMonth.value, selectedStartDate.value,
    selectedEndYear.value, selectedEndMonth.value, selectedEndDate.value,
  );
  accountTransactionData.value = accountTransactionStore.getSelectedPeriodAccountTransactionData(
    selectedStartYear.value, selectedStartMonth.value, selectedStartDate.value,
    selectedEndYear.value, selectedEndMonth.value, selectedEndDate.value,
  );

  console.log(cardTransactionData.value);
  console.log(accountTransactionData.value);

  isLoaded.value = true;
});
</script>

<template>
  <div v-if="isLoaded">
    <div class="text-xl font-semibold mb-6">
      {{ selectedStartYear }}년 {{ selectedStartMonth }}월 {{ selectedStartDate }}일부터
      {{ selectedEndYear }}년 {{ selectedEndMonth }}월 {{ selectedEndDate }}일까지의 소비 패턴을 분석해보았어요.
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-7">
      <MostAndMaximumUsed class="lg:col-span-3" :start-date="startDate" :end-date="endDate" />
      <div class="lg:col-span-2 flex flex-col justify-between">
        <TotalAmount :card-transaction-data="cardTransactionData" :account-transaction-data="accountTransactionData" />
        <AverageConsumption />
      </div>
      <CategoryChart class="lg:col-span-2" />
    </div>
  </div>
</template>

<style scoped>

</style>
