<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h3>나의 챌린지 등록하기</h3>
      <form @submit.prevent="confirmSubmission">
        <div class="form-group">
          <label>Member ID</label>
          <input type="number" v-model="formData.memberId" class="form-control" />
        </div>

        <div class="form-group">
          <label>챌린지 이름</label>
          <input type="text" v-model="formData.challengeName" class="form-control" />
        </div>

        <div class="form-group">
          <label>기간</label>
          <input type="date" v-model="formData.startDate" class="form-control" /> ~
          <input type="date" v-model="formData.endDate" class="form-control" />
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

        <!-- OpenAI의 응답을 표시하는 부분 -->
        <div v-if="openAiResponse" class="detailed-categories">
          <p>반복된 항목들:</p>
          <span>{{ openAiResponse }}</span>
        </div>

        <div class="form-group">
          <label>제한 횟수 / 제한 금액</label>
          <input type="range" v-model="formData.challengeLimit" :min="1" :max="maxLimit" class="custom-range form-control" />
          <span>{{ formData.challengeLimit }}</span>
        </div>

        <div class="modal-actions">
          <button type="submit" class="btn btn-primary">등록</button>
          <button type="button" class="btn btn-secondary" @click="closeModal">취소</button>
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
  detailedCategory:''
});

const openAiResponse = ref('');  // OpenAI의 응답을 저장하는 변수
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
        // OpenAI의 응답을 JsonResponse에서 추출하여 화면에 표시
        openAiResponse.value = res.data.data.response; 
      } else {
        console.error("Error from server:", res.data.error.message);
      }
    })
    .catch((err) => {
      console.error("Error fetching detailed categories:", err);
    });
};

const submitForm = () => {
  axios.post("http://localhost:8080/api/v1/challenge/write", formData.value, {
    headers: {
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkbGVrZHVkMDEwMiIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjcwNTkyNDksImV4cCI6MTcyNzQwNDg0OX0.6Z-07i5nQhAMBnzlcwfDXcSc-6wuL46bcn2hpx5wLxA"
    }
  })
  .then((res) => {
    if (res.data.success) {
      emit('challengeAdded', formData.value);  // Emit event only on success
      closeModal();
    } else {
      console.error(res.data.error.message);  // Handle backend error
    }
  })
  .catch(err => {
    console.log(err);
  });
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
}
</style>
