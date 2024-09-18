<script setup>
import { ref, onMounted } from 'vue';
import { useConsumptionAnalysisStore } from '@/stores/consumption-analysis';

const consumptionAnalysisStore = useConsumptionAnalysisStore();
const mostUsed = ref({});
const maximumAmount = ref({});

const fetchConsumptionAnalysis = async (memberId, startYear, startMonth, startDay, endYear, endMonth, endDay) => {
  await consumptionAnalysisStore.getMostAndMaximumUse(memberId, startYear, startMonth, startDay, endYear, endMonth, endDay);
  const formattedData = formatMostUsed(consumptionAnalysisStore.mostAndMaximum);
  
  mostUsed.value = formattedData.mostUsed;
  maximumAmount.value = formattedData.maximumAmount;
}

const formatMostUsed = (dataStr) => {
  const result = {
    mostUsed: {},
    maximumAmount: {}
  }
  
  if (dataStr) {
    const lists = dataStr.split('], [');
    
    if (lists[0]) {
      const items1 = lists[0].replace(/[\[\]]/g, '').split(', ');
      items1.forEach(item => {
        const [key, value] = item.split(':');
        result.mostUsed[key.trim()] = parseInt(value.trim());
      });
    }
    
    if (lists[1]) {
      const items2 = lists[1].replace(/[\[\]]/g, '').split(', ');
      items2.forEach(item => {
        const [key, value] = item.split(':');
        result.maximumAmount[key.trim()] = parseInt(value.trim());
      });
    }
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
