<script setup>
import { ref, onMounted } from "vue";
import { useConsumptionHistoryStore } from "@/stores/consumption-history";
import { useAccountHistoryStore } from "@/stores/account-history";
import MostAndMaximumUsed from "@/components/consumption/MostAndMaximumUsed.vue";
import CategoryChart from "@/components/consumption/CategoryChart.vue";
</script>
<template>
    <div class="mx-8 border-l border-gray-300"></div>
    <div class="flex-1">
        <div class="text-lg mb-1">이번 달 나의 소비 습관을 다른 달과 비교해볼까요?</div>
        <div class="text-xl font-semibold mb-6">2024년 8월 1일 - 2024년 8월 31일</div>
        <!-- <MostAndMaximumUsed :period="selectedPeriod" />
    <div class="flex mt-8">
      <div class="w-1/2 mr-4">
        <CategoryChart />
      </div>
      <div class="w-1/2 ml-4">
        <LineChart />
        <div class="mt-8"><SomeChart /></div>
      </div>
    </div> -->
    </div>
</template>
<style></style>
