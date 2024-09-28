<script setup>
import { ref, onMounted } from 'vue';
import { useChallengeStore } from '@/stores/challengeStore';
import ChallengeComponent from './ChallengeComponent.vue';

const memberIdx = localStorage.getItem("memberIdx");
const challengeStore = useChallengeStore();
const chartData = ref([]);

onMounted(async () => {
  await challengeStore.getChallengeList(memberIdx);
  await challengeStore.getChallengeStatus(memberIdx);
  chartData.value = challengeStore.chartData;
});
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ChallengeComponent v-for="(challenge, index) in challengeStore.challengeList"
        :key="index"
        :challenge="challenge"
        :chartData="chartData[index]" />
    </div>
  </div>
</template>

<style scoped>

</style>
