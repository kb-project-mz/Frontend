<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const startTest = () => {
    router.push({ name: "testQuestion", params: { number: 1 } });
};
</script>

<template>
    <div class="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div class="text-center relative">
            <div class="absolute top-0 left-0 text-gray-500 text-sm space-y-4">
                <p>#계획형</p>
                <p class="ml-10">#충동구매</p>
            </div>

            <div class="absolute top-0 right-0 text-gray-500 text-sm">
                <p>#가성비</p>
            </div>

            <h1 class="text-5xl font-bold mb-8">
                나의 <br />
                소비 성향은?
            </h1>

            <button @click="startTest" class="bg-white text-blue-500 font-bold py-4 px-8 rounded-full shadow-lg text-xl transition duration-300 transform hover:scale-105 mb-6">
                나의 소비 성향 테스트 <br />
                <span class="text-blue-600 text-lg">START!</span>
            </button>
        </div>
    </div>
</template>
>
