<script setup>
import { useTestResultStore } from '@/stores/testResult';
import { ref, onMounted } from 'vue';

const testResultStore = useTestResultStore();
const SBTIResult = ref([]);

const authData = JSON.parse(localStorage.getItem('auth'));
const memberIdx = authData.memberIdx;

const fetchSBTIResult = async (memberIdx) => {
  await testResultStore.getTestResult(memberIdx);
};

onMounted(async () => {
  await fetchSBTIResult(memberIdx);
  SBTIResult.value = testResultStore.TestResult;
});
</script>

<template>
  <div v-if="SBTIResult">
    {{ SBTIResult.typeImage }}
  </div>
  <div v-else>
    <RouterLink to="/test/start"> 소비 테스트 하러가기! </RouterLink>
  </div>
</template>
