<script setup>
import MyChallengeList from '@/components/challenge/MyChallengeList.vue';
import CreateChallenge from '@/components/challenge/CreateChallenge.vue';
import { ref, onMounted } from 'vue';
import { useChallengeStore } from '@/stores/challengeStore'; // Pinia 스토어 가져오기

const showCreateModal = ref(false);
const challengeStore = useChallengeStore(); // Pinia 스토어 초기화

// 챌린지 추가 버튼 클릭 시 모달 열기
const openCreateChallengeModal = () => {
  showCreateModal.value = true;
};

// 모달 닫기
const closeCreateChallengeModal = () => {
  showCreateModal.value = false;
};

// 새로운 챌린지를 리스트에 추가
const addNewChallenge = (newChallenge) => {
  challengeStore.addNewChallenge(newChallenge);  // Pinia의 메서드 호출
};

// 페이지 로드 시 챌린지 목록 불러오기
onMounted(() => {
  const memberId = 2; 
  challengeStore.fetchAllItems(memberId);  // Pinia의 메서드 호출
});
</script>

<template>
  <div class="container" style="margin-top:80px; position:relative;">
    <h2>나의 챌린지 목록</h2>
    
    <div style="position: absolute; top: 0; right: 0;">
      <button class="btn btn-primary" @click="openCreateChallengeModal">챌린지 추가</button>
    </div> 

    <!-- 챌린지 목록 컴포넌트 -->
    <MyChallengeList :items="challengeStore.challengeList" />
    
    <!-- 챌린지 등록 모달 컴포넌트 -->
    <CreateChallenge :showModal="showCreateModal" @close="closeCreateChallengeModal" @challengeAdded="addNewChallenge" />
  </div>
</template>

<style scoped>
/* 기본 스타일 */
.container {
  margin-top: 80px;
  position: relative;
}
.btn {
  margin-top: 10px;
}
</style>







