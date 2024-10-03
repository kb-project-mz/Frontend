<script setup>
import { ref, onMounted } from 'vue';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
import { useCategoryTransactionStore } from '@/stores/category-transaction';  // Pinia store import

// Chart.js에서 사용하는 컴포넌트 등록
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

// Pinia store 사용
const categoryTransactionStore = useCategoryTransactionStore();
const chartData = ref({
  labels: [],
  datasets: [{
    data: [],
    backgroundColor: ["#FFB3BA", "#B3E5FC", "#FFCE99", "#C8E6C9", "#E1BEE7"], // 파스텔톤 색상
    hoverBackgroundColor: ["#FFB3BA", "#B3E5FC", "#FFCE99", "#C8E6C9", "#E1BEE7"]
  }]
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
  }
});

// 차트 렌더링 함수
const renderChart = () => {
  const ctx = document.getElementById('doughnutChart').getContext('2d');
  if (window.doughnutChartInstance) {
    window.doughnutChartInstance.destroy();  // 중복 차트 방지
  }
  window.doughnutChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: chartData.value,
    options: chartOptions.value,
  });
};

onMounted(async () => {
  const memberIdx = localStorage.getItem("memberIdx");

  if (memberIdx) {
    await categoryTransactionStore.fetchCategoryTransactionCount(memberIdx);
    if (categoryTransactionStore.categoryData.length > 0) {
      chartData.value.labels = categoryTransactionStore.categoryData.map(item => item.categoryName);
      chartData.value.datasets[0].data = categoryTransactionStore.categoryData.map(item => item.percentage);

      renderChart();
    } else {
      console.error("카테고리 데이터가 없습니다.");
    }
  } else {
    console.error("memberIdx가 유효하지 않습니다.");
  }
});
</script>

<template>
  <div class="chart-container">
    <canvas id="doughnutChart"></canvas>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 400px;
}
</style>




