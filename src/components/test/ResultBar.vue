<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  labelLeft: String,     // 왼쪽 레이블
  labelRight: String,    // 오른쪽 레이블
  scoreLeft: Number,     // 왼쪽 변수 값
  scoreRight: Number,    // 오른쪽 변수 값
});

const leftWidth  = ref('50%');
const rightWidth  = ref('50%');

// 막대그래프 비율 계산
const calculateWidths = () => {
  const total = props.scoreLeft + props.scoreRight;
  if (total === 0) {
    leftWidth.value = '0%';
    rightWidth.value = '0%';
    return;
  }
  const percentageLeft = (props.scoreLeft / total) * 100;
  const percentageRight = (props.scoreRight / total) * 100;
  
  leftWidth.value = `${percentageLeft}%`;
  rightWidth.value = `${percentageRight}%`;
};

onMounted(() => {
  calculateWidths();
});

watch(() => [props.scoreLeft, props.scoreRight], calculateWidths);
</script>

<template>
  <div class="my-4 rounded-lg">
    <div class="flex justify-between mb-2">
      <span>{{ labelLeft }}</span>
      <span>{{ labelRight }}</span>
    </div>
    <div class="relative flex">
      <div class="h-8 bg-gray-200 rounded-l-md" :style="{ width: leftWidth }"></div>
      <div class="h-8 bg-yellow-100 rounded-r-md" :style="{ width: rightWidth }"></div>
    </div>
  </div>
</template>

<style>
.bg-blue-500 {
  background-color: #007BFF;
}
.transition-transform {
  transition: left 1s ease;
}
</style>
