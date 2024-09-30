<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  CardTransactionData: {
    type: Array,
    required: true,
  },
  accountTransactionData: {
    type: Array,
    required: true,
  }
});

const totalIncome = ref(0);
const totalOutcome = ref(0);

const getTotalIncome = () => {
  const accountTotal = props.accountTransactionData.reduce((total, item) => {
    return total + Math.abs(item.amount > 0 ? item.amount : 0);
  }, 0);

  return accountTotal;
};

const getTotalOutcome = () => {
  const cardTotal = props.CardTransactionData.reduce((total, item) => {
    return total + item.amount;
  }, 0);

  const accountTotal = props.accountHistoryData.reduce((total, item) => {
    return total + Math.abs(item.amount < 0 ? item.amount : 0);
  }, 0);

  return historyTotal + accountTotal;
};

onMounted(() => {
  totalIncome.value = getTotalIncome();
  totalOutcome.value = getTotalOutcome();
});

watch([() => props.historyData, () => props.accountHistoryData], () => {
  totalIncome.value = getTotalIncome();
  totalOutcome.value = getTotalOutcome();
});
</script>

<template>
  <div class="py-5 px-10 bg-gray-100 border border-gray-200 rounded-2xl shadow">
    <div class="flex items-center justify-between mb-2 w-64">
      <div class="w-1/2 font-medium">이번 달 총 수입</div>
      <div class="font-bold text-lg">{{ totalIncome.toLocaleString() }}원</div>
    </div>
    <div class="flex items-center justify-between">
      <div class="w-1/2 font-medium">이번 달 총 지출</div>
      <div div class="font-bold text-lg text-red">{{ totalOutcome.toLocaleString() }}원</div>
    </div>
    
  </div>
</template>

<style scoped>
.text-blue {
  color: #0B1573;
}
.text-red {
  color: #F55151;
}
</style>
