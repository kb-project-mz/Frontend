<script setup>
import { ref, onMounted } from "vue";
import { Chart } from "chart.js/auto";

const props = defineProps({
  consumptionData: {
    type: Array,
    required: true,
  },
});

const canvasRef = ref(null);

onMounted(() => {
  // canvasRef가 정상적으로 DOM에 바인딩되었는지 확인 후 getContext 호출
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext("2d");

    new Chart(ctx, {
      type: "line", // 라인 차트
      data: {
        labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
        datasets: [
            {
                label: "월별 총 지출액",
                data: props.consumptionData,
                borderColor: "#CEE3FF",
                backgroundColor: "#CEE3FF", // 채운 영역의 색상
                fill: true, // 선 아래 영역 채우기
                tension: 0.4, // 곡선 추가
            },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // 차트가 부모 요소의 크기에 맞게 조정
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
            },
          },
          x: {
            title: {
              display: true,
            },
          },
        },
      },
      });
  } else {
    console.error("지난 1년간의 지출액이 없습니다.");
  }
});
</script>

<template>
  <div class="chart-container">
    <canvas ref="canvasRef" id="monthlyConsumptionChart"></canvas>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%; /* 부모 div의 너비에 맞게 */
  height: 100%; /* 부모 div의 높이에 맞게 */
  position: relative; /* 차트가 컨테이너에 맞게 조정되도록 */
}

canvas {
  max-width: 100%;
  height: 100%;
}
</style>
