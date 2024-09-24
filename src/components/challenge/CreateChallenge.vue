<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h3>나의 챌린지 등록하기</h3>
      <form @submit.prevent="confirmSubmission">
        <div class="form-group">
          <label>Member ID</label>
          <input type="number" v-model="formData.memberId" class="form-control" required />
        </div>

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
          <select v-model="formData.challengeType" class="form-control">
            <option value="0">횟수제한</option>
            <option value="1">제한금액</option>
          </select>
        </div>

        <div class="form-group">
          <label>카테고리</label>
          <select v-model="formData.category" @change="fetchDetailedCategory(formData.category)" class="form-control">
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

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import axios from 'axios';

const props = defineProps(['showModal']);
const emit = defineEmits(['close', 'challengeAdded']);

const formData = ref({
  category: 1, // 기본값: 식비
  memberId: 0,
  challengeName: '',
  challengeType: '0',
  challengeLimit: 1,
  startDate: '',
  endDate: '',
  detailedCategory: ''
});

const detailedCategories = ref([]);  // OpenAI의 응답을 저장하는 배열
const maxLimit = ref(1);

const closeModal = () => {
  emit('close');
};

const confirmSubmission = () => {
  if (window.confirm('한번 등록한 챌린지는 수정할 수 없습니다. 이대로 진행하시겠습니까?')) {
    submitForm();
  }
};

// Fetch detailed categories when a category is selected
const fetchDetailedCategory = (categoryId) => {
  axios
    .post("http://localhost:8080/api/v1/challenge/detailedCategory", { category: categoryId }, {
      headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkbGVrZHVkMDEwMiIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjcwNTkyNDksImV4cCI6MTcyNzQwNDg0OX0.6Z-07i5nQhAMBnzlcwfDXcSc-6wuL46bcn2hpx5wLxA"
      }
    })
    .then((res) => {
      if (res.data.success) {
        detailedCategories.value = res.data.data.detailedCategories; 
      } else {
        console.error("Error from server:", res.data.error.message);
      }
    })
    .catch((err) => {
      console.error("Error fetching detailed categories:", err);
    });
};

// 사용자가 상세 카테고리를 클릭하면 formData에 저장
const selectDetailedCategory = (category) => {
  formData.value.detailedCategory = category;
};

const submitForm = () => {
  axios.post("http://localhost:8080/api/v1/challenge/write", formData.value, {
    headers: {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkbGVrZHVkMDEwMiIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjcwNTkyNDksImV4cCI6MTcyNzQwNDg0OX0.6Z-07i5nQhAMBnzlcwfDXcSc-6wuL46bcn2hpx5wLxA"
    }
  })
  .then((res) => {
    if (res.data.success) {
      emit('challengeAdded', formData.value);  // 성공 시 데이터 전송
      resetForm();  // 폼 데이터 초기화
      closeModal();
    } else {
      console.error(res.data.error.message);  // 오류 처리
    }
  })
  .catch(err => {
    console.log(err);
  });
};

// 폼 데이터 초기화 함수
const resetForm = () => {
  formData.value = {
    category: 1, // 기본값: 식비
    memberId: 0,
    challengeName: '',
    challengeType: '0',
    challengeLimit: 1,
    startDate: '',
    endDate: '',
    detailedCategory: ''
  };
  detailedCategories.value = [];  // 상세 카테고리도 초기화
  closeModal();  // 모달 닫기
};
</script>

<style scoped>
/* 모달 스타일 */
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
