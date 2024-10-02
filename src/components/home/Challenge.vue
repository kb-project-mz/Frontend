<script setup>
import ProgressBar from "@/components/challenge/ProgressBar.vue";
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
  console.log("데이터를 불러와보자 :", challengeTop3ByMember);
});
</script>

<template>
  <div>
    -----------------------------------------------
    <h1><챌린지 탑3></h1>
  </div>
  <!-- <div>
    <ul>
      <li v-for="(challenge, index) in challengeTop3ByMember" :key="index">
        {{ challenge.challengeName }}
      </li>
    </ul>
  </div> -->
  <!-- <ProgressBar class="mt-8" v-if="challengeTop3ByMember" :limit="challengeTop3ByMember.challengeLimit" :completed="challengeTop3ByMember.cardHistoryCount" /> -->
  <div v-for="challenge in challengeTop3ByMember" :key="challenge.challengeIdx">
    <h1>{{ challenge.challengeName }}</h1>
    <ProgressBar
      class="mt-8 w-3/4"
      v-if="challenge"
      :limit="challenge.challengeLimit"
      :completed="challenge.cardHistoryCount"
    />
  </div>
</template>
