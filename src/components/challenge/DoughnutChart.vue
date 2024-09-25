<script setup>
import { ref, watch, onMounted } from 'vue';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const props = defineProps({
  chartData: {
    type: Object,
    default: () => ({})  // 기본값을 빈 객체로 설정
  }
});

const canvasRef = ref(null);
const chartInstance = ref(null);  // 차트 인스턴스를 추적

const renderDoughnutChart = () => {
  if (!props.chartData || typeof props.chartData.challengeLimit === 'undefined' || typeof props.chartData.cardHistoryCount === 'undefined') {
    console.error("차트를 렌더링할 데이터가 부족합니다.");
    return;  // 데이터가 없으면 차트를 렌더링하지 않음
  }

  const ctx = canvasRef.value.getContext('2d');
  
  // 이전 차트가 있으면 먼저 삭제
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  chartInstance.value = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['진행된 횟수', '남은 횟수'],
      datasets: [{
        data: [props.chartData.cardHistoryCount, props.chartData.challengeLimit - props.chartData.cardHistoryCount],
        backgroundColor: ['#ff6384', '#36a2eb'],
        hoverBackgroundColor: ['#ff6384', '#36a2eb']
      }]
    }
  });
};

onMounted(() => {
  renderDoughnutChart();  // 처음 컴포넌트가 로드될 때 차트 렌더링
});

// props.chartData가 변경될 때마다 차트 다시 렌더링
watch(() => props.chartData, () => {
  renderDoughnutChart();
});
</script>

<template>
  <canvas ref="canvasRef"></canvas>
</template>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
