<template>
  <div class="p-4">
    <canvas id="dailyStatsChart"></canvas>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import apiInstance from '@/util/axios-instance';
import { Chart } from 'chart.js/auto';

let chartInstance = null; // 차트 인스턴스 관리

const fetchAllMetrics = async () => {
  try {
    const response = await apiInstance.get('/admin/daily-metrics');
    const data = response.data.data;

    // API로부터 받은 데이터가 배열인지 확인
    if (!Array.isArray(data)) {
      throw new Error("Data is not an array");
    }

    // 데이터를 중간에서 한 번 출력하여 확인 (이 부분 추가)
    console.log("API Data Array:", data);

    // 데이터가 비어있거나 undefined인 경우를 방어적으로 처리
    if (!data || data.length === 0) {
      console.error("No data available");
      return;
    }

    // 데이터를 매핑하여 각 데이터셋 생성
    const labels = data.map((item, index) => {
      if (!item.metricDate) {
        console.warn(`Missing metricDate at index ${index}`);
        return "Unknown Date";  // 날짜가 없을 경우 기본 값 설정
      }
      const date = new Date(item.metricDate);
      return date.toISOString().split('T')[0];
    });

    const signUpCounts = data.map((item, index) => item.todaySignUpCount || 0); // 회원가입 수
    const loginCounts = data.map((item, index) => item.todayLoginCount || 0);   // 로그인 수
    const visitCounts = data.map((item, index) => item.todayVisitCount || 0);   // 방문자 수
    const withdrawalCounts = data.map((item, index) => item.todayWithdrawalCount || 0); // 탈퇴 수

    // 중간 데이터 확인 (이 부분 추가)
    console.log("Labels:", labels);
    console.log("Sign-ups:", signUpCounts);
    console.log("Logins:", loginCounts);
    console.log("Visits:", visitCounts);
    console.log("Withdrawals:", withdrawalCounts);

    // 기존 차트가 있으면 삭제
    if (chartInstance) {
      chartInstance.destroy();
    }

    // 차트를 그리는 함수 호출
    chartInstance = plotChart(labels, signUpCounts, loginCounts, visitCounts, withdrawalCounts);
  } catch (error) {
    console.error("Error fetching all metrics:", error);
  }
};

const plotChart = (labels, signUpCounts, loginCounts, visitCounts, withdrawalCounts) => {
  const ctx = document.getElementById("dailyStatsChart").getContext("2d");

  const chartData = {
    labels: labels, // x축 라벨
    datasets: [
      {
        label: "Sign-ups",
        data: signUpCounts, // 회원가입 수
        borderColor: "rgb(75, 192, 192)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Logins",
        data: loginCounts, // 로그인 수
        borderColor: "rgb(54, 162, 235)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Visits",
        data: visitCounts, // 방문자 수
        borderColor: "rgb(255, 206, 86)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Withdrawals",
        data: withdrawalCounts, // 탈퇴 수
        borderColor: "rgb(255, 99, 132)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  // 차트 생성
  return new Chart(ctx, {
    type: "line",
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Date",
          },
        },
        y: {
          title: {
            display: true,
            text: "Count",
          },
          min: 0,
          max: 400, // y축 최소 0, 최대 1000 설정
          ticks: {
            stepSize: 100, // 100 단위로 y축 구분
          },
        },
      },
    },
  });
};

// 컴포넌트가 마운트되었을 때 API 호출
onMounted(() => {
  fetchAllMetrics();
});
</script>

<style scoped>
/* Add custom styles if necessary */
</style>
