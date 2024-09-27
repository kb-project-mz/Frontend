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
  <div class="container" style="margin-top:80px; position:relative;">
    <h2>나의 챌린지 목록</h2>
    
    <div style="position: absolute; top: 0; right: 0;">
      <button class="btn btn-primary" @click="openCreateChallengeModal">챌린지 추가</button>
    </div> 

    <MyChallengeList :items="challengeStore.challengeList" />
    <CreateChallenge :showModal="showCreateModal" @close="closeCreateChallengeModal" @challengeAdded="addNewChallenge" />
  </div>
</template>

<style scoped>
.container {
  margin-top: 80px;
  position: relative;
}
.btn {
  margin-top: 10px;
}
</style>
