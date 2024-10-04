<script setup>
import { computed, onMounted } from "vue";
import { useCategoryTransactionStore } from "@/stores/category-transaction";
import DoughnutChart from "@/components/analysis/DoughnutChart.vue";


const categoryStore = useCategoryTransactionStore();
const categoryData = computed(() => categoryStore.categoryData);

const getStartOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
};

const getEndOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
};

const mostSpentCategory = computed(() => {
    if (!categoryStore.categoryData || categoryStore.categoryData.length === 0) {
        return "데이터가 없습니다.";
    }


    const startOfMonth = getStartOfMonth().toISOString().split("T")[0]; 
    const endOfMonth = getEndOfMonth().toISOString().split("T")[0];
   

    const categoryTotals = {};


    categoryStore.categoryData.forEach((transaction) => {
    const transactionDate = transaction.transactionDate; 


    if (transactionDate >= startOfMonth && transactionDate <= endOfMonth) {
        const category = transaction.categoryName;
        const amount = transaction.totalSpent;

        if (!categoryTotals[category]) {
            categoryTotals[category] = 0; 
        }


        categoryTotals[category] += amount;
    }
});


    const mostSpent = Object.entries(categoryTotals).reduce((prev, curr) => (curr[1] > prev[1] ? curr : prev), ["없음", 0]);

    return mostSpent[0]; 
});


onMounted(async () => {
    const memberIdx = localStorage.getItem("memberIdx");
    if (!memberIdx) {
        console.error("memberIdx가 정의되지 않았습니다.");
        return;
    }


    await categoryStore.fetchMostSpentCategory(memberIdx);
});
</script>

<template>
    <div>
        <h2>카테고리별 거래 비율</h2>
        <DoughnutChart :categoryData="categoryData" />
        <div v-if="categoryStore.categoryData.length > 0">이번 달 가장 많이 쓴 카테고리는 {{ mostSpentCategory }}입니다.</div>
        <div v-else>거래 데이터를 불러오는 중입니다...</div>
    </div>
</template>

<style scoped>
h2 {
    text-align: center;
    margin-bottom: 20px;
}
</style>
