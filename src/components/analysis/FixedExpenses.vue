<script setup>
import { ref, onMounted } from 'vue';
import { useTransactionAnalysisStore } from '@/stores/transaction-analysis';

const memberIdx = JSON.parse(localStorage.getItem('auth')).memberIdx;

const transactionAnalysisStore = useTransactionAnalysisStore();

const fixedExpenses = ref([]);

onMounted(async () => {
  await transactionAnalysisStore.fetchFixedExpenses(memberIdx);
  fixedExpenses.value = transactionAnalysisStore.fixedExpenses;
})
</script>

<template>
  <div class="py-5 px-8 bg-white border border-gray-200 rounded-2xl shadow">
    <div class="font-bold mb-3">나의 고정 지출 키워드는?</div>
    <div v-if="fixedExpenses.length > 0">
      <div class="flex flex-wrap gap-y-2 gap-x-3 mt-2">
        <div v-for="expense in fixedExpenses" :key="expense" class="py-2 px-3 w-fit rounded-full text-white bg-navy text-xs">
          #{{ expense }}
        </div>
      </div>
    </div>
    <div v-else>
      <div class="text-center">고정 지출이 없어요!</div>
    </div>
  </div>
</template>

<style>
.bg-navy {
  background-color: #0b1573;
}
</style>
