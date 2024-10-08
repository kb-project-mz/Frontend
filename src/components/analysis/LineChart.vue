<script setup>
import { ref } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  scales,
} from "chart.js";

Chart.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);

const props = defineProps({
  cardTransactionThisMonthData: {
    type: Object,
    required: true,
  },
  cardTransactionLastMonthData: {
    type: Object,
    required: true,
  },
  accountTransactionThisMonthData: {
    type: Object,
    required: true,
  },
  accountTransactionLastMonthData: {
    type: Object,
    required: true,
  },
});

const today = new Date();
const currentDate = today.getDate();

const authData = JSON.parse(localStorage.getItem("auth"));
const memberName = authData.memberName;

const lastMonthCompareData = ref(0);
const thisMonthCompareData = ref(0);
const difference = ref(0);

const generatePointRadius = () => {
  const result = new Array(currentDate).fill(0);
  result[currentDate - 1] = 5;
  return result;
};

const getEndDay = (year, month) => {
  const isLeapYear = (year) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const daysInMonth = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  return daysInMonth[month];
};

const calculateLastMonthCumulative = (
  cardTransactions,
  accountTransactions
) => {
  const cumulativeTotals = calculateCumulative(
    cardTransactions,
    accountTransactions
  );

  const dates = Object.keys(cumulativeTotals);
  const lastValue = cumulativeTotals[dates[dates.length - 1]];

  const startDate = new Date(dates[dates.length - 1]);
  const endDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    getEndDay(startDate.getFullYear(), startDate.getMonth())
  );
  const cur = new Date(startDate);

  while (cur < endDate) {
    cur.setDate(cur.getDate() + 1);
    const formattedDate = cur.toISOString().split("T")[0];
    cumulativeTotals[formattedDate] = lastValue;
  }

  let targetDate;
  if (currentDate > endDate.getDate()) {
    targetDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      endDate.getDate()
    );
  } else {
    targetDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      currentDate
    );
  }

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, "0");
  const day = String(targetDate.getDate()).padStart(2, "0");

  lastMonthCompareData.value = cumulativeTotals[`${year}-${month}-${day}`];
  Object.keys(cumulativeTotals).forEach((date) => {
    const formattedKey = parseInt(date.split("-")[2], 10);
    cumulativeTotals[formattedKey] = cumulativeTotals[date];
    delete cumulativeTotals[date];
  });
  return cumulativeTotals;
};

const calculateThisMonthCumulative = (
  cardTransactions,
  accountTransactions
) => {
  const cumulativeTotals = calculateCumulative(
    cardTransactions,
    accountTransactions
  );

  const dates = Object.keys(cumulativeTotals);
  const lastValue = cumulativeTotals[dates[dates.length - 1]];

  const startDate = new Date(dates[dates.length - 1]);
  const endDate = new Date();
  const currentDate = new Date(startDate);

  while (currentDate < endDate) {
    currentDate.setDate(currentDate.getDate() + 1);
    const formattedDate = currentDate.toISOString().split("T")[0];
    cumulativeTotals[formattedDate] = lastValue;
  }

  const year = endDate.getFullYear();
  const month = String(endDate.getMonth() + 1).padStart(2, "0");
  const day = String(endDate.getDate()).padStart(2, "0");

  thisMonthCompareData.value = cumulativeTotals[`${year}-${month}-${day}`];
  difference.value = thisMonthCompareData.value - lastMonthCompareData.value;
  if (isNaN(difference.value)) {
    difference.value = 0;
  }

  Object.keys(cumulativeTotals).forEach((date) => {
    const formattedKey = parseInt(date.split("-")[2], 10);
    cumulativeTotals[formattedKey] = cumulativeTotals[date];
    delete cumulativeTotals[date];
  });
  return cumulativeTotals;
};

const calculateCumulative = (cardTransactions, accountTransactions) => {
  const dailyTotals = {};

  accountTransactions.forEach((transaction) => {
    const date = transaction.accountTransactionDate;
    const amount = transaction.amount;
    const description = transaction.accountTransactionDescription;

    if (amount < 0 && !description.includes(memberName)) {
      dailyTotals[date] = (dailyTotals[date] || 0) + Math.abs(amount);
    }
  });

  cardTransactions.forEach((transaction) => {
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

  sortedDates.forEach((date) => {
    let currentDate = new Date(date);

    if (lastProcessedDate) {
      let previousDate = new Date(lastProcessedDate);

      while (previousDate < currentDate) {
        previousDate.setDate(previousDate.getDate() + 1);
        const formattedDate = previousDate.toISOString().split("T")[0];
        cumulativeTotals[formattedDate] = cumulativeSum;
      }
    }

    cumulativeSum += dailyTotals[date];
    cumulativeTotals[date] = cumulativeSum;

    lastProcessedDate = date;
  });

  return cumulativeTotals;
};

const LineChart = Line;

const chartData = ref({
  labels: [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
  ],
  datasets: [
    {
      label: "지난달 소비",
      borderColor: "#D6D7D9",
      pointRadius: 0,
      data: calculateLastMonthCumulative(
        props.cardTransactionLastMonthData,
        props.accountTransactionLastMonthData
      ),
      tension: 0.2,
    },
    {
      label: "이번달 소비",
      borderColor: "#2E7EED",
      pointBackgroundColor: "#2E7EED",
      pointRadius: generatePointRadius(),
      data: calculateThisMonthCumulative(
        props.cardTransactionThisMonthData,
        props.accountTransactionThisMonthData
      ),
      tension: 0.2,
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
      grid: {
        display: false,
      },
    },
  },
});
</script>

<template>
  <div class="py-5 px-8 bg-white border border-gray-200 rounded-2xl shadow">
    <div class="flex items-center justify-between">
      <div>
        <div>지난 달보다</div>
        <div>
          <span
            :class="[
              'font-bold',
              difference > 0 ? 'text-red' : difference < 0 ? 'text-blue' : '',
            ]"
          >
            {{ Math.abs(difference).toLocaleString() }} </span
          >원
          {{ difference > 0 ? "더" : "덜" }}
        </div>
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
  color: #f55151;
}
.text-blue {
  color: #0e9cff;
  background-color: rgba(244, 250, 255, 0.601);
}
</style>
