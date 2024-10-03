<script>
import TodayMetrics from '@/components/admin/TodayMetrics.vue'; // 상단 4개의 지표를 모아둔 컴포넌트
import TestResultsChart from '@/components/admin/TestResultsChart.vue'; // 막대그래프 컴포넌트
import CumulativeMetricsChart from '@/components/admin/CumulativeMetricsChart.vue'; // 곡선 그래프 컴포넌트

export default {
  components: {
    TodayMetrics,  // 상단 지표 컴포넌트
    TestResultsChart,  // 막대그래프 컴포넌트
    CumulativeMetricsChart  // 곡선 그래프 컴포넌트
  }
};
</script>

<template>
  <div class="dashboard">
    <!-- 상단 4개의 지표를 모아둔 컴포넌트 -->
    <TodayMetrics />

    <!-- 테스트 결과를 나타내는 막대 그래프 -->
    <TestResultsChart />

    <!-- 누적 지표를 나타내는 곡선 그래프 -->
    <CumulativeMetricsChart />
  </div>
</template>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 20px;
}
</style>
