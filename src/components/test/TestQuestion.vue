<template>
    <div>
        <p>{{ currentQuestion.text }}</p>
    </div>
</template>

<script setup>
import { computed } from "vue";

const questions = [
    { id: 1, text: "첫 번째 질문: " },
    { id: 2, text: "두 번째 질문: " },
    { id: 3, text: "세 번째 질문: " },
    { id: 4, text: "네 번째 질문: " },
    { id: 5, text: "다섯 번째 질문: " },
    { id: 6, text: "여섯 번째 질문: " },
    { id: 7, text: "일곱 번째 질문: " },
    { id: 8, text: "여덟 번째 질문: " },
    { id: 9, text: "아홉 번째 질문: " },
    { id: 10, text: "열 번째 질문: " },
    { id: 11, text: "열한 번째 질문: " },
    { id: 12, text: "열두 번째 질문: " },
];

// 부모로부터 questionId를 props로 받음
const props = defineProps(["questionId"]);

// 현재 questionId에 맞는 질문을 찾아 표시
const currentQuestion = computed(() => {
    return questions.find((q) => q.id === props.questionId) || { text: "질문을 찾을 수 없습니다." };
});
</script>
