<script setup>
import { computed, watch } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

// 사용자 정보 가져오기
const memberId = computed(() => authStore.member.memberId);
const memberName = computed(() => authStore.member.memberName);
const imageUrl = computed(() => authStore.member.imageUrl);
const email = computed(() => authStore.member.email);

console.log("header imageUrl", imageUrl);

// 이미지 URL 변경 시 감지
watch(() => authStore.member.imageUrl, (newImageUrl) => {
  imageUrl.value = newImageUrl;
});
</script>

<template>
  <header class="bg-white shadow p-4 flex items-center justify-between">
    <div class="flex items-center space-x-4">
      <span class="text-xl font-bold">Dashboard</span>
    </div>

    <div v-if="memberId" class="flex items-center space-x-2">
      <div class="text-sm">
        <p class="font-bold">{{ memberName }}</p>
      </div>
    </div>
  </header>
</template>

<style scoped>
input::placeholder {
  color: #9CA3AF;
}
</style>
