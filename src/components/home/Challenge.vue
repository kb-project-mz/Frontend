<script setup>
import ProgressBar from '@/components/challenge/ProgressBar.vue';
import { useChallengeTop3Store } from '@/stores/challengeTop3';
import { ref, onMounted } from 'vue';

const challengeTop3Store = useChallengeTop3Store();
const challengeTop3ByMember = ref([]);
const peerChallenge = ref([]);

const authData = JSON.parse(localStorage.getItem('auth'));
const memberIdx = authData.memberIdx;

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
  <RouterLink to="/challenge"> 챌린지 보러 가기! </RouterLink>
  <div v-if="challengeTop3ByMember.length === 0">
    또래 챌린지 보여줘야함.
    <div v-for="(peer, index) in peerChallenge" :key="index">
      {{ peer.challengeName }}
    </div>
  </div>
  <div v-else>
    <div
      v-for="challenge in challengeTop3ByMember"
      :key="challenge.challengeIdx"
      class="w-full"
    >
      <h1>{{ challenge.challengeName }}</h1>
      <ProgressBar
        class="mt-8 w-3/4"
        v-if="challenge"
        :limit="challenge.challengeLimit"
        :completed="challenge.cardHistoryCount"
      />
    </div>
  </div>
</template>
