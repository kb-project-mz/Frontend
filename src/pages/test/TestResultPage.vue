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

const resultId = computed(() => parseInt(route.params.resultId, 10));
onMounted(() => {
    console.log("컴포넌트에서 확인하는 types:", testStore.types);
});

const resultContent = computed(() => {
    let resultText = "";
    let resultValue = 0;

    if (testStore.impulseScore > testStore.plannedScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.material > testStore.experiential) {
        resultText = testStore.types[0].typeName;
        resultValue = 1;
        console.log(resultValue);
    }
    if (testStore.impulseScore > testStore.plannedScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.experiential > testStore.material) {
        resultText = testStore.types[1].typeName;
        resultValue = 2;
    }
    if (testStore.plannedScore > testStore.impulseScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.material > testStore.experiential) {
        resultText = testStore.types[2].typeName;
        resultValue = 3;
    }
    if (testStore.plannedScore > testStore.impulseScore && testStore.costEffective > testStore.goodForSatisfaction && testStore.experiential > testStore.material) {
        resultText = testStore.types[3].typeName;
        resultValue = 4;
    }
    if (testStore.impulseScore > testStore.plannedScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.material > testStore.experiential) {
        resultText = testStore.types[4].typeName;
        resultValue = 5;
    }
    if (testStore.impulseScore > testStore.plannedScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.experiential > testStore.material) {
        resultText = testStore.types[5].typeName;
        resultValue = 6;
    }
    if (testStore.plannedScore > testStore.impulseScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.material > testStore.experiential) {
        resultText = testStore.types[6].typeName;
        resultValue = 7;
    }
    if (testStore.plannedScore > testStore.impulseScore && testStore.goodForSatisfaction > testStore.costEffective && testStore.experiential > testStore.material) {
        resultText = testStore.types[7].typeName;
        resultValue = 8;
    }

    if (resultValue !== null) {
        testStore.sendType(resultValue);
    }

    return resultText;
});

const restartTest = () => {
    router.push({ name: "testStart" });
};

const goToSignup = () => {
    if (authStore.isLogin()) {
        router.push({ name: "memberHomePage" });
    } else {
        router.push({ name: "join" });
    }
};
</script>

<template>
    <div class="flex flex-col justify-center items-center h-screen bg-gray-50">
        <h1 class="text-2xl font-bold mb-4">당신의 결과는:</h1>
        <p class="text-lg" v-text="resultContent"></p>
        
        <ShareButton class="mt-4" /> 
        <!-- 카카오톡 공유하기 버튼 추가 -->
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
