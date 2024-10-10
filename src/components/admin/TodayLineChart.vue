<template>
  <div class="p-4">
    <canvas id="dailyStatsChart"></canvas>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from "vue";
import apiInstance from '@/util/axios-instance';
import { Chart } from 'chart.js/auto';

let chartInstance = null;

// 날짜 포맷 변환 함수
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0]; // "yyyy-MM-dd" 형식으로 변환
};

const fetchAllMetrics = async () => {
  try {
    const response = await apiInstance.get('/admin/daily-metrics');
    console.log("API 전체 응답:", response);
    
    // 배열의 각 항목에 접근
    const data = response.data.data;

    // 배열을 순회하면서 데이터를 가져옴
    const labels = data.map(item => formatDate(item.metricDate));
    const signUpCounts = data.map(item => item.todaySignUpCount || 0);
    const loginCounts = data.map(item => item.todayLoginCount || 0);
    const visitCounts = data.map(item => item.todayVisitCount || 0);
    const withdrawalCounts = data.map(item => item.todayWithdrawalCount || 0);

    // 차트 관련 처리
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }

    chartInstance = plotChart(labels, signUpCounts, loginCounts, visitCounts, withdrawalCounts);
  } catch (error) {
    console.error("Error fetching all metrics:", error);
  }
};

const plotChart = (labels, signUpCounts, loginCounts, visitCounts, withdrawalCounts) => {
  const ctx = document.getElementById("dailyStatsChart").getContext("2d");

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Sign-ups",
        data: signUpCounts,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.1,
        yAxisID: 'y',
        type: 'line',
      },
      {
        label: "Logins",
        data: loginCounts,
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        tension: 0.1,
        yAxisID: 'y',
        type: 'line',
      },
      {
        label: "Visits",
        data: visitCounts,
        borderColor: "rgb(255, 206, 86)",
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        fill: true,
        tension: 0.1,
        yAxisID: 'y',
        type: 'line',
      },
      {
        label: "Withdrawals",
        data: withdrawalCounts,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        yAxisID: 'y1',
        type: 'bar',
      },
    ],
  };

  return new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: "Counts",
          },
          beginAtZero: true,
          ticks: {
            stepSize: 100,
          },
        },
        y1: {
          title: {
            display: true,
            text: "Withdrawals",
          },
          beginAtZero: true,
          position: 'right',
          ticks: {
            stepSize: 5,
          },
          grid: {
            drawOnChartArea: false,
          },
        },
        x: {
          title: {
            display: true,
            text: "Date",
          },
        },
      },
    },
  });
};

onMounted(async () => {
  await nextTick();
  fetchAllMetrics();
});
</script>

<style scoped>
/* Add custom styles if necessary */
</style>
