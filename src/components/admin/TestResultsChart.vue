<script>
import apiInstance from '@/util/axios-instance.js';
import VueApexCharts from 'vue3-apexcharts';

// export default {
//   components: {
//     apexchart: VueApexCharts,
//   },
//   data() {
//     return {
//       series: [],
//       chartOptions: {
//         chart: {
//           id: 'test-results-chart',
//         },
//         xaxis: {
//           categories: ['Test Link Visit', 'Result Click', 'Sign Up'],
//         },
//       },
//     };
//   },
//   mounted() {
//     this.fetchTestResults();
//   },
//   methods: {
//     async fetchTestResults() {
//       const response = await apiInstance.get('/admin/test-results');
//       const testData = response.data.data;

//       this.series = [{
//         name: 'Test Results',
//         data: [
//           testData.today_test_link_visit_count,
//           testData.today_test_result_click_count,
//           testData.today_test_sign_up_count,
//         ],
//       }];
//     },
//   },
// };
</script>

<template>
    <div>
      <apexchart type="bar" :options="chartOptions" :series="series"></apexchart>
    </div>
  </template>
  

  <style scoped>
  .chart-container {
    padding: 20px;
  }
  </style>
  