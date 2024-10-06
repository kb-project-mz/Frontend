<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed, ref } from "vue";

const router = useRouter();
const route = useRoute();

// 질문 ID를 숫자로 변환해서 사용
const questionId = computed(() => parseInt(route.params.number, 10)); // 숫자로 변환

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
const nextQuestion = (answerId) => {
    selectedAnswers.value.push(answerId); // 선택한 답변 저장

    if (questionId.value < 12) {
        router.push({ name: "testQuestion", params: { number: questionId.value + 1 } });
    } else {
        const resultId = calculateResult();
        router.push({ name: "testResult", params: { resultId } });
    }
};

// 서버에서 데이터를 받아와 버튼 내용 설정해야 합니다!!!
const answers = ref([
    { id: 1, text: "이건 사야 해! 할인은 다시 오지 않는 기회! 바로 산다 😎" },
    { id: 2, text: "안 사면 100% 할인.. 예전에 입던 소비만이 참는다 🤔" },
]);
</script>

<template>
    <div class="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div class="text-center">
            <h1 class="text-2xl font-bold mb-4">Q{{ questionId }}.</h1>

            <p class="mb-8">질문 내용</p>

            <div class="flex flex-col space-y-4">
                <button
                    v-for="answer in answers"
                    :key="answer.id"
                    @click="() => nextQuestion(answer.id)"
                    class="bg-white text-red-500 font-semibold py-4 px-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
                >
                    {{ answer.text }}
                </button>
            </div>
        </div>
    </div>
</template>
