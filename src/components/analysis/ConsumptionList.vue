<script setup>
import { ref, onMounted, computed } from "vue";
import { useTransactionStore } from "@/stores/transaction";

// Pinia 스토어
const transactionStore = useTransactionStore();

// 상태값
const currentPage = ref(1); // 현재 페이지
const itemsPerPage = ref(5); // 페이지당 항목 수
const totalPages = ref(0); // 총 페이지 수
const transactions = ref([]); // 현재 페이지의 거래 데이터

// API 호출 및 데이터 갱신
const fetchTransactions = async () => {
  try {
    const response = await transactionStore.getDailyTransactions(currentPage.value, itemsPerPage.value);

    if (response) {
      transactions.value = response.data.map((transaction) => ({
        date: transaction.transactionDateTime.split(" ")[0], // 날짜
        time: transaction.transactionDateTime.split(" ")[1], // 시간
        description: transaction.transactionDescription, // 설명
        name: transaction.assetName, // 자산 이름
        amount: transaction.formattedAmount, // 문자열 그대로 사용
      }));
      totalPages.value = response.totalPages; // 총 페이지 수
    } else {
      console.error("데이터를 가져오지 못했습니다.");
    }
  } catch (error) {
    console.error("fetchTransactions 에러:", error.response ? error.response.data : error.message);
  }
};

// 페이지네이션 번호 계산
const paginatedPageNumbers = computed(() => {
  const maxVisiblePages = 5; // 한 번에 보여줄 최대 페이지 번호 수
  const halfVisiblePages = Math.floor(maxVisiblePages / 2);

  let startPage = Math.max(1, currentPage.value - halfVisiblePages);
  let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1);

  // 만약 끝 페이지가 마지막 페이지보다 적다면 시작 페이지를 조정
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});

// 페이지 이동 함수
const goToPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPages.value) {
    currentPage.value = pageNumber;
    fetchTransactions(); // 페이지 변경 시 데이터 요청
  }
};

// 날짜 및 시간 포맷 함수
const formatDate = (date) => date.replace(/\./g, ".");
const formatTime = (time) => time.substring(0, 5);

// 컴포넌트 마운트 시 첫 데이터 요청
onMounted(() => {
  fetchTransactions();
});
</script>


<template>
  <div class="py-4 bg-white border border-gray-200 rounded-xl shadow">
    <div class="mx-5 my-2 font-bold text-lg list-header text-center">이번 달 자산 흐름</div>
    <div class="mx-3">
      <div v-for="(transaction, index) in transactions" :key="index">
        <div class="mx-5">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs">{{ formatDate(transaction.date) }} {{ formatTime(transaction.time) }}</div>
              <div class="text-lg my-1">{{ transaction.description }}</div>
              <div class="text-sm">{{ transaction.name }}</div>
            </div>
            <div>
              <div>
                <span class="text-xl font-bold" :class="transaction.amount < 0 ? 'text-customRed' : 'text-customBlue'">
                  {{ transaction.amount.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="border-b border-gray-300 my-2"></div>
      </div>
    </div>
    <div class="mt-3 flex justify-center space-x-2">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
        :class="['px-2 py-1 mx-1 rounded cursor-pointer', currentPage === 1 ? 'opacity-50' : 'hover:bg-gray-200']">
        <font-awesome-icon :icon="['fas', 'chevron-left']" class="text-customNavy" />
      </button>

      <button v-for="page in paginatedPageNumbers" :key="page" @click="goToPage(page)"
        :class="['px-3 rounded cursor-pointer hover:bg-gray-200', { 'bg-customNavy text-white': page === currentPage, 'bg-white': page !== currentPage }]">
        {{ page }}
      </button>

      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
        :class="['px-2 py-1 mx-1 rounded cursor-pointer', currentPage === totalPages ? 'opacity-50' : 'hover:bg-gray-200']">
        <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-customNavy" />
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
