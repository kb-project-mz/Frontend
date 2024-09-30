<script setup>
import MyChallengeList from '@/components/challenge/MyChallengeList.vue';
import CreateChallenge from '@/components/challenge/CreateChallenge.vue';
import { ref, onMounted } from 'vue';
import { useChallengeStore } from '@/stores/challengeStore';

const memberIdx = localStorage.getItem("memberIdx");

const showCreateModal = ref(false);
const challengeStore = useChallengeStore();

const openCreateChallengeModal = () => {
  showCreateModal.value = true;
};

const closeCreateChallengeModal = () => {
  showCreateModal.value = false;
};

const addNewChallenge = (newChallenge) => {
  challengeStore.addNewChallenge(newChallenge);
};

onMounted(() => { 
  challengeStore.getChallengeList(memberIdx);
});
</script>

<template>
  <div class="mx-[20%] px-8 py-4 bg-white border border-gray-200 rounded-2xl shadow">
    <div class="text-2xl font-bold mb-4">나의 챌린지 목록</div> 
    <button class="px-3 py-2 rounded-xl bg-navy text-white" @click="openCreateChallengeModal">챌린지 추가</button>

    <MyChallengeList :items="challengeStore.challengeList" />
    <CreateChallenge :showModal="showCreateModal" @close="closeCreateChallengeModal" @challengeAdded="addNewChallenge" />
  </div>
</template>

<style scoped>
.bg-navy{ 
  background-color: #0B1573;
}
</style>
