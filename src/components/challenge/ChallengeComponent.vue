<script setup>
import { defineProps } from 'vue';
import DoughnutChart from './DoughnutChart.vue';
import { useChallengeStore } from '@/stores/challengeStore';

const memberIdx = localStorage.getItem("memberIdx");

const challengeStore = useChallengeStore();

const props = defineProps({
  challenge: Object,
  chartData: Object,
});

const deleteChallenge = async (id) => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    await challengeStore.deleteChallenge(id);
    await challengeStore.getChallengeList(memberIdx);
  }
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg p-4 flex flex-col">
    <h2 class="text-lg font-semibold">{{ challenge.challengeName }}</h2>
    <p class="text-gray-600">카테고리: {{ challenge.category }}</p>
    <p class="text-gray-600">소분류: {{ challenge.detailedCategory }}</p>
    <p class="text-gray-600">조건: {{ challenge.challengeType === 0 ? '횟수제한' : '제한금액' }}</p>
    <p class="text-gray-600">제한 횟수, 제한 금액: {{ challenge.challengeLimit }}</p>
    <p class="text-gray-600">기간: {{ challenge.startDate }} - {{ challenge.endDate }}</p>
    <div class="mt-2">
      <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" @click="deleteChallenge(challenge.id)">삭제</button>
    </div>
    <DoughnutChart
      v-if="chartData"
      :limit="chartData.challengeLimit"
      :completed="chartData.cardHistoryCount"
    />
  </div>
</template>

<style scope>

</style>
