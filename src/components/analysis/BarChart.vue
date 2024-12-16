<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { Chart } from "chart.js/auto";
import { useAuthStore } from "@/stores/auth.js";

const props = defineProps({
  accountTransactionData: {
    type: Array,
    required: true,
  },
  cardTransactionData: {
    type: Array,
    required: true,
  },
});

const authStore = useAuthStore();
const memberName = authStore.member.memberName;

const initialYear = new Date().getFullYear();
const initialMonth = new Date().getMonth();

const filterExpensesForMonth = (year, month) => {
  const accountExpenses = props.accountTransactionData.filter((item) => {
    const itemDate = new Date(item.accountTransactionDate);
    return (
      itemDate.getFullYear() === year &&
      itemDate.getMonth() === month &&
      item.amount < 0 &&
      (!item.accountTransactionDescription ||
        !item.accountTransactionDescription.includes(memberName))
    );
  });

  const cardExpenses = props.cardTransactionData.filter((item) => {
    const itemDate = new Date(item.cardTransactionDate);
    return (
      itemDate.getFullYear() === year &&
      itemDate.getMonth() === month &&
      item.amount > 0
    );
  });

  const totalAccountExpenses = accountExpenses.reduce(
    (sum, e) => sum + Math.abs(e.amount),
    0
  );
  const totalCardExpenses = cardExpenses.reduce((sum, e) => sum + e.amount, 0);

  return totalAccountExpenses + totalCardExpenses;
};

const getLast12MonthsExpenses = () => {
  const expensesPerMonth = [];
  const labels = [];

  let year = initialYear;
  let month = initialMonth;

  for (let i = 0; i < 12; i++) {
    const totalExpenses = filterExpensesForMonth(year, month);

    expensesPerMonth.push(totalExpenses ? totalExpenses : 0);
    labels.push(`${year}.${month + 1}`);

    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
  }

  return {
    expensesPerMonth: expensesPerMonth.reverse(),
    labels: labels.reverse(),
  };
};

const canvasRef = ref(null);
let chartInstance = null;

const updateChart = () => {
  if (chartInstance) {
    const { expensesPerMonth, labels } = getLast12MonthsExpenses();
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = expensesPerMonth;
    chartInstance.update();
  }
};

const renderChart = () => {
  const { expensesPerMonth, labels } = getLast12MonthsExpenses();

  if (chartInstance) {
    chartInstance.destroy();
  }

  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext("2d");
    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "월별 총 지출액",
            data: expensesPerMonth,
            borderColor: "#CEE3FF",
            backgroundColor: "rgba(206, 227, 255, 0.3)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
            },
          },
          x: {
            title: {
              display: true,
            },
          },
        },
      },
    });
  } else {
    console.error("canvasRef가 null입니다. 차트를 렌더링할 수 없습니다.");
  }
};

onMounted(() => {
  renderChart();
  watch(
    () => [props.accountTransactionData, props.cardTransactionData],
    () => {
      updateChart();
    },
    { immediate: true }
  );
});
</script>

<template>
  <div class="p-5 bg-white border rounded-xl shadow">
    <div class="ml-8 mt-2 font-bold text-lg text-center">월별 총 지출 내역</div>
    <div class="flex justify-center items-center h-full w-full bg-transparent">
      <canvas ref="canvasRef" width="400" height="230"></canvas>
    </div>
  </div>
</template>
