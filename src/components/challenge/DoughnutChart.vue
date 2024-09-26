<template>
  <div class="chart-container">
    <canvas ref="doughnutChart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js'; // 필요한 요소 임포트

// Chart.js에 필요한 요소들 등록
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
      responsive: true, // 부모 요소 크기에 맞춰 차트 크기 조정
      maintainAspectRatio: false, // 캔버스의 비율을 유지하지 않고, 부모의 크기에 맞추기
    },
  });
};

onMounted(() => {
  renderChart(); // 차트 렌더링
});

// props가 변경될 때마다 차트 업데이트
watch([() => props.limit, () => props.completed], () => {
  renderChart();
});
</script>

<style scoped>
.chart-container {
  width: 100px; /* 고정된 너비 설정 */
  height: 100px; /* 고정된 높이 설정 */
}

canvas {
  width: 100%;
  height: 100%;
}
</style>
