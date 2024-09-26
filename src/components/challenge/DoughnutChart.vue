<template>
  <div>
    <doughnut-chart :chart-data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// 차트에 필요한 요소 등록
ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  id: Number, // 각 챌린지의 ID
});

const chartData = ref({
  labels: ['진행된 횟수', '남은 횟수'],
  datasets: [
    {
      label: '진행도',
      backgroundColor: ['#FF6384', '#36A2EB'],
      data: [0, 0],  // 초기값
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});

const fetchChartData = () => {
  axios
    .get(`http://localhost:8080/api/v1/challenge/donutchart/`, {
      headers: {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkbGVrZHVkMDEwMiIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3MjcwNTkyNDksImV4cCI6MTcyNzQwNDg0OX0.6Z-07i5nQhAMBnzlcwfDXcSc-6wuL46bcn2hpx5wLxA"
      }
    })
    .then((res) => {
      if (res.data.success) {
        const total = res.data.data.total;
        const completed = res.data.data.completed;
        chartData.value.datasets[0].data = [completed, total - completed];
      }
    })
    .catch((err) => {
      console.error('차트 데이터 가져오기 오류:', err);
    });
};

onMounted(fetchChartData);
</script>

<style scoped>
.doughnut-chart {
  width: 100px;
  height: 100px;
}
</style>
