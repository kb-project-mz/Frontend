<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTestStore } from "@/stores/test";

const router = useRouter();
const testStore = useTestStore();

const calculateResult = () => {
    let resultValue = 0;

    if (testStore.impulseScore > testStore.plannedScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.material > testStore.experiential) {
        resultValue = 1;
    } else if (testStore.impulseScore > testStore.plannedScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.experiential > testStore.material) {
        resultValue = 2;
    } else if (testStore.plannedScore > testStore.impulseScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.material > testStore.experiential) {
        resultValue = 3;
    } else if (testStore.plannedScore > testStore.impulseScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.experiential > testStore.material) {
        resultValue = 4;
    } else if (testStore.impulseScore > testStore.plannedScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.material > testStore.experiential) {
        resultValue = 5;
    } else if (testStore.impulseScore > testStore.plannedScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.experiential > testStore.material) {
        resultValue = 6;
    } else if (testStore.plannedScore > testStore.impulseScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.material > testStore.experiential) {
        resultValue = 7;
    } else if (testStore.plannedScore > testStore.impulseScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.experiential > testStore.material) {
        resultValue = 8;
    }

    // 3초 후 결과 페이지로 이동
    setTimeout(() => {
        router.push({ name: "testResult", params: { resultId: resultValue } });
    }, 1000);
};

onMounted(() => {
    // 로딩 페이지에 도착하면 계산을 수행
    calculateResult();
});
</script>

<template>
    <div class="flex flex-col justify-center items-center h-screen bg-gray-50">
        <h1 class="text-2xl font-bold mb-4">결과를 계산 중입니다...</h1>
        <div class="loader"></div>
    </div>
</template>

<style scoped>
.loader {
    border: 8px solid #f3f3f3; /* Light grey */
    border-top: 8px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>