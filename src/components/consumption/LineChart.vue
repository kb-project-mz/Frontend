<script>
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale);

export default {
  components: {
    LineChart: Line,
  },
  data() {
    return {
      chartData: {
        labels: [
          '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 
          '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', 
          '23', '24', '25', '26', '27', '28', '29', '30'
        ],
        datasets: [
          {
            label: '지난달 소비',
            borderColor: '#D6D7D9',
            pointRadius: 0,
            data: [
              1000, 5000, 6000, 12000, 20000, 25000, 35000, 50000, 100000, 
              120000, 150000, 200000, 207000, 214000, 220000, 230000, 
              234000, 250000, 300000, 320000, 333000, 345000, 364000, 
              370000, 370000, 400000, 420300, 421000, 453000, 472000
            ],
            tension: 0.1,
          },
          {
            label: '이번달 소비',
            borderColor: '#2E7EED',
            pointBackgroundColor: '#2E7EED',
            pointRadius: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
            data: [
              1000, 5000, 7000, 16000, 27000, 30000, 50000, 50700, 64000, 
              100000, 120000, 250000, 273000, 284000, 310000, 345000, 
              385000, 410000, 462000, 540000
            ],
            tension: 0.1,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
            grid: {
              display: false,
            },
          },
        }
      },
    };
  },
};
</script>

<template>
  <div class="py-5 px-8 bg-white border border-gray-200 rounded-2xl shadow overflow-hidden">
    <div class="flex items-center justify-between">
      <div>
        <div>지난 달보다</div>  
        <div><span class="text-red font-bold">10,000</span>원 더</div>
        <div>사용하고 있어요</div>
      </div>
      
      <div class="flex w-32 justify-end h-16">
        <line-chart class="w-full h-full" :data="chartData" :options="chartOptions"/>
      </div>
    </div>    
  </div>
</template>

<style scoped>
.text-red {
  color: #F55151;
}
.line-chart {
  height: 100%; /* 차트가 부모 div 높이에 맞추기 */
}
</style>
