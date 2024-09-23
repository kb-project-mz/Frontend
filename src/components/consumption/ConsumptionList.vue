<script setup>
import { ref, onMounted } from 'vue';
import { useConsumptionHistoryStore } from '@/stores/consumption-history';

const consumptionHistoryStore = useConsumptionHistoryStore();
const historyData = ref([]);

const fetchConsumptionHistory = async (memberId) => {
  await consumptionHistoryStore.getCardHistoryList(memberId);
  historyData.value = consumptionHistoryStore.cardHistoryThisMonth;
}

onMounted(() =>  {
  fetchConsumptionHistory(1);
});
</script>

<template>
  <div class="mt-2 text-center font-bold text-lg">이번 달 자산 흐름</div>
  <div class="border-b border-gray-300 my-2"></div>
  <div v-for="(history, index) in historyData" :key="index">
    <div class="flex justify-center">
      <div class="w-8/12 flex items-center justify-between">
        <div class="">
          <div class="text-sm">{{ history.consumptionDate }}  {{ history.consumptionTime }}</div>
          <div class="text-xl my-1">{{ history.content }}</div>
          <div class="text-sm">{{ history.cardName }}</div>
        </div>
        <div class="">
          <div><span class="text-xl">{{ history.amount.toLocaleString() }}</span>원</div>
        </div>
      </div>
    </div>
    <div class="border-b border-gray-300 my-2"></div>
  </div>
</template>

<style scoped>
img {
  width: 50px;
}
</style>
