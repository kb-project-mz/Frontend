<script setup>
import { useChallengeStore } from '@/stores/challengeStore';
import { ref, onMounted } from 'vue';
import DoughnutChart from './DoughnutChart.vue';

const memberIdx = localStorage.getItem("memberIdx");

const challengeStore = useChallengeStore();
const chartData = ref([]);

const deleteChallenge = (id) => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    challengeStore.deleteChallenge(id);
  }
};

onMounted(async () => {
  await challengeStore.getChallengeList(memberIdx);
  await challengeStore.getChallengeStatus(memberIdx);
  chartData.value = challengeStore.chartData;
});
</script>

<template>
  <div class="list-group" style="margin-top: 50px;">
    <div
      class="list-group-item"
      v-for="(item, index) in challengeStore.challengeList"
      :key="item.id"
      style="position: relative; padding: 20px; border: 1px solid #ddd;"
    >
      <!-- 챌린지 정보 표시 -->
      <div class="challenge-details">
        <p><strong>이름:</strong> {{ item.challengeName }}</p>
        <p><strong>기간:</strong> {{ item.startDate }} ~ {{ item.endDate }}</p>
        <p><strong>조건:</strong> {{ item.challengeType === 0 ? '횟수제한' : '제한금액' }}</p>
        <p><strong>제한 횟수 / 제한 금액:</strong> {{ item.challengeLimit }}</p>
        <p><strong>세부 카테고리:</strong> {{ item.detailedCategory }}</p>
      </div>

      <!-- 삭제 버튼과 차트를 포함하는 div -->
      <div class="action-container">
        <!-- 도넛 차트 컴포넌트 -->
        <div class="chart-container">
          <DoughnutChart
            v-if="chartData.length > index"
            :limit="chartData[index].challengeLimit"
            :completed="chartData[index].cardHistoryCount"
          />
        </div>

        <!-- 삭제 버튼 -->
        <button class="btn btn-danger" @click="deleteChallenge(item.id)">
          삭제하기
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-group-item {
  position: relative;
  padding: 20px;
  padding-bottom: 60px; /* 차트와 삭제 버튼을 위한 하단 공간 추가 */
  border: 1px solid #ddd;
}

/* 삭제 버튼과 차트를 나란히 배치하기 위한 스타일 */
.action-container {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  align-items: center; /* 버튼과 차트가 수평으로 정렬되도록 설정 */
  gap: 10px; /* 버튼과 차트 사이의 간격 설정 */
}

.chart-container {
  width: 100px; /* 차트 크기 조절 */
  height: 100px;
}

.btn-danger {
  /* 별도의 위치 설정 필요 없음, flexbox에서 자동으로 정렬됨 */
}
</style>
