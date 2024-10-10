<script></script>

<template></template>

<!-- <script>
  import { onMounted } from 'vue';
  import { Chart } from 'chart.js';
  import apiInstance from '@/util/axios-instance';
  
  export default {
    setup() {
      const renderBarChart = (data) => {
        const ctx = document.getElementById('barChart').getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['월', '화', '수', '목', '금', '토', '일'], // 일주일의 요일
            datasets: [
              {
                label: 'Test Link Visitors',
                data: data.testLinkVisits, // API로부터 가져온 Test 링크 방문자 데이터
                backgroundColor: '#4e73df', // 파란색 막대
              },
              {
                label: 'Test Result Clicks',
                data: data.testResultClicks, // API로부터 가져온 Test 결과 클릭 수 데이터
                backgroundColor: '#f6c23e', // 노란색 막대
              },
              {
                label: 'Sign-ups After Test',
                data: data.testSignUps, // API로부터 가져온 Test 후 회원가입 수 데이터
                backgroundColor: '#36b9cc', // 청록색 막대
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: {
                  display: false, // X축 그리드를 숨김
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(200, 200, 200, 0.2)', // Y축 그리드 스타일
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              tooltip: {
                enabled: true,
              },
            },
          },
        });
      };
  
      const fetchTestMetrics = async () => {
        try {
          const response = await apiInstance.get('/admin/test-results');
          const result = await response.json();
          const formattedData = formatData(result.data);
          renderBarChart(formattedData);
        } catch (error) {
          console.error('Error fetching test metrics:', error);
        }
      };
  
      const formatData = (data) => {
        // API로부터 가져온 데이터를 각 테스트의 일주일 데이터로 분리
        const formatted = {
          testLinkVisits: [data.monVisits, data.tueVisits, data.wedVisits, data.thuVisits, data.friVisits, data.satVisits, data.sunVisits],
          testResultClicks: [data.monClicks, data.tueClicks, data.wedClicks, data.thuClicks, data.friClicks, data.satClicks, data.sunClicks],
          testSignUps: [data.monSignUps, data.tueSignUps, data.wedSignUps, data.thuSignUps, data.friSignUps, data.satSignUps, data.sunSignUps],
        };
        return formatted;
      };
  
      onMounted(() => {
        fetchTestMetrics(); // 컴포넌트가 마운트될 때 API 호출
      });
  
      return {};
    },
  };
</script>

<template>
    <div class="p-4 bg-white rounded shadow">
      <h3 class="text-gray-600 mb-4 font-semibold">Test Results Comparison</h3>
      <canvas id="barChart"></canvas>
    </div>
</template>
  
  
<style scoped>
  canvas {
    max-height: 350px; /* 캔버스 높이 제한 */
  }
  </style>
   -->