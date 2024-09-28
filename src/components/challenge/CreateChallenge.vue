<script setup>
import { ref } from 'vue';
import { useChallengeStore } from '@/stores/challengeStore';

const memberIdx = localStorage.getItem("memberIdx");

const props = defineProps(['showModal']);
const emit = defineEmits(['close', 'challengeAdded']);

const challengeStore = useChallengeStore();

const detailedCategories = ref([]);  
const maxLimit = ref(100);  

const formData = ref({
  category: 1,
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
    await challengeStore.getChallengeList(formData.value.memberId);

    window.location.reload(); 
    resetForm();
    closeModal();
  }
};

const onConditionChange = () => {
  if (formData.value.challengeType === '0') {
    maxLimit.value = 100;  
  } else {
    maxLimit.value = 1000000;  
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
  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-96">
      <h3 class="text-xl font-semibold mb-4">나의 챌린지 등록하기</h3>
      <form @submit.prevent="confirmSubmission">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">챌린지 이름</label>
          <input type="text" v-model="formData.challengeName" class="form-input mt-1 block w-full border-gray-300 rounded-md" required />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">기간</label>
          <div class="flex space-x-2">
            <input type="date" v-model="formData.startDate" class="form-input w-1/2 border-gray-300 rounded-md" required />
            <span class="self-center">~</span>
            <input type="date" v-model="formData.endDate" class="form-input w-1/2 border-gray-300 rounded-md" required />
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">조건</label>
          <select v-model="formData.challengeType" @change="onConditionChange" class="form-select block w-full border-gray-300 rounded-md">
            <option value="0">횟수제한</option>
            <option value="1">제한금액</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">카테고리</label>
          <select v-model="formData.category" @change="onCategoryChange" class="form-select block w-full border-gray-300 rounded-md">
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

        <div v-if="detailedCategories.length > 0" class="mb-4">
          <p class="mb-1">반복된 항목들:</p>
          <div class="flex flex-wrap">
            <span 
              v-for="(category, index) in detailedCategories" 
              :key="index" 
              @click="selectDetailedCategory(category)"
              class="bg-gray-200 rounded-full px-3 py-1 text-sm mr-2 mb-2 cursor-pointer hover:bg-gray-300">
              {{ category }}
            </span>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">제한 횟수 / 제한 금액</label>
          <input type="range" v-model="formData.challengeLimit" :min="1" :max="maxLimit" class="form-range w-full" />
          <span class="mt-1 text-center block">{{ formData.challengeLimit }}</span>
        </div>

        <div class="flex justify-end space-x-2">
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">등록</button>
          <button type="button" class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400" @click="resetForm">취소</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>
