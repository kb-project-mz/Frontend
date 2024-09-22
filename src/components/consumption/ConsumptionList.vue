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
  <h1>이번 달 소비 내역</h1>
  <table>
    <thead>
      <tr>
        <th>카드사</th>
        <th>카드 이름</th>
        <th>카드 사진</th>
        <th>사용 날짜</th>
        <th>사용 시간</th>
        <th>카테고리</th>
        <th>사용처</th>
        <th>가격</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(history, index) in historyData" :key="index">
        <td>{{ history.bankName }}</td>
        <td>{{ history.cardName }}</td>
        <td><img :src="history.cardImage" alt="Card Image"/></td>
        <td>{{ history.consumptionDate }}</td>
        <td>{{ history.consumptionTime }}</td>
        <td>{{ history.category }}</td>
        <td>{{ history.content }}</td>
        <td>{{ history.amount }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
img {
  width: 50px;
}
</style>
