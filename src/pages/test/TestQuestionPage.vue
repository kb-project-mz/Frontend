<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed, ref, onMounted, watch } from "vue";
import { useTestStore } from "@/stores/test";

const router = useRouter();
const route = useRoute();
const testStore = useTestStore();

const questions = ref([]);
const options = ref([]);

const questionId = computed(() => parseInt(route.params.number));
const currentQuestion = computed(() => testStore.questions[questionId.value - 1]); // 현재 질문 가져오기
const currentOptions = computed(() => testStore.getOptionsByQuestionIdx(questionId.value)); // 현재 질문에 대한 옵션 가져오기
const answers = computed(() => currentOptions.value);

const fetchData = async () => {
    questions.value = await testStore.fetchQuestions(); 
    options.value = await testStore.fetchOptions(questionId.value); 
    console.log('011111111111110', options.value);
}

onMounted(() => {
    fetchData(); 
})

watch(questionId, () => {
    fetchData(); 
});

const nextQuestion = () => {
    if (questionId.value < testStore.questions.length) {
        router.push({ name: "testQuestion", params: { number: questionId.value + 1 } });
    } else {
        router.push({ name: "testResult" });
    }
};

// 서버에서 데이터를 받아와 버튼 내용 설정해야합니다 !!!
</script>

<template>
    <div class="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div class="text-center">
            <h1 class="text-2xl font-bold mb-4">Q{{ questionId }}.</h1>

            <p class="mb-8" v-if="currentQuestion">{{ currentQuestion.questionText }}</p>

            <div class="flex flex-col space-y-4">
                <button
                    v-if="answers.length > 0"
                    v-for="answer in answers"
                    :key="answer.optionIdx"
                    @click="nextQuestion"
                    class="bg-white text-red-500 font-semibold py-4 px-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
                >
                    {{ answer.optionText }}
                </button>
            </div>
        </div>
    </div>
</template>
