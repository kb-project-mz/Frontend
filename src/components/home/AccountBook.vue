<script setup>
// 로그인한 memberId 가져와서 (computed 속성으로)
// balance.js를 통해 axios로 가져온 list의 id와 memberId 비교
// -> chatgpt에 find함수 사용하는거 있음
// 비교 후 동일하면 balance 내보내고
// 다르면 계좌없음 표시 -> 계좌연동하기로 이동

// 위에꺼 성공하면 socket 진행.

import { useBalanceStore } from '@/stores/balance';
import { useAuthStore } from '@/stores/auth';
import { ref, computed, onMounted } from 'vue';
import { io } from 'socket.io-client';

const authStore = useAuthStore();
const balanceStore = useBalanceStore();
const socket = io('http://localhost:3001');

// 로그인 한 사용자의 id
const id = computed(() => authStore.member.memberId);
// DB에서 가져온 List
const balances = ref([]);
const totalBalance = ref(null);

onMounted(() => {
  fetchBalance();

  // 서버로부터 실시간 balance 업데이트 수신
  socket.on('balanceUpdate', (data) => {
    if (data.memberId === id.value) {
      // 로그인한 사용자의 업데이트만 처리
      balances.value = data.balanceList;
      findMemberBalance(); // 업데이트 후 balance 찾기
    }
  });
});

const fetchBalance = async () => {
  await balanceStore.getTotalBalance();
  balances.value = balanceStore.TotalBalanceList;
  findMemberBalance();
};

function findMemberBalance() {
  const user = balances.value.find((balance) => balance.id === id.value);
  if (user) {
    totalBalance.value = user.balance;
  } else {
    totalBalance.value = null;
  }
}
</script>

<template>
  <div>
    <h1 v-if="totalBalance !== null">Your Balance: {{ totalBalance }}</h1>
    <h1 v-else>계좌 연동하러 가기</h1>
  </div>
</template>
