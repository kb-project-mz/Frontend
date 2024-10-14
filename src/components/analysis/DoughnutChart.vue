<script setup>
import { ref, onMounted } from "vue";
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from "chart.js";
import { useCategoryTransactionStore } from "@/stores/category-transaction";

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const props = defineProps({
  chartId: {
    type: String,
    required: true
  },
  period: {
    type: String,
    required: true
  }
});

const categoryTransactionStore = useCategoryTransactionStore();

const chartData = ref({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: ["#FFB3BA", "#B3E5FC", "#FFCE99", "#C8E6C9", "#E1BEE7"],
      hoverBackgroundColor: ["#FFB3BA", "#B3E5FC", "#FFCE99", "#C8E6C9", "#E1BEE7"],
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
    },
    tooltip: {
      enabled: true,
    }
  },
});

let doughnutChartInstance = null;

const renderChart = () => {
  const ctx = document.getElementById(props.chartId).getContext("2d");

  if (doughnutChartInstance) {
    doughnutChartInstance.destroy();
  }

  doughnutChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: chartData.value,
    options: chartOptions.value,
  });
};

onMounted(() => {
  if (props.period === '이번 달') {
    const uniqueCategories = [...new Set(categoryTransactionStore.categoryDataThisMonth.map((item) => item.categoryName))];

    chartData.value.labels = uniqueCategories;
    chartData.value.datasets[0].data = uniqueCategories.map((category) => {
      const categoryData = categoryTransactionStore.categoryDataThisMonth.find((item) => item.categoryName === category);
      return categoryData.percentage.toFixed(1);
  });
  } else {
    const uniqueCategories = [...new Set(categoryTransactionStore.categoryDataSelectedPeriod.map((item) => item.categoryName))];

    chartData.value.labels = uniqueCategories;
    chartData.value.datasets[0].data = uniqueCategories.map((category) => {
      const categoryData = categoryTransactionStore.categoryDataSelectedPeriod.find((item) => item.categoryName === category);
      return categoryData.percentage.toFixed(1);
    });
  }


  renderChart();
});
</script>

<template>
  <div class="mx-8 flex justify-center">
    <canvas :id="chartId"></canvas>
  </div>
</template>

<style scoped>

</style>
