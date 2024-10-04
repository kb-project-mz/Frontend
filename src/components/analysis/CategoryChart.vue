<script setup>
import { computed, onMounted } from "vue";
import { useCategoryTransactionStore } from "@/stores/category-transaction";
import DoughnutChart from "@/components/analysis/DoughnutChart.vue";


// Pinia store 가져오기
const categoryStore = useCategoryTransactionStore();

// categoryData는 백엔드에서 합산된 데이터를 가져옴
const categoryData = computed(() => categoryStore.categoryData);


// getStartOfMonth와 getEndOfMonth를 컴포넌트 내에 직접 정의
const getStartOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1); // 이번 달의 첫째 날
};

const getEndOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999); // 이번 달의 마지막 날
};

const mostSpentCategory = computed(() => {
    if (!categoryStore.categoryData || categoryStore.categoryData.length === 0) {
        return "데이터가 없습니다.";
    }

    // 이번 달의 시작일과 종료일을 YYYY-MM-DD 형식으로 변환
    const startOfMonth = getStartOfMonth().toISOString().split("T")[0]; 
    const endOfMonth = getEndOfMonth().toISOString().split("T")[0];
   

    // 카테고리별로 금액을 합산할 객체 초기화
    const categoryTotals = {};

    // 카테고리별로 일별 합산된 데이터를 월별로 다시 합산
    categoryStore.categoryData.forEach((transaction) => {
    const transactionDate = transaction.transactionDate; // 이미 YYYY-MM-DD 형식

    // 이번 달 범위 내 데이터만 계산
    if (transactionDate >= startOfMonth && transactionDate <= endOfMonth) {
        const category = transaction.categoryName;
        const amount = transaction.totalSpent;

        if (!categoryTotals[category]) {
            categoryTotals[category] = 0; // 카테고리의 초기 값 설정
        }

        // 카테고리별로 월별로 금액을 합산
        categoryTotals[category] += amount;
    }
});


    // 가장 많이 사용한 카테고리 찾기
    const mostSpent = Object.entries(categoryTotals).reduce((prev, curr) => (curr[1] > prev[1] ? curr : prev), ["없음", 0]);

    return mostSpent[0]; // 가장 많이 쓴 카테고리 이름 반환
});

// 컴포넌트가 마운트될 때 데이터 가져오기
onMounted(async () => {
    const memberIdx = localStorage.getItem("memberIdx");
    if (!memberIdx) {
        console.error("memberIdx가 정의되지 않았습니다.");
        return;
    }

    // 백엔드에서 카테고리별 데이터 가져오기
    await categoryStore.fetchMostSpentCategory(memberIdx);
});
</script>

<template>
    <div>
        <h2>카테고리별 거래 비율</h2>
        <DoughnutChart :categoryData="categoryData" />
        <div v-if="categoryStore.categoryData.length > 0">이번 달 가장 많이 쓴 카테고리는 {{ mostSpentCategory }} 입니다.</div>
        <div v-else>거래 데이터를 불러오는 중입니다...</div>
    </div>
</template>

<style scoped>
h2 {
    text-align: center;
    margin-bottom: 20px;
}
</style>
