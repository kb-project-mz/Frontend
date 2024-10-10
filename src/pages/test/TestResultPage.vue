<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useTestStore } from "@/stores/test";
import { useAuthStore } from "@/stores/auth";
import ShareButton from "@/components/common/ShareButton.vue";
import KakaoShareButton from "@/components/common/KakaoShareButton.vue"; 

const route = useRoute();
const router = useRouter();
const testStore = useTestStore();
const authStore = useAuthStore();

const resultImage = ref('');
const resultContent = ref('');
const resultId = computed(() => parseInt(route.params.resultId, 10));

onMounted(async () => {
    resultContent.value = await getResultContent();
    console.log('결과==============================');
    console.log("inpulse", testStore.impulseScore);
    console.log("plannedScore", testStore.plannedScore);
    console.log("costEffective", testStore.costEffective);
    console.log("goodForSatisfaction", testStore.goodForSatisfaction);
    console.log("material", testStore.material);
    console.log("experiential", testStore.experiential);
});

const getResultContent = async () => {
    let resultText = "";
    let resultValue = 0;

    if (testStore.impulseScore > testStore.plannedScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.material > testStore.experiential) {
        resultText = testStore.types[0].typeName;
        resultValue = 1;
        resultImage.value = testStore.types[0].typeImage;
    }
    if (testStore.impulseScore > testStore.plannedScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.experiential > testStore.material) {
        resultText = testStore.types[1].typeName;
        resultValue = 2;
        resultImage.value = testStore.types[1].typeImage;
    }
    if (testStore.plannedScore > testStore.impulseScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.material > testStore.experiential) {
        resultText = testStore.types[2].typeName;
        resultValue = 3;
        resultImage.value = testStore.types[2].typeImage;

    }
    if (testStore.plannedScore > testStore.impulseScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.experiential > testStore.material) {
        resultText = testStore.types[3].typeName;
        resultValue = 4;
        resultImage.value = testStore.types[3].typeImage;

    }
    if (testStore.impulseScore > testStore.plannedScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.material > testStore.experiential) {
        resultText = testStore.types[4].typeName;
        resultValue = 5;
        resultImage.value = testStore.types[4].typeImage;

    }
    if (testStore.impulseScore > testStore.plannedScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.experiential > testStore.material) {
        resultText = testStore.types[5].typeName;
        resultValue = 6;
        resultImage.value = testStore.types[5].typeImage;

    }
    if (testStore.plannedScore > testStore.impulseScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.material > testStore.experiential) {
        resultText = testStore.types[6].typeName;
        resultValue = 7;
        resultImage.value = testStore.types[6].typeImage;
    }
    if (testStore.plannedScore > testStore.impulseScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.experiential > testStore.material) {
        resultText = testStore.types[7].typeName;
        resultValue = 8;
        resultImage.value = testStore.types[7].typeImage;
    }

    if (resultValue !== null) {
        testStore.saveResult(resultValue);
    }
    resultImage.value = `https://fingertips-bucket-local.s3.ap-northeast-2.amazonaws.com/${resultImage.value}`;
    return resultText;
};

const restartTest = () => {
    router.push({ name: "testStart" });
};

const goToSignup = () => {
    if (authStore.isLogin()) {
        router.push({ name: "homePage" });
    } else {
        router.push({ name: "join" }); 

    }
};
</script>

<template>
    <div class="flex flex-col justify-center items-center h-screen bg-gray-50">
        <h1 class="text-2xl font-bold mb-4">당신의 결과는:</h1>
        <img :src="resultImage" alt="Result Image" />
        <p class="text-lg">{{ resultContent }}</p>
        
        <ShareButton class="mt-4" /> 

        <KakaoShareButton 
            class="mt-4" 
            :title="resultContent" 
            description="테스트 결과를 확인하세요!"
            imageUrl="https://your-image-url.com/image.jpg" 
            :linkUrl="`http://localhost:8080/test/${resultId}`" 
        />
        <button @click="restartTest" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">테스트 다시 하기</button>
        <button @click="goToSignup" :class="[authStore.isLogin() ? 'bg-green-500' : 'bg-blue-500', 'mt-2', 'px-4', 'py-2', 'text-white', 'rounded']">
            {{ authStore.isLogin() ? "홈 화면으로 가기" : "회원가입 하러 가기" }}
        </button>
    </div>
</template>
