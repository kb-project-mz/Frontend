<script setup>
import { defineProps, ref, onMounted } from 'vue';

const props = defineProps({
  historyData: {
    type: Array,
    required: true,
  },
});

const totalIncome = ref(0);

const getTotalIncome = () => {
  return props.historyData.reduce((total, item) => {
    return total + item.amount;
  }, 0);
};

onMounted(() => {
  totalIncome.value = getTotalIncome();
});
</script>

<template>
  <div class="py-5 px-8 bg-white border border-gray-200 rounded-2xl shadow flex justify-between items-center">
    <div class="font-medium">이번 달 총 지출</div>
    <div class="text-red font-bold text-xl">{{ totalIncome.toLocaleString() }}원</div>
  </div>
</template>

<style scoped>
.text-red {
  color: #F55151;
}
</style>
