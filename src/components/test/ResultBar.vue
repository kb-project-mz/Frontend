<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  labelLeft: String,    
  labelRight: String,    
  scoreLeft: Number,     
  scoreRight: Number,    
});

const leftWidth  = ref('50%');
const rightWidth  = ref('50%');

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
      <span :class="{ 
        'font-bold text-xl text-indiepink-600': props.scoreLeft > props.scoreRight,
        }">
        {{ labelLeft }}
      </span>
      <span :class="{ 
        'font-bold text-xl text-indiepink-600': props.scoreRight > props.scoreLeft,
         }">
        {{ labelRight }}
      </span>
    </div>
    <div class="relative flex items-center h-10">
      <div class="h-8 bg-indiepink-300 rounded-l-full" :style="{ width: leftWidth }"></div>
      <div class="h-8 bg-indiepink-100 rounded-r-full" :style="{ width: rightWidth }"></div>
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
