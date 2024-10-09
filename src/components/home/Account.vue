<script setup>
import { ref, onMounted } from 'vue';
import socket from '@/util/socket';
import { useBalanceStore } from '@/stores/balance';

// 서버에서 데이터를 수신할 배열
const balanceByMember = ref([]);
const currentAccountIndex = ref(0);
const authInfo = ref([]);

const balanceStore = useBalanceStore();
const authData = JSON.parse(localStorage.getItem('auth'));
const memberIdx = authData.memberIdx;

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

// 다음 계좌로 이동
const nextAccount = () => {
  if (currentAccountIndex.value < balanceByMember.value.length - 1) {
    currentAccountIndex.value += 1;
  }
};

// 이전 계좌로 이동
const prevAccount = () => {
  if (currentAccountIndex.value > 0) {
    currentAccountIndex.value -= 1;
  }
};
</script>

<template>
  <div
    class="border border-gray-300 rounded-lg p-4 bg-gray-100 max-w-sm mx-auto"
  >
    <div v-if="balanceByMember.length === 0">
      <RouterLink to="/mypage/asset">계좌연동하러가기 </RouterLink>
    </div>
    <div v-else>
      <!-- Header 부분 -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center text-sm text-gray-500">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <!-- 별 모양 -->
            <path
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
          <RouterLink to="/mypage/asset">내 계좌 보러가기 </RouterLink>
        </div>
        <button class="flex items-center text-sm text-gray-500">
          <!-- 거래내역보기 -->
          <svg class="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
            <!-- 화살표 아이콘 -->
            <!-- <path d="M7 10l5 5 5-5H7z" /> -->
          </svg>
        </button>
      </div>

      <!-- 계좌 정보 -->
      <div class="text-gray-700 mb-6">
        <p class="text-lg font-semibold">
          {{ balanceByMember[currentAccountIndex].accountName }}
        </p>
        <p class="text-sm mb-4">
          {{ balanceByMember[currentAccountIndex].bankName }}
        </p>
      </div>
      <!-- 버튼 -->
      <div class="flex justify-between mb-6">
        <button
          @click="prevAccount"
          :disabled="currentAccountIndex === 0"
          class="w-6 h-6 text-sm bg-gray-400 text-white rounded flex justify-center items-center"
        >
          <
        </button>
        <button
          @click="nextAccount"
          :disabled="currentAccountIndex === balanceByMember.length - 1"
          class="w-6 h-6 text-sm bg-gray-400 text-white rounded flex justify-center items-center"
        >
          >
        </button>
      </div>

      <!-- 금액 표시 -->
      <div class="flex justify-end text-4xl font-bold text-gray-900 mb-4">
        {{ balanceByMember[currentAccountIndex].balance.toLocaleString() }}원
      </div>
    </div>
  </div>
</template>
