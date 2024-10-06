<script setup>
import { ref, onMounted } from 'vue';
import { useChallengeStore } from '@/stores/challenge';

const memeberIdx = localStorage.getItem("memberIdx");

const challengeStore = useChallengeStore();
const peerChallengeList = ref([]);

onMounted(async () => {
  await challengeStore.getPeerChallengeList(memeberIdx);
  console.log(challengeStore.peerChallengeList);
  peerChallengeList.value = challengeStore.peerChallengeList;

  let roller = document.querySelector('.rolling-list');
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
</script>

<template>
  <div class="wrap">
    <div class="rolling-list">
      <ul>
        <li v-for="(challenge, index) in peerChallengeList">
          <div class="desc">
            <strong>{{ challenge.detailedCategory }}</strong>
            <span>종류: {{ challenge.challengeType }}</span>
            <span>제한: {{ challenge.challengeLimit }}</span>
            <span>기간: {{ challenge.challengeDuration }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.wrap { 
  display: flex; 
  overflow: hidden;
  flex-direction: column;
}
.wrap .rolling-list ul { 
	display: flex;
  flex-direction: column;
}
.wrap .rolling-list ul li { 
	width: 100%; 
	height: 276px;
  margin: 16px 0;
  padding: 46px 31px; 
  display: flex; 
  align-items: center; 
  flex-shrink: 0; 
}
.wrap .rolling-list ul li { 
	padding-right: 32px; 
  width: 156px; 
  flex-shrink: 0; /* Tailwind shrink-0 */
  background-color: white; /* Tailwind bg-white */
  border-width: 1px solid; /* Tailwind border */
  border-color: #E5E7EB; /* Tailwind border-gray-200 */
  border-radius: 1rem; /* Tailwind rounded-2xl */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06); /* Tailwind shadow */
}
.wrap .rolling-list ul li { 
	width: 100%;
}
.wrap .rolling-list ul li .desc strong { 
  display: block;
    font-size: 24px; 
    margin-bottom: 24px;
}
.wrap .rolling-list ul li .desc span {
  display: block; 
	font-size: 18px;
    line-height: 1.2;
}
.rolling-list.original {
	animation: rollingup1 33s linear infinite;
}
.rolling-list.clone {
	animation: rollingup2 33s linear infinite;
}
/** 내부 데이터의 개수가 달라지면 이 부분을 수정해야하는 것 같음 ..
* 원본은 4개여서 4개인 듯 ?? 데이터 개수가 5개가 되니까 중간에 끊김 ;; 
애초에 받아올 때 개수를 딱 정해서 받아와야함 .. 애초에 백엔드 부분도 쿼리문 수정해야 됨 ㅎ;;;*/
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
