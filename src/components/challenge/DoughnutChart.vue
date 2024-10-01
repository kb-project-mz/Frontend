<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, DoughnutController);

const props = defineProps({
  limit: Number,
  completed: Number,
});

const doughnutChart = ref(null);

const renderChart = () => {
  new Chart(doughnutChart.value, {
    type: 'doughnut',
    data: {
      labels: ['진행된 횟수', '남은 횟수'],
      datasets: [
        {
          label: '진행상황',
          data: [props.completed, props.limit - props.completed],
          backgroundColor: ['#FF6384', '#36A2EB'],
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
    },
  });
};

onMounted(() => {
  renderChart();
});

// props가 변경될 때마다 차트 업데이트
watch([() => props.limit, () => props.completed], () => {
  renderChart();
});
</script>

<template>
  <div class="chart-container">
    <canvas ref="doughnutChart"></canvas>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100px;
  height: 100px;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>
