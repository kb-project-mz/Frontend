<script setup>
import { ref, onMounted } from "vue";
import { useChallengeStore } from "@/stores/challenge";
import ChallengeComponent from "./ChallengeComponent.vue";
import CreateChallenge from "@/components/challenge/CreateChallenge.vue";

const authData = JSON.parse(localStorage.getItem("auth"));
const memberIdx = authData.memberIdx;

const challengeStore = useChallengeStore();
const chartData = ref([]);

const showCreateModal = ref(false);

const openCreateChallengeModal = () => {
  showCreateModal.value = true;
};

const closeCreateChallengeModal = () => {
  showCreateModal.value = false;
};

const addNewChallenge = (newChallenge) => {
  challengeStore.addNewChallenge(newChallenge);
};

onMounted(async () => {
  await challengeStore.getChallengeList(memberIdx);
  await challengeStore.getChallengeStatus(memberIdx);
  chartData.value = challengeStore.chartData;
});
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <div class="text-xl font-bold text-center flex-grow">
        나의 챌린지 목록
      </div>
      <button
        class="px-3 py-2 rounded-full bg-customBlue text-white text-xs"
        @click="openCreateChallengeModal"
      >
        추가
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
      <ChallengeComponent
        v-for="(challenge, index) in challengeStore.challengeList"
        :key="index"
        :challenge="challenge"
        :chartData="chartData[index]"
      />
    </div>
    <CreateChallenge
      :showModal="showCreateModal"
      @close="closeCreateChallengeModal"
      @challengeAdded="addNewChallenge"
    />
  </div>
</template>

<style scoped>

</style>
