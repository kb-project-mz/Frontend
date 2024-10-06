<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
// 숫자로 변환
const resultId = computed(() => parseInt(route.params.resultId, 10)); 

const resultContent = computed(() => {
    switch (resultId.value) {
        case 1:
            return '결과 1:';
        case 2:
            return '결과 2:';
        case 3:
            return '결과 3:';
        case 4:
            return '결과 4:';
        case 5:
            return '결과 5:';
        case 6:
            return '결과 6:';
        case 7:
            return '결과 7:';
        case 8:
            return '결과 8:';
        default:
            return '알 수 없는 결과';
    }
});
</script>

<template>
    <div class="flex flex-col justify-center items-center h-screen bg-gray-50">
        <h1 class="text-2xl font-bold mb-4">당신의 결과는:</h1>
        <p class="text-lg">{{ resultContent }}</p>
    </div>
</template>
