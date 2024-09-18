<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  mostUsed: {
    type: Object,
    required: true,
  },
  getMedal: {
    type: Function,
    required: true,
  },
  period: {
    type: String,
    required: true,
  }
});
</script>

<template>
  <div class="most-used ml-10 w-88">
    <div class="text-2xl mb-7">
      <div>{{ period }} <span class="text-red">소비 횟수</span>가</div>
      <div>가장 많은 곳이에요</div>
    </div>
    <span class="mb-3 font-normal text-gray-700 dark:text-gray-400">
      <div class="text-2xl">
        <div v-for="(value, key, index) in mostUsed" :key="index">
          {{ getMedal(index) }} {{ key }} <span class="font-bold">{{ value }}</span>회        </div>
      </div>
    </span>
  </div>
</template>

<style scoped>
.text-red {
  color: #F55151;
}
.w-88 {
  width: 22rem;
}
</style>
