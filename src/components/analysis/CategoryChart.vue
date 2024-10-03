<script setup>
import { ref, onMounted } from 'vue';
import { useCategoryTransactionStore } from '@/stores/category-transaction';  // Pinia store import
import DoughnutChart from '@/components/analysis/DoughnutChart.vue';  // DoughnutChart 컴포넌트 import

const categoryStore = useCategoryTransactionStore();
const categoryTransactionCounts = ref([]);

// memberIdx를 로컬스토리지에서 가져옴
const memberIdx = localStorage.getItem('memberIdx');

// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(async () => {
  if (!memberIdx) {
    console.error('memberIdx가 정의되지 않았습니다.');
    return;
  }
  
  await categoryStore.fetchCategoryTransactionCount(memberIdx);
  categoryTransactionCounts.value = categoryStore.categoryTransactionCounts;
});
</script>

<template>
  <div>
    <h2>카테고리별 거래 비율</h2>
    <DoughnutChart :categoryData="categoryTransactionCounts" />
    <div>이번 달 가장 많이 쓴 카테고리는 식비 입니다.</div>
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
