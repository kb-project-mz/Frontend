<script setup>
import { ref, onMounted } from 'vue';
import socket from '@/util/socket';
import { useBalanceStore } from '@/stores/balance';

// 서버에서 데이터를 수신할 배열
const balanceByMember = ref([]);
const authInfo = ref([]);

const balanceStore = useBalanceStore();
const memberIdx = localStorage.getItem('memberIdx');

const fetchBalance = async (memberIdx) => {
  await balanceStore.getTotalBalance(memberIdx);
};

onMounted(async () => {
  await fetchBalance(memberIdx);
  balanceByMember.value = balanceStore.TotalBalanceList;

  // socket 연결 성공
  socket.on('connect', () => {
    console.log('Socket.IO connected!');
  });

  // 업데이트 된 balance 데이터 가져오기
  socket.on('balanceUpdate', (data) => {
    balanceByMember.value = data;
  });

  // socket 연결 실패
  socket.on('connect_error', (err) => {
    console.error('Connection error:', err);
  });
});
</script>

<template>
  <div v-if="balanceByMember.length === 0">
    <RouterLink to="/mypage/asset">계좌연동하러가기 </RouterLink>
  </div>
  <div v-else>
    <div v-for="(item, index) in balanceByMember" :key="index">
      {{ item.accountName }} - {{ item.balance }}
    </div>
  </div>
</template>
