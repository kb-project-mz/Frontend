<script setup>
import { useRouter } from "vue-router";
import { useTestStore } from "@/stores/test";
import { useAuthStore } from "@/stores/auth";
import ShareButton from "@/components/common/ShareButton.vue";
import KakaoShareButton from "@/components/common/KakaoShareButton.vue"; 

const router = useRouter();
const testStore = useTestStore();
const authStore = useAuthStore();

const startTest = async () => {
    testStore.resetScore();
    testStore.resetInfo();
    testStore.fetchTypes();
    if (authStore.member.memberId) {
        const info = await testStore.getSurveyInfo(authStore.member.memberId);
        testStore.setBirthYear(info.birthYear);
        testStore.setGender(info.gender);
        console.log('스타투', testStore.birthYear);
        console.log('스타투', testStore.gender);
        router.push({ name: "testQuestion", params: { number: 1 } }); 
    } else { 
        router.push({ name: "testSurvey" }); 
    }
};
</script>

<template>
    <div class="relative">
        <div class="flex justify-center mt-0">
            <img src="/src/assets/test_start.png" class="w-1/3 h-auto mb-0" />
        </div>

        <div class="flex justify-center">
            <button
                @click="startTest"
                class="custom-button"
            >
                나의 소비 성향 테스트 <br />
                <span class="text-blue-600 text-lg">START!</span>
            </button>
        </div>
        
        <div class="flex justify-center">
            <ShareButton class="mt-4 " /> 
        </div>
        
        <div class="flex justify-center">
            <KakaoShareButton 
                class="mt-4 custom-button" 
                description="나의 소비 성향 테스트 하러 가기"
                :linkUrl="`http://localhost:8080/test/start`" 
            />
        </div>
    </div>
</template>

<style>
.custom-shadow {
    box-shadow: 0 4px 20px rgba(0, 0, 5, 0.5);
}

.lotteria-font {
    font-family: "LotteriaDdag", sans-serif;
}

/* 공통 스타일 */
.custom-button {
    font-family: "LotteriaDdag", sans-serif;
    box-shadow: 0 4px 20px rgba(0, 0, 5, 0.5);
    background-color: white;
    color: #4B5563; /* text-gray-500 */
    font-weight: bold;
    padding: 16px 24px;
    border-radius: 0.75rem;
    font-size: 1.25rem;
    transition: transform 0.3s ease;
    width: 300px;
    text-align: center;
}

.custom-button:hover {
    transform: scale(1.05);
}
</style>

