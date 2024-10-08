<script setup>
import { ref, onMounted } from 'vue';

const fixedExpenses = ref([]);

onMounted(() => {
  fixedExpenses.value = ["스타벅스", "공차", "이마트", "KT통신요금", "한국도시철도공사", "에이블리"];
})
</script>

<template>
<div class="py-5 px-8 bg-white border border-gray-200 rounded-2xl shadow">
    <div class="font-bold mb-3">나의 고정 지출 키워드는?</div>
    <div class="flex flex-wrap gap-y-2 gap-x-3 mt-2">
      <div v-for="expense in fixedExpenses" :key="expense" class="py-2 px-3 w-fit rounded-full text-white bg-navy text-xs">
        #{{ expense }}
      </div>
    </div>
</div>
</template>

<style>
.bg-navy {
  background-color: #0b1573;
}
</style>
