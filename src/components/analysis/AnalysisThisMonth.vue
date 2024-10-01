<script setup>
import MostAndMaximumUsed from "@/components/analysis/MostAndMaximumUsed.vue";
import CategoryChart from "@/components/analysis/CategoryChart.vue";
import TotalAmount from "@/components/analysis/TotalAmount.vue";
import AverageConsumption from "@/components/analysis/AverageConsumption.vue";

const props = defineProps({
    cardTransactionData: {
        type: Object,
        required: true,
    },
    accountTransactionData: {
        type: Object,
        required: true,
    },
});

const memberName = localStorage.getItem("memberName");
const month = new Date().getMonth() + 1;
</script>

<template>
    <div class="text-xl font-semibold mb-3">{{ memberName }}님의 {{ month }}월 소비 패턴을 분석해보았어요.</div>
    <div class="flex justify-between">
        <MostAndMaximumUsed period="이번 달" />
        <div class="flex flex-col justify-between">
            <TotalAmount :card-transaction-data="cardTransactionData" :account-transaction-data="accountTransactionData" />
            <AverageConsumption :card-transaction-data="cardTransactionData" :account-transaction-data="accountTransactionData" />
        </div>
        <CategoryChart />
    </div>
</template>

<style scoped></style>
