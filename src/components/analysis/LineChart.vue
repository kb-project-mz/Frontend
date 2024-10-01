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

// TODO: 10월 소비 내역이 없는 관계로 today를 9월로 고정, 추후 new Date()로 변경해야 함
const today = new Date(2024, 8, 13);
const currentMonth = today.getMonth();
const currentDate = today.getDate();

const memberName = localStorage.getItem("memberName");

const lastMonthCompareData = ref(0);
const thisMonthCompareData = ref(0);

const generatePointRadius = () => {
  const result = new Array(currentDate).fill(0);
  result[currentDate - 1] = 5;
  return result;
};

const getEndDay = (year, month) => {
  const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysInMonth[month - 1];
};

const calculateDailyTotal = (cardTransactions, accountTransactions) => {
  
  const dailyTotals = {};

  accountTransactions.forEach(transaction => {
    const date = transaction.accountTransactionDate;
    const amount = transaction.amount;
    const description = transaction.accountTransactionDescription;

    if (amount < 0 && !description.includes(memberName)) {
      dailyTotals[date] = (dailyTotals[date] || 0) + Math.abs(amount);
    }
  });

  cardTransactions.forEach(transaction => {
    const date = transaction.cardTransactionDate;
    const amount = transaction.amount;
    const description = transaction.cardTransactionDescription;

    if (!description.includes(memberName)) {
      dailyTotals[date] = (dailyTotals[date] || 0) + amount;
    }
  });

  const sortedDates = Object.keys(dailyTotals).sort();
  const cumulativeTotals = {};
  let cumulativeSum = 0;

  let lastProcessedDate = null;

  sortedDates.forEach(date => {
    let currentDate = new Date(date);
    
    if (lastProcessedDate) {
      let previousDate = new Date(lastProcessedDate);
      
      while (previousDate < currentDate) {
        previousDate.setDate(previousDate.getDate() + 1);
        const formattedDate = previousDate.toISOString().split('T')[0];
        cumulativeTotals[formattedDate] = cumulativeSum;
      }
    }

    cumulativeSum += dailyTotals[date];
    cumulativeTotals[date] = cumulativeSum;
    
    lastProcessedDate = date;
  });

  if (lastProcessedDate) {
    let lastDate = new Date(lastProcessedDate);
    if (lastDate.getMonth() == today.getMonth()) {
      while (lastDate < today) {
        lastDate.setDate(lastDate.getDate() + 1);
        const formattedDate = lastDate.toISOString().split('T')[0];
        cumulativeTotals[formattedDate] = cumulativeSum;
      }

      thisMonthCompareData.value = cumulativeTotals[today.toISOString().split('T')[0]];
    } else {
      const year = today.getFullYear();
      const month = today.getMonth();

      let lastMonthYear = year;
      let lastMonth = month - 1;

      if (lastMonth < 0) {
        lastMonth = 11;
        lastMonthYear--;
      }

      const lastMonthDay = new Date(lastMonthYear, lastMonth, getEndDay(lastMonthYear, lastMonth));
      while (lastDate < lastMonthDay) {
        lastDate.setDate(lastDate.getDate() + 1);
        const formattedDate = lastDate.toISOString().split('T')[0];
        cumulativeTotals[formattedDate] = cumulativeSum;
      }
      
      const compareDate = new Date(lastMonthYear, lastMonth, today.getDate());
      if (getEndDay(lastMonthYear, lastMonth) < today.getDate()) {
        compareDate.setDate(getEndDay(lastMonthYear, lastMonth)); 
      }
      
      lastMonthCompareData.value = cumulativeTotals[compareDate.toISOString().split('T')[0]];
    }
  }
  
  return Object.values(cumulativeTotals);
};

const getDifference = () => {
  return thisMonthCompareData.value - lastMonthCompareData.value;
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
      data: calculateDailyTotal(props.cardTransactionLastMonthData, props.accountTransactionLastMonthData),
      tension: 0.2
    },
    {
      label: '이번달 소비',
      borderColor: '#2E7EED',
      pointBackgroundColor: '#2E7EED',
      pointRadius: generatePointRadius(),
      data: calculateDailyTotal(props.cardTransactionThisMonthData, props.accountTransactionThisMonthData),
      tension: 0.2
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
  <div class="py-5 px-8 bg-white border border-gray-200 rounded-2xl shadow">
    <div class="flex items-center justify-between">
      <div>
        <div>지난 달보다</div>
        <div><span class="text-red font-bold">{{ Math.abs(getDifference()).toLocaleString() }}</span>원 {{ getDifference() > 0 ? "더" : "덜" }}</div>
        <div>사용하고 있어요</div>
      </div>

      <div class="h-full w-2/5 items-end">
        <line-chart :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-red {
  color: #F55151;
}
</style>
