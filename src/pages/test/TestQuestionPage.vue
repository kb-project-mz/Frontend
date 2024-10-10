<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed, ref, onMounted, watch } from "vue";
import { useTestStore } from "@/stores/test";

const router = useRouter();
const route = useRoute();
const testStore = useTestStore();

const questions = ref([]);
const options = ref([]);

const questionId = computed(() => parseInt(route.params.number, 10));
const currentQuestion = computed(() => testStore.questions[questionId.value - 1]); 
const currentOptions = computed(() => testStore.getOptionsByQuestionIdx(questionId.value));
const answers = computed(() => currentOptions.value);

const progress = computed(() => {
    return ((questionId.value - 1) / testStore.questions.length) * 100; 
});

const fetchData = async () => {
    questions.value = await testStore.fetchQuestions(); 
    options.value = await testStore.fetchOptions(questionId.value); 
}

onMounted(() => {
    fetchData(); 
})

watch(questionId, () => {
    fetchData(); 
    console.log("inpulse", testStore.impulseScore);
    console.log("plannedScore", testStore.plannedScore);
    console.log("costEffective", testStore.costEffective);
    console.log("goodForSatisfaction", testStore.goodForSatisfaction);
    console.log("material", testStore.material);
    console.log("experiential", testStore.experiential);
});

const selectedAnswers = ref([]);

const nextQuestion = (answerId, answerScore, questionType) => {
    selectedAnswers.value.push(answerId); 

     if (questionType === 1) {
        testStore.incrementImpulseScore(answerScore);
    } else if (questionType === 2) {
        testStore.incrementPlannedScore(answerScore);
    } else if (questionType === 3) {
        testStore.incrementCostEffective(answerScore);
    } else if (questionType === 4) {
        testStore.incrementGoodForSatisfaction(answerScore);
    } else if (questionType === 5) {
        testStore.incrementMaterialScore(answerScore);
    } else if (questionType === 6) {
        testStore.incrementExperientialScore(answerScore);
    }

    if (questionId.value < testStore.questions.length) {
        router.push({ name: "testQuestion", params: { number: questionId.value + 1 } });
    } else {
        router.push({ name: "testLoading" });
    }
};
</script>

<template>
    <div class="flex flex-col justify-center items-center h-screen bg-gray-50">

        <div class="relative w-1/2 bg-gray-200 rounded-full h-2 mb-6">
            <div
                class="h-2 rounded-full"
                :style="{ 
                    width: `${progress}%`, 
                    backgroundColor: '#C0EBA6',
                }"
            ></div>

            <img
                src="@/assets/star.png"
                class="absolute transform -translate-x-1/2"
                :style="{ 
                    left: `calc(${progress}% - 3px)`,
                    top: '-80px',
                    width: '170px', 
                    height: '175px'
                }"
                alt="Progress Star"
            />
        </div>
        
        <div class="text-center">
            <h1 class="text-3xl font-bold mb-4">Q{{ questionId }}.</h1>
            <p class="mb-8" v-if="currentQuestion">{{ currentQuestion.questionText }}</p>

            <div class="flex flex-col space-y-4">
                <button
                    v-if="answers.length > 0"
                    v-for="answer in answers"
                    :key="answer.optionIdx"
                    @click="nextQuestion(answer.optionIdx, answer.score, answer.typeIdx)"
                    class="bg-white text-red-600 font-semibold py-4 px-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
                >
                    {{ answer.optionText }}
                </button>
            </div>
        </div>
    </div>
</template>
