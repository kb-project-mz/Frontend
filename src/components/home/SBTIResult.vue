<script setup>
import { useTestResultStore } from '@/stores/testResult';
import { ref, onMounted, toRaw } from 'vue';

const testResultStore = useTestResultStore();
const SBTIResult = ref(null);
const resultImage = ref('');

const authData = JSON.parse(localStorage.getItem('auth'));
const memberIdx = authData.memberIdx;

const fetchSBTIResult = async (memberIdx) => {
  await testResultStore.getTestResult(memberIdx);
  
  SBTIResult.value = await testResultStore.TestResult;
  
  console.log('SBTIResult', SBTIResult);
  const _obj = toRaw(SBTIResult.value);

	if (_obj && _obj.typeImage) { 
    resultImage.value = `https://fingertips-bucket-local.s3.ap-northeast-2.amazonaws.com/${_obj.typeImage}`;
  } else {
		resultImage.value = null;
	}
	console.log('resultImage.value', resultImage.value);
};

onMounted(async () => {
  await fetchSBTIResult(memberIdx);
});
</script>

<template>
  <div class="border border-gray-200 rounded-lg p-30 max-w-s mx-auto">
    <div v-if="resultImage!=null">
      <img :src="resultImage" alt="Result Image" />
    </div> 
    <div v-else>
      <RouterLink to="/test/start"> 소비 테스트 하러가기! </RouterLink>
    </div>
  </div>
</template>
