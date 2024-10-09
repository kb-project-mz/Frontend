<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed, ref, onMounted, watch } from "vue";
import { useTestStore } from "@/stores/test";
import starImage from '@/assets/star.png';

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

// 사용자가 선택한 답변을 저장할 배열
const selectedAnswers = ref([]);

// 점수 계산 로직 부분
const calculateResult = () => {
    const total = selectedAnswers.value.reduce((sum, answer) => sum + answer, 0);
    if (total < 10) {
        return 1;
    } else if (total < 20) {
        return 2;
    } else if (total < 30) {
        return 3;
    }
    return 0; // 기본 결과
};

// 다음 문제 라우팅 및 답변 저장
const nextQuestion = (answerId, answerScore, questionType) => {
    selectedAnswers.value.push(answerId); // 선택한 답변 저장

     // 질문 유형에 따라 점수 추가 로직 실행
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

    // 총 점수도 증가시킴
    testStore.incrementScore(answerScore);

    // 다음 질문으로 이동
    if (questionId.value < testStore.questions.length) {
        router.push({ name: "testQuestion", params: { number: questionId.value + 1 } });
    } else {
        const resultId = calculateResult();
        router.push({ name: "testLoading" });
    }
};
</script>

<template>
    <div class="flex flex-col justify-center items-center h-screen bg-gray-50">

        <div class="w-3/4 bg-gray-200 rounded-full h-2 mb-6">
            <div class="bg-gray-500 h-2 rounded-full" :style="{ width: `${progress}%` }"></div>
            <img 
                :src="starImage" 
                alt="Progress Image" 
                class="absolute h-6 transform -translate-x-1/2"
                :style="{ left: `${progress}%`, top: '-2px' }"  
            />
        </div>
        <div class="text-center">
            <h1 class="text-2xl font-bold mb-4">Q{{ questionId }}.</h1>

            <p class="mb-8" v-if="currentQuestion">{{ currentQuestion.questionText }}</p>

            <div class="flex flex-col space-y-4">
                <button
                    v-if="answers.length > 0"
                    v-for="answer in answers"
                    :key="answer.optionIdx"
                    @click="nextQuestion(answer.optionIdx, answer.score, answer.typeIdx)"
                    class="bg-white text-red-500 font-semibold py-4 px-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
                >
                    {{ answer.optionText }}
                </button>
            </div>
        </div>
    </div>
</template>
