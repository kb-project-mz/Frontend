<script setup>
import { defineProps, ref, onMounted, watch } from 'vue';

const props = defineProps({
  accountHistoryData: {
    type: Array,
    required: true,
  }
});

const totalIncome = ref(0);

const getTotalIncome = () => {
  const accountTotal = props.accountHistoryData.reduce((total, item) => {
    return total + Math.abs(item.amount > 0 ? item.amount : 0);
  }, 0);

  return accountTotal;
};

onMounted(() => {
  totalIncome.value = getTotalIncome();
});

watch([ () => props.accountHistoryData], () => {
  totalIncome.value = getTotalIncome();
});
</script>

<template>
  <div class="py-5 px-8 bg-white border border-gray-200 rounded-2xl shadow flex justify-between items-center">
    <div class="font-medium">이번 달 총 수입</div>
    <div class="text-blue font-bold text-xl">{{ totalIncome.toLocaleString() }}원</div>
  </div>
</template>

<style scoped>
.text-blue {
  color: #0E9CFF;
}
</style>
