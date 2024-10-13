<script setup>
import { useTestResultStore } from '@/stores/testResult';
import { ref, onMounted, toRaw } from 'vue';

const testResultStore = useTestResultStore();
const SBTIResult = ref(null);
const resultImage = ref('');
const GoTest = ref(false);

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
		resultImage.value = `https://fingertips-bucket-local.s3.ap-northeast-2.amazonaws.com/before-test.png`;
    GoTest.value = true;
	}
	console.log('resultImage.value', resultImage.value);
};

onMounted(async () => {
  await fetchSBTIResult(memberIdx);
});
</script>

<template>
  <div class="border border-gray-200 rounded-lg p-30 w-3/4 mx-auto">
    <div v-if="GoTest">
      <img :src="resultImage" alt="Result Image" />
      <RouterLink to="/test/start"> 소비 테스트 하러가기! </RouterLink>
    </div> 
    <div v-else>
      <img :src="resultImage" alt="Result Image" />
    </div>
  </div>
</template>
