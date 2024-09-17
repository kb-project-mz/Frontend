<script setup>
import { ref, onMounted } from 'vue';
import { useConsumptionAnalysisStore } from '@/stores/consumption-analysis';

const consumptionAnalysisStore = useConsumptionAnalysisStore();
const mostUsed = ref({});
const maximumAmount = ref({});

const fetchConsumptionAnalysis = async (memberId, startYear, startMonth, startDay, endYear, endMonth, endDay) => {
  await consumptionAnalysisStore.getMostAndMaximumUse(memberId, startYear, startMonth, startDay, endYear, endMonth, endDay);
  mostUsed.value = formatMostUsed(consumptionAnalysisStore.mostUsed);
  maximumAmount.value = formatMostUsed(consumptionAnalysisStore.maximumAmount);
}

const formatMostUsed = (dataStr) => {
  const result = {};
  
  if (dataStr) {
    const items = dataStr.replace(/[\[\]"]/g, '').split(', ');
    items.forEach(item => {
      const [key, value] = item.split(':');
      result[key.trim()] = parseInt(value.trim());
    });
  }

  return result;
}

onMounted(() => {
  fetchConsumptionAnalysis(1, 2024, 9, 1, 2024, 9, 30);
});
</script>

<template>
  <div>
    <h2>최다 횟수 소비 내역</h2>
    <ul>
      <li v-for="(value, key, index) in mostUsed" :key="index">
        {{ key }}: {{ value }}
      </li>
    </ul>
    <h2>최대 금액 소비 내역</h2>
    <ul>
      <li v-for="(value, key, index) in maximumAmount" :key="index">
        {{ key }}: {{ value }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
  
</style>
