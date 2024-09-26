<template>
  <div class="list-group" style="margin-top: 50px;">
    <div
      class="list-group-item"
      v-for="(item, index) in challengeStore.challengeList"
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
        <!-- 도넛 차트 컴포넌트 추가 -->
        <DoughnutChart
          v-if="chartData.length > index"
          :limit="chartData[index].challengeLimit"
          :completed="chartData[index].cardHistoryCount"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useChallengeStore } from '@/stores/challengeStore';
import { ref, onMounted } from 'vue';
import DoughnutChart from './DoughnutChart.vue'; // 도넛 차트 컴포넌트 가져오기

const challengeStore = useChallengeStore();
const chartData = ref([]); // 서버에서 받은 데이터를 저장할 변수

// 페이지 로드 시 챌린지 목록과 차트 데이터 불러오기
onMounted(async () => {
  const memberId = 2;
  await challengeStore.fetchAllItems(memberId); // 챌린지 목록 불러오기
  chartData.value = await challengeStore.fetchChallengeLimitCardCount(memberId); // 차트 데이터 불러오기
});

// 챌린지 삭제 함수
const deleteChallenge = (id) => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    challengeStore.deleteChallenge(id); // 챌린지 삭제 메서드 호출
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

