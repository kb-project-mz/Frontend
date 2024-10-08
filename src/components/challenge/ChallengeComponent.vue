<script setup>
import { defineProps } from "vue";
import DoughnutChart from "./DoughnutChart.vue";
import ProgressBar from "./ProgressBar.vue";
import { useChallengeStore } from "@/stores/challenge";

const authData = JSON.parse(localStorage.getItem("auth"));
const memberIdx = authData.memberIdx;

const challengeStore = useChallengeStore();

const props = defineProps({
  challenge: Object,
  chartData: Object,
});

const formatDate = (date) => {
  return date.split("-").join(".");
};

const deleteChallenge = async (challengeIdx) => {
  if (confirm("정말로 삭제하시겠습니까?")) {
    await challengeStore.deleteChallenge(challengeIdx);
    await challengeStore.getChallengeList(memberIdx);
  }
};
</script>

<template>
  <div
    :class="[
      'bg-white rounded-lg shadow p-4',
      challenge.challengeStatus === '성공'
        ? 'bg-green-100 text-green-800'
        : challenge.challengeStatus === '실패'
        ? 'bg-red-100 text-red-800'
        : '',
    ]"
  >
    <div class="flex space-x-5">
      <div class="flex flex-col text-end text-gray-600 space-y-2">
        <div>이름</div>
        <div>카테고리</div>
        <div>소분류</div>
        <div>
          {{ challenge.challengeType == "횟수" ? "제한 횟수" : "제한 금액" }}
        </div>
        <div>기간</div>
      </div>
      <div class="flex-grow space-y-2">
        <div class="flex justify-between items-center">
          <span class="font-bold">{{ challenge.challengeName }}</span>
          <button
            class="rounded-full text-sm ml-4"
            @click="deleteChallenge(challenge.challengeIdx)"
          >
            <font-awesome-icon :icon="['fas', 'xmark']" />
          </button>
        </div>

        <div>{{ challenge.categoryName }}</div>
        <div>{{ challenge.detailedCategory }}</div>
        <div>
          {{ challenge.challengeLimit.toLocaleString()
          }}{{ challenge.challengeType == "횟수" ? "회" : "원" }}
        </div>
        <div>
          {{ formatDate(challenge.challengeStartDate) }} -
          {{ formatDate(challenge.challengeEndDate) }}
        </div>
      </div>
    </div>
    <ProgressBar
      class="mt-8"
      v-if="chartData"
      :limit="chartData.challengeLimit"
      :completed="chartData.cardHistoryCount"
    />
    <!-- <DoughnutChart
      v-if="chartData"
      :limit="chartData.challengeLimit"
      :completed="chartData.cardHistoryCount"
    /> -->
  </div>
</template>

<style scoped></style>
