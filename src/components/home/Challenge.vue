<script setup>
import { useChallengeTop3Store } from "@/stores/challengeTop3";
import { ref, onMounted } from "vue";

const challengeTop3Store = useChallengeTop3Store();

const challengeTop3ByMember = ref([]);
const memberIdx = localStorage.getItem("memberIdx");

const fetchChallengeTop3 = async (memberIdx) => {
  await challengeTop3Store.getChallengeTop3(memberIdx);
};

onMounted(async () => {
  await fetchChallengeTop3(memberIdx);
  challengeTop3ByMember.value = challengeTop3Store.ChallengeTop3List;
});
</script>

<template>
  <div>
    -----------------------------------------------
    <h1><챌린지 탑3></h1>
  </div>
  <div>
    <ul>
      <!-- 배열을 순회하면서 challengeName 출력 -->
      <li v-for="(challenge, index) in challengeTop3ByMember" :key="index">
        {{ challenge.challengeName }}
      </li>
    </ul>
  </div>
</template>
