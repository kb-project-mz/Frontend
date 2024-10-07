<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useChallengeStore } from '@/stores/challenge';

const memberIdx = localStorage.getItem("memberIdx");

const challengeStore = useChallengeStore();
const peerChallengeList = ref([]);

onMounted(async () => {
  await challengeStore.getPeerChallengeList(memberIdx);
  console.log(challengeStore.peerChallengeList);
  peerChallengeList.value = challengeStore.peerChallengeList;

  let roller = document.querySelector('.rolling-list');
  await nextTick();

  if (roller) {
    roller.id = 'roller1';

    let clone = roller.cloneNode(true);
    clone.id = 'roller2';
    document.querySelector('.wrap').appendChild(clone);

    document.querySelector('#roller1').style.top = '0px';
    document.querySelector('#roller2').style.top = document.querySelector('.rolling-list ul').offsetHeight + 'px';

    roller.classList.add('original');
    clone.classList.add('clone');
  } else {
    console.error('.rolling-list 요소를 찾을 수 없습니다.');
  }
});

const liBackgroundClasses = ['bg-li-1', 'bg-li-2', 'bg-li-3','bg-li-4', 'bg-li-5'];

const divBackgroundClasses = ['bg-div-1', 'bg-div-2', 'bg-div-3', 'bg-div-4', 'bg-div-5'];
</script>

<template>
  <div class="overflow-hidden">
    <div class="text-xl font-bold mb-6">내 또래에게 현재 인기가 많은 챌린지예요</div> 
    <div class="wrap flex flex-col overflow-hidden shrink-0">
      <div class="rolling-list flex flex-col">
        <ul class="flex flex-col">
          <li class="py-8 my-8 px-6 border border-gray-200 rounded-3xl shadow-lg"
            :class="liBackgroundClasses[index % liBackgroundClasses.length]"
            v-for="(challenge, index) in peerChallengeList" 
            :key="index">
            <div class="text-gray-700 py-3 px-5 flex justify-between items-center">
              <div class="text-lg font-bold">{{ challenge.detailedCategory }}</div>
              <div class="rounded-full w-fit py-1 px-4 items-center text-center text-white" :class="divBackgroundClasses[index % divBackgroundClasses.length]">
                {{ challenge.challengeCount }}명
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-li-1 {
  background-color: #FFF7D0;
}
.bg-li-2 {
  background-color: #DBF4FF;
}
.bg-li-3 {
  background-color: #FDE2D6;
}
.bg-li-4 {
  background-color: #EAFFE7;
}
.bg-li-5 {
  background-color: #F5E4FF;
}
.bg-div-1 {
  background-color: #FFDF68;
}
.bg-div-2 {
  background-color: #71D4FF;
}
.bg-div-3 {
  background-color: #FFA179;
}
.bg-div-4 {
  background-color: #ABFF9F;
}
.bg-div-5 {
  background-color: #DDA4FF;
}
.rolling-list.original {
	animation: rollingup1 50s linear infinite;
}
.rolling-list.clone {
	animation: rollingup2 50s linear infinite;
}
@keyframes rollingup1 {
	0% { transform: translateY(0); }
	50% { transform: translateY(-100%); }
	50.01% { transform: translateY(100%); }
	100% { transform: translateY(0); }
}
@keyframes rollingup2 {
	0% { transform: translateY(0); }
	100% { transform: translateY(-200%); }
}
</style>
