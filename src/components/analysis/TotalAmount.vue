<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
    cardTransactionData: {
        type: Array,
        required: true,
    },
    accountTransactionData: {
        type: Array,
        required: true,
    },
});

const authData = JSON.parse(localStorage.getItem("auth"));
const memberName = authData.memberName;

const totalIncome = ref(0);
const totalOutcome = ref(0);

const getTotalIncome = () => {
    const accountTotal = props.accountTransactionData.reduce((total, item) => {
        if (!item.accountTransactionDescription.includes(memberName)) {
            return total + Math.abs(item.amount > 0 ? item.amount : 0);
        }
        return total;
    }, 0);

    return accountTotal;
};

const getTotalOutcome = () => {
    const cardTotal = props.cardTransactionData.reduce((total, item) => {
        return total + item.amount;
    }, 0);

    const accountTotal = props.accountTransactionData.reduce((total, item) => {
        if (!item.accountTransactionDescription.includes(memberName)) {
            return total + Math.abs(item.amount < 0 ? item.amount : 0);
        }
        return total;
    }, 0);

    return cardTotal + accountTotal;
};

onMounted(() => {
    totalIncome.value = getTotalIncome();
    totalOutcome.value = getTotalOutcome();
});

watch(
  [() => props.cardTransactionData, () => props.accountTransactionData],
  () => {
    totalIncome.value = getTotalIncome();
    totalOutcome.value = getTotalOutcome();
  }
);
</script>

<template>
    <div class="py-5 px-10 bg-gray-100 border border-gray-200 rounded-2xl shadow">
        <div class="flex items-center justify-between mb-2 w-64">
            <div class="w-1/2 font-medium">이번 달 총 수입</div>
            <div class="font-bold text-lg">{{ totalIncome.toLocaleString() }}원</div>
        </div>
        <div class="flex items-center justify-between">
            <div class="w-1/2 font-medium">이번 달 총 지출</div>
            <div div class="font-bold text-lg text-red">{{ totalOutcome.toLocaleString() }}원</div>
        </div>
    <div class="flex items-center justify-between">
      <div class="font-medium">총 지출</div>
      <div div class="font-bold text-lg text-red">
        {{ totalOutcome.toLocaleString() }}원
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-blue {
    color: #0b1573;
}
.text-red {
    color: #f55151;
}
</style>
