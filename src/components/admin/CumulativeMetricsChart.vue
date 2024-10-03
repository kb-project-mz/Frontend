<script>
import VueApexCharts from 'vue3-apexcharts';
import apiInstance from '@/util/axios-instance.js';

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      series: [],
      chartOptions: {
        chart: {
          height: 350,
          type: "line",
          stacked: false
        },
        dataLabels: {
          enabled: false
        },
        colors: ["#FF1654", "#247BA0", "#FECB46", "#00E396"],
        stroke: {
          width: [4, 4, 4, 4]  // 각 시리즈 라인의 두께
        },
        xaxis: {
          categories: []  // X축에 표시할 날짜 목록을 API에서 가져올 예정
        },
        yaxis: [
          {
            seriesName: 'Sign Up',
            axisTicks: { show: true },
            axisBorder: { show: true, color: "#FF1654" },
            labels: { style: { colors: "#FF1654" } },
            title: { text: "Sign Up", style: { color: "#FF1654" } }
          },
          {
            seriesName: 'Login',
            opposite: true,
            axisTicks: { show: true },
            axisBorder: { show: true, color: "#247BA0" },
            labels: { style: { colors: "#247BA0" } },
            title: { text: "Login", style: { color: "#247BA0" } }
          },
          {
            seriesName: 'Visit',
            opposite: true,
            axisTicks: { show: true },
            axisBorder: { show: true, color: "#FECB46" },
            labels: { style: { colors: "#FECB46" } },
            title: { text: "Visit", style: { color: "#FECB46" } }
          },
          {
            seriesName: 'Withdrawal',
            axisTicks: { show: true },
            axisBorder: { show: true, color: "#00E396" },
            labels: { style: { colors: "#00E396" } },
            title: { text: "Withdrawal", style: { color: "#00E396" } }
          }
        ],
        tooltip: {
          shared: false,
          intersect: true,
          x: { show: false }
        },
        legend: {
          horizontalAlign: "left",
          offsetX: 40
        }
      }
    };
  },
  mounted() {
    this.fetchCumulativeMetrics();
  },
  methods: {
    async fetchCumulativeMetrics() {
      try {
        const response = await apiInstance.get('/admin/total');
        console.log(response);
        const cumulativeData = response.data.data;

        // 차트 데이터 설정
        this.series = [{
          name: 'Sign Up',
          data: cumulativeData.map(item => item.totalSignUpCount) // 누적 회원가입 수
        }, {
          name: 'Login',
          data: cumulativeData.map(item => item.totalLoginCount)  // 누적 로그인 수
        }, {
          name: 'Visit',
          data: cumulativeData.map(item => item.totalVisitCount)  // 누적 방문자 수
        }, {
          name: 'Withdrawal',
          data: cumulativeData.map(item => item.totalWithdrawalCount)  // 누적 탈퇴자 수
        }];

        // X축 날짜 설정
        this.chartOptions.xaxis.categories = cumulativeData.map(item => item.metricDate);

      } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
      }
    }
  }
};
</script>

<template>
  <div class="chart-container">
    <apexchart type="line" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<style scoped>
.chart-container {
  padding: 20px;
}
</style>
