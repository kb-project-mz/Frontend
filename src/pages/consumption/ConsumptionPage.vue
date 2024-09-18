<script setup>
import { ref, onMounted } from 'vue';
import { useConsumptionHistoryStore } from '@/stores/consumption-history';
import MostAndMaximumUsed from '@/components/consumption/MostAndMaximumUsed.vue';
import CategoryChart from '@/components/consumption/CategoryChart.vue';
import TotalOutcome from '@/components/consumption/TotalOutcome.vue';
import TotalIncome from '@/components/consumption/TotalIncome.vue';
import AverageConsumption from '@/components/consumption/AverageConsumption.vue';

const consumptionHistoryStore = useConsumptionHistoryStore();
const historyData = ref([]);
const historyThisMonthData = ref([]);
const historySelectedPeriodData = ref([]);

const thisMonth = ref("이번 달");
const selectedPeriod = ref("이 기간 동안");

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;

const getEndDay = (year, month) => {
  const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysInMonth[month - 1];
}

const startYear = ref(year);
const startMonth =  ref(month - 1);
const startDay =  ref(1);
const endYear =  ref(year);
const endMonth =  ref(month - 1);
const endDay =  ref(getEndDay(endYear.value, endMonth.value));

const fetchConsumptionHistory = async (memberId) => {
  await consumptionHistoryStore.getCardHistoryList(memberId);
  historyData.value = consumptionHistoryStore.cardHistory;
  historyThisMonthData.value = consumptionHistoryStore.cardHistoryThisMonth;
}

const fetchSelectedPeriodConsumptionHistory = () => {
  const startDate = new Date(startYear.value, startMonth.value - 1, startDay.value);
  const endDate = new Date(endYear.value, endMonth.value - 1, endDay.value, 23, 59, 59);

  console.log(startDate);
  console.log(endDate);

  // consumptionDate를 Date 객체로 변환하여 비교
  const filteredHistoryData = historyData.value.filter(item => {
    const consumptionDate = new Date(item.consumptionDate);
    return consumptionDate >= startDate && consumptionDate <= endDate;
  });

  // 필터링된 데이터를 historySelectedPeriodData에 저장
  historySelectedPeriodData.value = filteredHistoryData;
};

onMounted(async () => {
  await fetchConsumptionHistory(1);
  fetchSelectedPeriodConsumptionHistory();
});
</script>

<template>
  <div class="flex items-stretch justify-center mt-10">
    <div>
      <div>
        <div class="text-xl mb-1">이번 달 홍길동 님의 소비 패턴을 분석해보았어요.</div>
        <div class="text-2xl font-semibold mb-6">{{ year }}년 {{ month }}월</div>
      </div>
      <MostAndMaximumUsed :period="thisMonth" />
      <div class="flex mt-8">
        <div class="w-1/2 mr-4">
          <CategoryChart />
        </div>
        <div class="w-1/2 ml-4">
          <div><TotalOutcome :historyData="historyThisMonthData" /></div>
          <div class="mt-8"><TotalIncome /></div>
          <div class="mt-8"><AverageConsumption /></div>
        </div>
      </div>
    </div>

    <div class="mx-8 border-l border-gray-300"></div>

    <div>
      <div class="flex items-end justify-between mb-6">
        <div>
          <div class="text-xl mb-1">이번 달 나의 소비 습관을 다른 달과 비교해볼까요?</div>
          <div class="text-2xl font-semibold">{{ startYear }}년  {{ startMonth }}월 {{ startDay }}일 - {{ endYear }}년  {{ endMonth }}월 {{ endDay }}일</div>
        </div>
        <button class="bg-white py-2 px-6 border rounded-2xl text-xl btn-gray">기간 설정</button>
      </div>
      <MostAndMaximumUsed :period="selectedPeriod" />
      <div class="flex mt-8">
        <div class="w-1/2 mr-4">
          <CategoryChart />
        </div>
        <div class="w-1/2 ml-4">
          
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-gray {
  border-color: #656363;
  color: #656363;
}
</style>
