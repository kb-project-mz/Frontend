<script setup>
import { defineProps, ref, onMounted, watch } from 'vue';

const props = defineProps({
  historyData: {
    type: Array,
    required: true,
  },
  accountHistoryData: {
    type: Array,
    required: true,
  }
});

const totalOutcome = ref(0);

const getTotalOutcome = () => {
  const historyTotal = props.historyData.reduce((total, item) => {
    return total + item.amount;
  }, 0);

  const accountTotal = props.accountHistoryData.reduce((total, item) => {
    return total + Math.abs(item.amount < 0 ? item.amount : 0);
  }, 0);
  console.log(accountTotal);

  return historyTotal + accountTotal;
};

onMounted(() => {
  totalOutcome.value = getTotalOutcome();
});

watch([() => props.historyData, () => props.accountHistoryData], () => {
  totalOutcome.value = getTotalOutcome();
});
</script>

<template>
  <div class="py-5 px-8 bg-white border border-gray-200 rounded-2xl shadow flex justify-between items-center">
    <div class="font-medium">이번 달 총 지출</div>
    <div class="text-red font-bold text-xl">{{ totalOutcome.toLocaleString() }}원</div>
  </div>
</template>

<style scoped>
.text-red {
  color: #F55151;
}
</style>
