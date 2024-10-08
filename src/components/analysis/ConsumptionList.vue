<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  cardTransactionData: {
    type: Array,
    required: true,
  },
  accountTransactionData: {
    type: Array,
    required: true,
  }
});

const currentPage = ref(1);
const itemsPerPage = 5;
const maxPagesToShow = 5;

const combinedTransactionData = computed(() => {
  const cardTransactions = props.cardTransactionData.map(transaction => ({
    date: transaction.cardTransactionDate,
    time: transaction.cardTransactionTime,
    description: transaction.cardTransactionDescription,
    amount: -transaction.amount,
    name: transaction.cardName,
  }));

  const accountTransactions = props.accountTransactionData.map(transaction => ({
    date: transaction.accountTransactionDate,
    time: transaction.accountTransactionTime,
    description: transaction.accountTransactionDescription,
    amount: transaction.amount,
    name: transaction.accountName,
  }));

  const combinedData = [...cardTransactions, ...accountTransactions];
  return combinedData.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB - dateA;
  });
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return combinedTransactionData.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(combinedTransactionData.value.length / itemsPerPage);
});

const goToPage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= totalPages.value) {
    currentPage.value = pageNumber;
  }
};

const paginatedPageNumbers = computed(() => {
  const startPage = Math.floor((currentPage.value - 1) / maxPagesToShow) * maxPagesToShow + 1;
  const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages.value);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

const formatDate = (date) => {
  return date.split("-").join(".");
}

const formatTime = (time) => {
  return time.substring(0, 5);
}
</script>

<template>
  <div class="py-4 bg-white border border-gray-200 rounded-2xl">
    <div class="mx-5 my-2 font-bold text-lg list-header text-center">이번 달 자산 흐름</div>
    <div class="mx-3">
      <div v-for="(transaction, index) in paginatedData" :key="index">
        <div class="mx-5">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm">{{ formatDate(transaction.date) }} {{ formatTime(transaction.time) }}</div>
              <div class="text-l my-1 font-bold">{{ transaction.description }}</div>
              <div class="text-sm">{{ transaction.name }}</div>
            </div>
            <div>
              <div>
                <span class="text-xl" :class="transaction.amount < 0 ? 'text-red' : 'text-blue'">
                  {{ Math.abs(transaction.amount).toLocaleString() }}</span>원
              </div>
            </div>
          </div>
        </div>
        <div class="border-b border-gray-300 my-2"></div>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <div class="mt-3 flex justify-center space-x-2">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
        :class="['px-2 py-1 mx-1 rounded cursor-pointer', currentPage === 1 ? 'opacity-50' : 'hover:bg-gray-200']">
        <font-awesome-icon :icon="['fas', 'chevron-left']" class="text-navy" />
      </button>

      <button v-for="page in paginatedPageNumbers" :key="page" @click="goToPage(page)"
        :class="['px-3 rounded cursor-pointer hover:bg-gray-200', { 'bg-navy text-white': page === currentPage, 'bg-white': page !== currentPage }]">
        {{ page }}
      </button>

      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
        class="px-2 py-1 mx-1 rounded cursor-pointer hover:bg-gray-200">
        <font-awesome-icon :icon="['fas', 'chevron-right']" class="text-navy" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.bg-navy {
  background-color: #0b1573;
}
.text-navy {
  color: #0b1573;
}
.text-red {
  color: #F55151;
}
.text-blue {
  color: #0E9CFF;
}
</style>
