<script setup>
import { useRouter } from "vue-router";
import { useTestStore } from "@/stores/test";

const router = useRouter();
const testStore = useTestStore();

const startTest = () => {
    console.log(testStore.score);
    testStore.resetScore();
    testStore.fetchTypes();
    console.log(testStore.fetchTypes);
    console.log(testStore.score);
    router.push({ name: "testQuestion", params: { number: 1 } });
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
                class="custom-shadow lotteria-font bg-white text-gray-500 font-bold py-4 px-6 rounded-xl text-xl transition duration-300 transform hover:scale-105 w-[300px]"
            >
                나의 소비 성향 테스트 <br />
                <span class="text-blue-600 text-lg">START!</span>
            </button>
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
</style>
