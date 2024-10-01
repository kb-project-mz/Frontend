<script setup>
import { useRouter, useRoute } from "vue-router";
import { computed, ref } from "vue";

const router = useRouter();
const route = useRoute();

const questionId = computed(() => parseInt(route.params.number));

const nextQuestion = () => {
    if (questionId.value < 12) {
        router.push({ name: "testQuestion", params: { number: questionId.value + 1 } });
    } else {
        router.push({ name: "testResult" });
    }
};

// 서버에서 데이터를 받아와 버튼 내용 설정해야합니다 !!!
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
                    @click="nextQuestion"
                    class="bg-white text-red-500 font-semibold py-4 px-6 rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
                >
                    {{ answer.text }}
                </button>
            </div>
        </div>
    </div>
</template>
