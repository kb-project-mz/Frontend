<script setup>
import { ref, watch, onMounted } from 'vue';
import Chart from 'chart.js/auto'; 

const props = defineProps({
  impulseScore: Number,
  plannedScore: Number,
  costEffective: Number,
  goodForSatisfaction: Number,
  material: Number,
  experiential: Number,
});

const chartRef = ref(null);
let chartInstance = null;

onMounted(() => {
  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels: [
        'Impulse vs Planned',
        'Cost Effective vs Satisfaction',
        'Material vs Experiential',
      ],
      datasets: [
        {
          label: 'one',
          data: [
            props.impulseScore,
            //props.plannedScore,
            props.costEffective,
           // props.goodForSatisfaction,
            props.material,
            //props.experiential
          ],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          barThickness: 20,
        },
        {
          label: 'the other',
          data: [
            -props.plannedScore,
            -props.goodForSatisfaction,
            -props.experiential,
          ],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          barThickness: 20,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
          min: -3,
          max: 3,
        },
      },
      responsive: true,
    }
  });
});

</script>

<template>
  <div>
    <canvas ref="chartRef" width="400" height="400"></canvas>
  </div>
</template>

<style>

</style>