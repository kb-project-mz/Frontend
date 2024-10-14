<script setup>
import ProgressBar from '@/components/challenge/ProgressBar.vue';
import { useChallengeTop3Store } from '@/stores/challengeTop3';
import { ref, onMounted } from 'vue';

const challengeTop3Store = useChallengeTop3Store();
const challengeTop3ByMember = ref([]);
const peerChallenge = ref([]);

const authData = JSON.parse(localStorage.getItem('auth'));
const memberIdx = authData.memberIdx;
const memberName = authData.memberName;

const formatDate = (date) => {
  return date.split('-').join('.');
};

const fetchChallengeTop3 = async (memberIdx) => {
  await challengeTop3Store.getChallengeTop3(memberIdx);
};

const fetchPeerChallenge = async (memberIdx) => {
  await challengeTop3Store.getPeerChallenge(memberIdx);
};

onMounted(async () => {
  await fetchChallengeTop3(memberIdx);
  await fetchPeerChallenge(memberIdx);
  challengeTop3ByMember.value = challengeTop3Store.ChallengeTop3List;
  peerChallenge.value = challengeTop3Store.PeerChallengeList;
});
</script>

<template>
  <div class="border border-gray-200 rounded-lg p-12 bg-gray-50 w-3/4 mx-auto">
    <div v-if="challengeTop3ByMember.length === 0">
      <div class="mb-4 text-center font-bold text-sm">
        {{ memberName }}님은 진행 중인 챌린지가 없어요..
      </div>
      <div class="mb-4 text-center font-bold text-md">
        {{ memberName }}님의 또래는 어떤 챌린지를 진행 중 일까요?
      </div>
      <div v-for="(peer, index) in peerChallenge" :key="index"
        class="w-full border border-gray-300 rounded-lg p-4 mb-4 shadow font-semibold">
        {{ peer.challengeName }} ({{ peer.detailedCategory }})<br />
        {{ formatDate(peer.challengeStartDate) }} ~
        {{ formatDate(peer.challengeEndDate) }}
      </div>
    </div>
    <div v-else>
      <div class="mb-4 text-center font-bold text-xl">
        {{ memberName }}님의 챌린지 달성률 check!
      </div>
      <div v-for="challenge in challengeTop3ByMember" :key="challenge.challengeIdx"
        class="w-full border border-gray-300 rounded-lg p-4 mb-4 shadow font-semibold">
        <h1>{{ challenge.challengeName }}</h1>
        <ProgressBar class="mt-6" v-if="challenge" :limit="challenge.challengeLimit"
          :completed="challenge.cardHistoryCount" />
      </div>
    </div>
    <RouterLink to="/challenge" class="text-right block text-xs underline text-gray-500">
      챌린지 보러 가기!
    </RouterLink>
  </div>
</template>
