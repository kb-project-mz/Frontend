<script setup>
import { ref, onMounted } from "vue";
import { Chart } from "chart.js/auto";
import { useTransactionStore } from "@/stores/transaction";

const canvasRef = ref(null);
let chartInstance = null;

const transactionStore = useTransactionStore();

const fetchDataFromBackend = async () => {
  const startDate = "2024-01-01";
  const endDate = "2024-12-31";
  const responseData = await transactionStore.getMonthlyExpenses(startDate, endDate);

  if (Array.isArray(responseData)) {
    const sortedData = responseData.sort((a, b) => a.month - b.month);


    const labels = sortedData.map((item) => `${item.month}월`);
    const data = sortedData.map((item) => item.totalExpense);

    return { labels, data };
  } else {
    console.error("잘못된 데이터 형식:", responseData);
    return { labels: [], data: [] };
  }
};

const renderChart = async () => {
  const { labels, data } = await fetchDataFromBackend();

  if (chartInstance) {
    chartInstance.destroy();
  }

  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext("2d");

    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels, 
        datasets: [
          {
            label: "월별 총 지출액",
            data,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "총 지출액 (원)",
            },
          },
          x: {
            title: {
              display: true,
              text: "월",
            },
          },
        },
      },
    });
  } else {
    console.error("canvasRef가 정의되지 않았습니다.");
  }
};

onMounted(() => {
  renderChart();
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
