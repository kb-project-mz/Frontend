<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  maximumUsed: {
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
  <div class="most-used mr-10 w-88">
    <div class="text-2xl mb-7">
      <div>{{ period }} <span class="text-blue">가장 많은 지출</span>은</div>
      <div>바로 이 곳에서 사용했어요</div>
    </div>
    <span class="mb-3 font-normal text-gray-700 dark:text-gray-400">
      <div class="text-2xl">
        <div v-for="(value, key, index) in maximumUsed" :key="index">
          {{ getMedal(index) }} {{ key }} <span class="font-bold">{{ value.toLocaleString() }}</span>원
        </div>
      </div>
    </span>
  </div>
</template>

<style scoped>
.text-blue {
  color: #0E9CFF;
}
.w-88 {
  width: 22rem;
}
</style>
