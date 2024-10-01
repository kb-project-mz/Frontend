<script setup>
import { ref, onMounted } from 'vue';
import { useTransactionAnalysisStore } from '@/stores/transaction-analysis';
import MostUsed from './MostUsed.vue';
import MaximumUsed from './MaximumUsed.vue';
import medalFirst from '@/assets/medal_first.png';
import medalSecond from '@/assets/medal_second.png';
import medalThird from '@/assets/medal_third.png';

const props = defineProps({
  period: {
    type: String,
    required: true,
  }
});

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

onMounted(async () => {
  // await fetchConsumptionAnalysis(1, 2024, 9, 1, 2024, 9, 30);

  // 테스트용 데이터
  mostUsed.value = {"배달의 민족":15, "스타벅스":3, "편의점":4};
  maximumAmount.value = {"배달의 민족":120000, "스타벅스":23000, "편의점":12000}
});
</script>

<template>
  <div class="py-6 px-8 bg-white border border-gray-200 rounded-2xl shadow">
    <div class="w-72">
      <MostUsed class="mb-7" :mostUsed="mostUsed" :get-medal="getMedal" :period="period" />
      <MaximumUsed :maximumUsed="maximumAmount" :get-medal="getMedal" :period="period" />
    </div>
    
  </div>
</template>

<style scoped>

</style>
