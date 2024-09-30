<script setup>
import { ref } from 'vue';
import { useChallengeStore } from '@/stores/challenge';

const memberIdx = localStorage.getItem("memberIdx");

const props = defineProps(['showModal']);
const emit = defineEmits(['close', 'challengeAdded']);

const challengeStore = useChallengeStore();

const detailedCategories = ref([]);
const maxLimit = ref(100);
const limitMessage = ref("제한 횟수");

const formData = ref({
  memberIdx: memberIdx,
  challengeName: '',
  challengeType: '횟수',
  challengeLimit: 0,
  categoryIdx: 1,
  detailedCategory: '',
  challengeStatus: '',
  challengeStartDate: '',
  challengeEndDate: '',
  isPublic: 1,
});

const closeModal = () => {
  formData.value = {
    memberIdx: memberIdx,
    challengeName: '',
    challengeType: '횟수',
    challengeLimit: 0,
    categoryIdx: 1,
    detailedCategory: '',
    challengeStatus: '',
    challengeStartDate: '',
    challengeEndDate: '',
    isPublic: 1,
  };
  detailedCategories.value = [];
  emit('close');
};

const confirmSubmission = async () => {
  if (window.confirm('한번 등록한 챌린지는 수정할 수 없습니다. 이대로 진행하시겠습니까?')) {
    await challengeStore.insertChallenge(formData.value);
    await challengeStore.getChallengeList(formData.value.memberIdx);

    window.location.reload();
    closeModal();
  }
};

const onConditionChange = () => {
  if (formData.value.challengeType === '횟수') {
    maxLimit.value = 100;
    limitMessage.value = "제한 횟수";
  } else {
    maxLimit.value = 1000000;
    limitMessage.value = "제한 금액"
  }
};

const onCategoryChange = async () => {
  await challengeStore.getDetailedCategory(memberIdx, formData.value.categoryIdx);
  detailedCategories.value = challengeStore.detailedCategories;
};

const selectDetailedCategory = (detailedCategory) => {
  formData.value.detailedCategory = detailedCategory;
};
</script>

<template>
  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30" @click="closeModal">
    <div class="bg-white p-5 rounded-lg shadow-lg fixed box-border" @click.stop>
      <h3 class="text-xl font-semibold mb-4 text-center">나의 챌린지 등록하기</h3>
      <form @submit.prevent="confirmSubmission">
        <div>
          <label for="challengeName" class="block text-sm font-medium mb-1">챌린지 이름</label>
          <input id="challengeName" type="text" v-model="formData.challengeName" class="bg-gray border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2" required />
        </div>

        <div class="mb-4">
          <label for="challengeDuration" class="block text-sm font-medium mb-1">기간</label>
          <div class="flex">
            <input type="date" v-model="formData.challengeStartDate" class="form-input border-gray-300 rounded-md" required />
            <span class="self-center">-</span>
            <input type="date" v-model="formData.challengeEndDate" class="form-input border-gray-300 rounded-md" required />
          </div>
        </div>

        <div class="mb-4">
          <label for="challengeType" class="block text-sm font-medium mb-1">조건</label>
          <select v-model="formData.challengeType" @change="onConditionChange" class="form-select block w-full border-gray-300 rounded-md">
            <option value="횟수">횟수 제한</option>
            <option value="금액">금액 제한</option>
          </select>
        </div>

        <div class="mb-4">
          <label for="categoryIdx" class="block text-sm font-medium mb-1">카테고리</label>
          <select v-model="formData.categoryIdx" @change="onCategoryChange" class="form-select block w-full border-gray-300 rounded-md">
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
          <label for="challengeLimit" class="block text-sm font-medium mb-1">{{ limitMessage }}</label>
          <input type="range" v-model="formData.challengeLimit" :min="0" :max="maxLimit" :step="formData.challengeType === '횟수' ? 1 : 100" class="form-range w-full" />
          <span class="mt-1 text-center block">{{ formData.challengeLimit }}</span>
        </div>

        <div class="flex justify-end space-x-2">
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">등록</button>
          <button type="button" class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400" @click="closeModal">취소</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>
