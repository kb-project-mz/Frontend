<script setup>
import { ref, onMounted } from 'vue';
import { useTransactionAnalysisStore } from '@/stores/transaction-analysis';
import MostUsed from './MostUsed.vue';
import MaximumUsed from './MaximumUsed.vue';
import medalFirst from '@/assets/medal_first.png';
import medalSecond from '@/assets/medal_second.png';
import medalThird from '@/assets/medal_third.png';

const props = defineProps({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const memberIdx = localStorage.getItem("memberIdx");

const transactionAnalysisStore = useTransactionAnalysisStore();
const mostUsed = ref({});
const maximumAmount = ref({});

const fetchTransactionAnalysis = async (memberIdx, startYear, startMonth, startDay, endYear, endMonth, endDay) => {
  await transactionAnalysisStore.getMostAndMaximumUse(memberIdx, startYear, startMonth, startDay, endYear, endMonth, endDay);
  const formattedData = formatMostUsed(transactionAnalysisStore.mostAndMaximum);
  
  mostUsed.value = formattedData.mostUsed;
  maximumAmount.value = formattedData.maximumAmount;
}

const formatMostUsed = (dataStr) => {
  const result = {
    mostUsed: {},
    maximumAmount: {}
  }
  
  if (dataStr) {
    const lists = dataStr.split('], [');

    if (lists[0]) {
      const items1 = lists[0].replace(/[\[\]]/g, '').split(', ');
      items1.forEach(item => {
        const [key, value] = item.split(':');
        result.mostUsed[key.trim()] = parseInt(value.trim());
      });
    }
    
    if (lists[1]) {
      const items2 = lists[1].replace(/[\[\]]/g, '').split(', ');
      items2.forEach(item => {
        const [key, value] = item.split(':');
        result.maximumAmount[key.trim()] = parseInt(value.trim());
      });
    }
  }

  return result;
}

const getMedal = (index) => {
  switch(index) {
    case 0:
      return medalFirst;
    case 1:
      return medalSecond;
    case 2:
      return medalThird;
    default:
      return '';
  }
};

// TODO: new Date()
const today = new Date(2024, 8, 23);
const year = today.getFullYear();
const month = today.getMonth() + 1;

const getEndDay = (year, month) => {
  const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysInMonth[month - 1];
};

onMounted(async () => {
  // await fetchTransactionAnalysis(memberIdx, year, month, 1, year, month, getEndDay(year, month));

  // 테스트용 데이터
  mostUsed.value = {"배달의 민족":15, "스타벅스":3, "편의점":4};
  maximumAmount.value = {"배달의 민족":120000, "스타벅스":23000, "편의점":12000}
});
</script>

<template>
  <div class="py-6 px-8 bg-white border border-gray-200 rounded-2xl shadow">
    <div class="w-full">
      <MostUsed class="mb-7" :mostUsed="mostUsed" :get-medal="getMedal" :period="period" />
      <MaximumUsed :maximumUsed="maximumAmount" :get-medal="getMedal" :period="period" />
    </div>
    
  </div>
</template>

<style scoped>

</style>
