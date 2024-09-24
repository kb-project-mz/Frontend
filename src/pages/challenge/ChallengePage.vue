<script setup>
import MyChallengeList from '@/components/challenge/MyChallengeList.vue';
import CreateChallenge from '@/components/challenge/CreateChallenge.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios'; // axios 추가

const showCreateModal = ref(false);
const challengeList = ref([]);

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
  challengeList.value.push(newChallenge);  // 챌린지 추가
};

// 데이터 로드
const fetchAllItems = () => {
  axios
  axios
  .get('http://localhost:8080/api/v1/challenge/list', {
    headers: {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkbGVrZHVkMDEwMiIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjcwNTkyNDksImV4cCI6MTcyNzQwNDg0OX0.6Z-07i5nQhAMBnzlcwfDXcSc-6wuL46bcn2hpx5wLxA"
    }
  })
  .then((res) => {
    if (res.data.success) {
      // Access the data field from the JSON response structure
      challengeList.value = res.data['data']['data'];  // Extracting the actual data
    } else {
      console.error(res.data.error.message);
    }
  })
  .catch((err) => {
    console.log(err);
  });
};

onMounted(() => {
  fetchAllItems();  // 페이지 로드 시 챌린지 목록 불러오기
});
</script>

<template>
  <div class="container" style="margin-top:80px; position:relative;">
    <h2>나의 챌린지 목록</h2>
    
    <div style="position: absolute; top: 0; right: 0;">
      <button class="btn btn-primary" @click="openCreateChallengeModal">챌린지 추가</button>
    </div> 

    <!-- 챌린지 목록 컴포넌트 -->
    <MyChallengeList :items="challengeList" />
    
    <!-- 챌린지 등록 모달 컴포넌트 -->
    <CreateChallenge :showModal="showCreateModal" @close="closeCreateChallengeModal" @challengeAdded="addNewChallenge" />
  </div>
</template>

<style scoped>
/* 스타일 생략 */
</style>
