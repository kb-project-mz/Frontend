<script setup>
import MostAndMaximumUsed from "@/components/analysis/MostAndMaximumUsed.vue";
import CategoryChart from "@/components/analysis/CategoryChart.vue";
import TotalAmount from "@/components/analysis/TotalAmount.vue";
import AverageConsumption from "@/components/analysis/AverageConsumption.vue";
import { ref, onMounted } from "vue";

const props = defineProps({
  cardTransactionData: {
    type: Object,
    required: true,
  },
  accountTransactionData: {
    type: Object,
    required: true,
  },
  cardTransactionData: {
    type: Object,
    required: true,
  },
  accountTransactionData: {
    type: Object,
    required: true,
  },
});

console.log(props.cardTransactionData);
console.log(props.accountTransactionData);

const memberName = localStorage.getItem("memberName");

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

const startDate = ref();
const endDate = ref();

const getEndDay = (year, month) => {
  const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysInMonth[month];
}

onMounted(() => {
  startDate.value = new Date(year, month, 1);
  endDate.value = new Date(year, month, getEndDay(year, month));
});
</script>

<template>
  <div class="text-xl font-semibold mb-10">{{ memberName }}님의 {{ month }}월 소비 패턴을 분석해보았어요.</div>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
    <MostAndMaximumUsed period="이번 달" :start-date="startDate" :end-date="endDate"/>
    <div class="lg:col-span-1 flex flex-col justify-between gap-10">
      <TotalAmount :card-transaction-data="cardTransactionData" :account-transaction-data="accountTransactionData" />
      <AverageConsumption :card-transaction-data="cardTransactionData"
        :account-transaction-data="accountTransactionData" />
    </div>
    <CategoryChart class="lg:col-span-1" />
  </div>
</template>

<style scoped></style>
