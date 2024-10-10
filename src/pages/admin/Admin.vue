<template>
  <div class="p-6">
    <CumulativeMetricsCard />
    <TodayLineChart />
    <TestBarChart />
  </div>
</template>

<script>
import CumulativeMetricsCard from '@/components/admin/CumulativeMetricsCard.vue';
import TestBarChart from '@/components/admin/TestBarChart.vue';
import TodayLineChart from '@/components/admin/TodayLineChart.vue';

export default {
  components: {
    CumulativeMetricsCard,
    TodayLineChart,
    TestBarChart,
  }
};
</script>