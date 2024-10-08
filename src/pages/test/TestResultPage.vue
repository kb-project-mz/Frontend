<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useTestStore } from "@/stores/test";

const route = useRoute();
const testStore = useTestStore();
// 숫자로 변환
const resultId = computed(() => parseInt(route.params.resultId, 10)); 
onMounted(() => {
    console.log('결과다~~~~~~~');
    console.log("inpulse", testStore.impulseScore);
    console.log("plannedScore", testStore.plannedScore);
    
    console.log("costEffective", testStore.costEffective);
    console.log("goodForSatisfaction", testStore.goodForSatisfaction);

    console.log("material", testStore.material);
    console.log("experiential", testStore.experiential);
})

const resultContent = computed(() => {
    let resultText = '';
    // 각 점수 비교 및 텍스트 추가
    if (testStore.impulseScore > testStore.plannedScore) {
        resultText += "충동소비핑ㅋㅋ<BR>";
    }
    if (testStore.plannedScore > testStore.impulseScore) {
        resultText += "계획소비핑ㅋㅋ<BR>";
    }
    if (testStore.costEffective > testStore.goodForSatisfaction) {
        resultText += "가성비가 내려온다핑<BR>";
    }
    if (testStore.goodForSatisfaction > testStore.costEffective) {
        resultText += "마음의 소리를 따라가핑<BR>";
    }
    if (testStore.material > testStore.experiential) {
        resultText += "황금만능주의핑<BR>";
    }
    if (testStore.experiential > testStore.material) {
        resultText += "몸으로 부딪히는 핑<BR>";
    }


    return resultText;
});
</script>

<template>
    <div class="flex flex-col justify-center items-center h-screen bg-gray-50">
        <h1 class="text-2xl font-bold mb-4">당신의 결과는:</h1>
        <img src="https://fingertips-bucket-local.s3.ap-northeast-2.amazonaws.com/%EC%B6%A9%EB%8F%99_%EA%B0%80%EC%84%B1%EB%B9%84_%EB%AC%BC%EC%A7%88.png">
        <p class="text-lg" v-html="resultContent"></p>
    </div>
</template>
