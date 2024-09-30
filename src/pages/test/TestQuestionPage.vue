<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();

const questionId = computed(() => parseInt(route.params.number));

const nextQuestion = () => {
  // 다음 질문 페이지로 이동
  router.push({ name: 'testQuestion', params: { number: questionId.value + 1 } });
};

const showResult = () => {
  // 결과 페이지로 이동
  router.push({ name: 'testResult' });
};
</script>

<template>
  <div>
    <h1>질문 {{ questionId }}</h1>
    <!-- 여기에 질문 내용이 들어감 -->
    <button v-if="questionId < 12" @click="nextQuestion">다음 질문</button>
    <button v-else @click="showResult">결과 보기</button>
  </div>
</template>
