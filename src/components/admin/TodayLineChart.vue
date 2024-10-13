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
        backgroundColor: 'rgba(255, 99, 132, 0.1)',   // 연한 핑크 배경
        borderColor: 'rgba(255, 99, 132, 0.8)',       // 진한 핑크 테두리
        fill: true,
        tension: 0.3,                                 // 곡선 부드럽게
        yAxisID: 'y',
        type: 'line',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
      },
      {
        label: "Logins",
        data: loginCounts,
        backgroundColor: 'rgba(54, 162, 235, 0.1)',   // 연한 파란 배경
        borderColor: 'rgba(54, 162, 235, 0.8)',       // 진한 파란 테두리
        fill: true,
        tension: 0.3,
        yAxisID: 'y',
        type: 'line',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      },
      {
        label: "Visits",
        data: visitCounts,
        backgroundColor: 'rgba(255, 206, 86, 0.1)',   // 연한 노란 배경
        borderColor: 'rgba(255, 206, 86, 0.8)',       // 진한 노란 테두리
        fill: true,
        tension: 0.3,
        yAxisID: 'y',
        type: 'line',
        pointBackgroundColor: 'rgba(255, 206, 86, 1)',
      },
      {
        label: "Withdrawals",
        data: withdrawalCounts,
        backgroundColor: 'rgba(153, 102, 255, 0.3)',  // 연한 보라 배경
        borderColor: 'rgba(153, 102, 255, 1)',        // 진한 보라 테두리
        yAxisID: 'y1',
        type: 'bar',
        barThickness: 10,                             // 막대의 두께 조정
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
          labels: {
            color: '#333', // 범례 글자 색
          },
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: "Counts",
            color: '#666',  // y축 제목 색
          },
          beginAtZero: true,
          ticks: {
            stepSize: 100,
            color: '#666',  // y축 눈금 색
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',  // 그리드 라인 색
          },
        },
        y1: {
          title: {
            display: true,
            text: "Withdrawals",
            color: '#666',  // y1축 제목 색
          },
          beginAtZero: true,
          suggestedMax: 50,  // 50까지 보장, 값이 커지면 자동으로 늘어남
          position: 'right',
          ticks: {
            color: '#666',  // y1축 눈금 색
            stepSize: 5,
          },
          grid: {
            drawOnChartArea: false,  // y1축 그리드 라인 제거
          },
        },
        x: {
          title: {
            display: true,
            text: "Date",
            color: '#666',  // x축 제목 색
          },
          ticks: {
            color: '#666',  // x축 눈금 색
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',  // 그리드 라인 색
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

<template>
  <div class="p-4">
    <canvas id="dailyStatsChart"></canvas>
  </div>
</template>

<style scoped>

</style>