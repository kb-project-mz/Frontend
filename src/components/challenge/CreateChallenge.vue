<script setup>
import { ref } from 'vue';
import { useChallengeStore } from '@/stores/challengeStore';

const memberIdx = localStorage.getItem("memberIdx");

const props = defineProps(['showModal']);
const emit = defineEmits(['close', 'challengeAdded']);

const challengeStore = useChallengeStore();

const detailedCategories = ref([]);  // OpenAI의 응답을 저장하는 배열
const maxLimit = ref(100);  // 기본값으로 횟수제한일 경우 최대값 100

const formData = ref({
  category: 1, // 기본값: 식비
  memberId: memberIdx,
  challengeName: '',
  challengeType: '0',
  challengeLimit: 1,
  startDate: '',
  endDate: '',
  detailedCategory: ''
});

const closeModal = () => {
  emit('close');
};

const resetForm = () => {
  formData.value = {
    category: 1,
    memberId: memberIdx,
    challengeName: '',
    challengeType: '0',
    challengeLimit: 1,
    startDate: '',
    endDate: '',
    detailedCategory: ''
  };
  detailedCategories.value = [];
  closeModal();
};

const confirmSubmission = async () => {
  if (window.confirm('한번 등록한 챌린지는 수정할 수 없습니다. 이대로 진행하시겠습니까?')) {
    await challengeStore.insertChallenge(formData.value);
    await challengeStore.getChallengeList(formData.value.memberId); // 새로고침 전에 삭제버튼 클릭시 삭제 안되는 문제 해결

    window.location.reload(); 
    resetForm();
    closeModal();
  }
};

// 조건이 변경될 때마다 maxLimit 값을 동적으로 변경
const onConditionChange = () => {
  if (formData.value.challengeType === '0') {
    maxLimit.value = 100;  // 횟수 제한일 때 최대 100
  } else {
    maxLimit.value = 1000000;  // 금액 제한일 때 최대 1,000,000원
  }
};

const onCategoryChange = async () => {
  await challengeStore.getDetailedCategory(memberIdx, formData.value.category);
  detailedCategories.value = challengeStore.detailedCategories;
};

const selectDetailedCategory = (category) => {
  formData.value.detailedCategory = category;
};
</script>

<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h3>나의 챌린지 등록하기</h3>
      <form @submit.prevent="confirmSubmission">
        <div class="form-group">
          <label>챌린지 이름</label>
          <input type="text" v-model="formData.challengeName" class="form-control" required />
        </div>

        <div class="form-group">
          <label>기간</label>
          <input type="date" v-model="formData.startDate" class="form-control" required /> ~
          <input type="date" v-model="formData.endDate" class="form-control" required />
        </div>

        <div class="form-group">
          <label>조건</label>
          <select v-model="formData.challengeType" @change="onConditionChange" class="form-control">
            <option value="0">횟수제한</option>
            <option value="1">제한금액</option>
          </select>
        </div>

        <div class="form-group">
          <label>카테고리</label>
          <select v-model="formData.category" @change="onCategoryChange" class="form-control">
            <option value="1">식비</option>
            <option value="2">카페/디저트</option>
            <option value="3">교통비</option>
            <option value="4">미용</option>
            <option value="5">취미</option>
            <option value="6">주거/통신</option>
            <option value="7">의류</option>
            <option value="8">의료/건강</option>
            <option value="9">여행</option>
            <option value="10">생필품</option>
            <option value="11">미분류</option>
          </select>
        </div>

        <div v-if="detailedCategories.length > 0" class="detailed-categories">
          <p>반복된 항목들:</p>
          <div>
            <span 
              v-for="(category, index) in detailedCategories" 
              :key="index" 
              @click="selectDetailedCategory(category)"
              class="category-chip">
              {{ category }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label>제한 횟수 / 제한 금액</label>
          <input type="range" v-model="formData.challengeLimit" :min="1" :max="maxLimit" class="custom-range form-control" />
          <span>{{ formData.challengeLimit }}</span>
        </div>

        <div class="modal-actions">
          <button type="submit" class="btn btn-primary">등록</button>
          <button type="button" class="btn btn-secondary" @click="resetForm">취소</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.detailed-categories {
  margin: 15px 0;
}

.category-chip {
  display: inline-block;
  padding: 5px 10px;
  margin-right: 5px;
  background-color: #f0f0f0;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.category-chip:hover {
  background-color: #ddd;
}
</style>
