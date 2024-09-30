<script setup>
import MostAndMaximumUsed from "@/components/consumption/MostAndMaximumUsed.vue";
import CategoryChart from "@/components/consumption/CategoryChart.vue";
import TotalAmount from "@/components/consumption/TotalAmount.vue";
import AverageConsumption from "@/components/consumption/AverageConsumption.vue";

const props = defineProps({
  cardTransactionThisMonthData: {
    type: Object,
    required: true
  },
  accountTransactionThisMonthData: {
    type: Object,
    required: true
  }
});

const memberName = localStorage.getItem("memberName");
const month = new Date().getMonth() + 1;
</script>

<template>
  <div class="text-xl font-semibold mb-3">{{ memberName }}님의 {{ month }}월 소비 패턴을 분석해보았어요.</div>
  <div class="flex justify-between">
    <MostAndMaximumUsed period="이번 달" />
    <div class="flex flex-col justify-between">
      <TotalAmount :history-data="cardTransactionThisMonthData" :account-history-data="accountTransactionThisMonthData" />
      <AverageConsumption />
    </div>
    <CategoryChart />
  </div>
</template>

<style scoped>

</style>
