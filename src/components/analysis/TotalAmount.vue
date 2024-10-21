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
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true
  }
});

const authData = JSON.parse(localStorage.getItem("auth"));
const memberName = authData.memberName;

const totalIncome = ref(0);
const totalOutcome = ref(0);
const outcomePerDay = ref(0);

const getTotalDays = () => {
  const diffTime = Math.abs(props.endDate - props.startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

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
  outcomePerDay.value = Math.round((totalOutcome.value / getTotalDays()));
});

watch(
  [() => props.cardTransactionData, () => props.accountTransactionData],
  () => {
    totalIncome.value = getTotalIncome();
    totalOutcome.value = getTotalOutcome();
    outcomePerDay.value = Math.round(totalOutcome.value / getTotalDays());
  }
);
</script>

<template>
  <div>
    <div class="flex flex-col h-full justify-between gap-10">
      <div class="py-10 px-10 bg-gray-100 border border-gray-200 rounded-xl shadow flex flex items-center justify-between">
        <div class="font-medium">총 수입</div>
        <div class="font-bold text-lg text-customBlue">{{ totalIncome.toLocaleString() }}원</div>
      </div>
      <div class="py-10 px-10 bg-gray-100 border border-gray-200 rounded-2xl shadow flex flex items-center justify-between">
        <div class="font-medium">총 지출</div>
        <div div class="font-bold text-lg text-customRed">
          {{ totalOutcome.toLocaleString() }}원
        </div>
      </div>
      <div class="py-10 px-10 bg-gray-100 border border-gray-200 rounded-2xl shadow flex flex items-center justify-between">
        <div class="font-medium">하루 평균 소비 금액</div>
        <div div class="font-bold text-lg">
          {{ outcomePerDay.toLocaleString() }}원
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
