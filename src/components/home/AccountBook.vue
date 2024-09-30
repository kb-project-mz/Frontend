<script setup>
import { ref, onMounted } from "vue";
import { io } from "socket.io-client";
import { useBalanceStore } from "@/stores/balance";

// 서버에서 데이터를 수신할 배열
const balanceByMember = ref([]);

const balanceStore = useBalanceStore();
const memberIdx = localStorage.getItem("memberIdx");

// Socket.IO 클라이언트 연결
const socket = io("http://localhost:3000");

const fetchBalance = async(memberIdx) => {
  await balanceStore.getTotalBalance(memberIdx);
}

onMounted(() => {
  fetchBalance(memberIdx);

  // 연결 성공 시 출력
  socket.on("connect", () => {
    console.log("Socket.IO connected!");
  });

  // 연결 오류 시 출력
  socket.on("connect_error", (err) => {
    console.error("Connection error:", err);
  });

  // 서버에서 balance 업데이트 이벤트 수신
  socket.on("balanceUpdate", (data) => {
    console.log("Balance updated: ", data);
    balanceByMember.value = data; // 업데이트된 데이터 반영
  });
});
</script>

<template>
  <div v-for="(item, index) in balanceByMember" :key="index">
    <div>{{ item.accountName }} - {{ item.balance }}</div>
  </div>
</template>
