<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useTestStore } from "@/stores/test";

const route = useRoute();
const testStore = useTestStore();

const resultId = computed(() => parseInt(route.params.resultId, 10));
onMounted(() => {
    console.log("결과다~~~~~~~");
    console.log("inpulse", testStore.impulseScore);
    console.log("plannedScore", testStore.plannedScore);
    console.log("costEffective", testStore.costEffective);
    console.log("goodForSatisfaction", testStore.goodForSatisfaction);
    console.log("material", testStore.material);
    console.log("experiential", testStore.experiential);
});

const resultContent = computed(() => {
    let resultText = "";
    // 각 점수 비교 및 텍스트 추가
    if (testStore.impulseScore > testStore.plannedScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.material > testStore.experiential) {
        resultText += "충동_가성비_물질<BR>";
    }
    if (testStore.impulseScore > testStore.plannedScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.experiential > testStore.material) {
        resultText += "충동_가성비_경험<BR>";
    }
    if (testStore.plannedScore > testStore.impulseScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.material > testStore.experiential) {
        resultText += "계획_가성비_물질<BR>";
    }
    if (testStore.plannedScore > testStore.impulseScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.experiential > testStore.material) {
        resultText += "계획_가성비_경험<BR>";
    }
    if (testStore.impulseScore > testStore.plannedScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.material > testStore.experiential) {
        resultText += "충동_가심비_물질<BR>";
    }
    if (testStore.impulseScore > testStore.plannedScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.experiential > testStore.material) {
        resultText += "충동_가심비_경험<BR>";
    }
    if (testStore.plannedScore > testStore.impulseScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.material > testStore.experiential) {
        resultText += "계획_가심비_물질<BR>";
    }
    if (testStore.plannedScore > testStore.impulseScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.experiential > testStore.material) {
        resultText += "계획_가심비_경험<BR>";
    }

    return resultText;
});
</script>

<template>
    <div class="flex flex-col justify-center items-center h-screen bg-gray-50">
        <h1 class="text-2xl font-bold mb-4">당신의 결과는:</h1>
        <p class="text-lg" v-html="resultContent"></p>
    </div>
</template>
