<script setup>
import { ref } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart, Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, scales } from 'chart.js';

Chart.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale);

const props = defineProps({
  cardTransactionThisMonthData: {
    type: Object,
    required: true
  },
  cardTransactionLastMonthData: {
    type: Object,
    required: true
  },
  accountTransactionThisMonthData: {
    type: Object,
    required: true
  },
  accountTransactionLastMonthData: {
    type: Object,
    required: true
  }
});

// TODO: 10월 소비 내역이 없는 관계로 now를 9월로 고정, 추후 new Date()로 변경해야 함
const now = new Date(2024, 8, 30);
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;
const currentDate = now.getDate();

const generatePointRadius = (dataLength) => {
  console.log(dataLength);
  return Array.from({ length: dataLength }, (v, i) => (i + 1 === currentDate ? 5 : 0));
};

const cumulativeData = (cardData, accountData) => {
  let combinedData = [];
  const dataLength = Math.max(cardData.length, accountData.length);
  const memberName = localStorage.getItem("memberName");

  for (let i = 0; i < dataLength; i++) {
    const cardAmount = cardData[i]?.amount || 0;
    const accountAmount = accountData[i]?.amount || 0;
    const accountDescription = accountData[i]?.account_transaction_description || '';

    const combinedAmount = cardAmount + (accountAmount < 0 && !accountDescription.includes(memberName) ? Math.abs(accountAmount) : 0);
    combinedData.push(combinedAmount);
  }

  let cumulativeSum = 0;
  return combinedData.map(item => cumulativeSum += item);
}

const LineChart = Line;

const chartData = ref({
  labels: [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
    '13', '14', '15', '16', '17', '18', '19', '20', '21', '22',
    '23', '24', '25', '26', '27', '28', '29', '30', '31'
  ],
  datasets: [
    {
      label: "지난달 소비",
      borderColor: "#D6D7D9",
      pointRadius: 0,
      data: cumulativeData(props.cardTransactionLastMonthData, props.accountTransactionLastMonthData),
      tension: 0.1
    },
    {
      label: '이번달 소비',
      borderColor: '#2E7EED',
      pointBackgroundColor: '#2E7EED',
      pointRadius: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
      data: [
        1000, 5000, 7000, 16000, 27000, 30000, 50000, 50700, 64000,
        100000, 120000, 250000, 273000, 284000, 310000, 345000,
        385000, 410000, 462000, 540000
      ],
      tension: 0.1,
    }
  ],
});

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      display: false
    },
    y: {
      display: false,
      grid: {
        display: false,
      },
    },
  }
});
</script>

<template>
  <div class="py-5 px-8 bg-white border border-gray-200 rounded-2xl shadow overflow-hidden">
    <div class="flex items-center justify-between">
      <div>
        <div>지난 달보다</div>
        <div><span class="text-red font-bold">10,000</span>원 더</div>
        <div>사용하고 있어요</div>
      </div>

      <div class="flex w-32 justify-end h-16">
        <line-chart class="w-full h-full" :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-red {
  color: #F55151;
}
</style>


