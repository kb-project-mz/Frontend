<template>
  <div class="list-group" style="margin-top: 50px;">
    <div
      class="list-group-item"
      v-for="item in challengeStore.challengeList"
      :key="item.id"
      style="position: relative; padding: 20px; border: 1px solid #ddd;"
    >
      <button class="btn btn-danger" style="position: absolute; top: 10px; right: 10px;" @click="deleteChallenge(item.id)">
        삭제하기
      </button>
      <div>
        <p><strong>이름:</strong> {{ item.challengeName }}</p>
        <p><strong>기간:</strong> {{ item.startDate }} ~ {{ item.endDate }}</p>
        <p><strong>조건:</strong> {{ item.challengeType === 0 ? '횟수제한' : '제한금액' }}</p>
        <p><strong>제한 횟수 / 제한 금액:</strong> {{ item.challengeLimit }}</p>
        <p><strong>세부 카테고리:</strong> {{ item.detailedCategory }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useChallengeStore } from '@/stores/challengeStore'; // Pinia 스토어 가져오기

const challengeStore = useChallengeStore(); // Pinia 스토어 초기화

const deleteChallenge = (id) => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    challengeStore.deleteChallenge(id);  // Pinia 메서드 호출
  }
};
</script>

<style scoped>
.list-group-item {
  position: relative;
  padding: 20px;
  border: 1px solid #ddd;
}
.btn-danger {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>


