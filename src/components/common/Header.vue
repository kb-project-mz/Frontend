<script setup>
import { computed, watch, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";

const authStore = useAuthStore();
const router = useRouter();

const memberId = computed(() => authStore.member.memberId);
const memberName = computed(() => authStore.member.memberName);
const imageUrl = computed(() => authStore.member.imageUrl);

console.log("header imageUrl", imageUrl)

const logout = async () => {
  await authStore.logout();
  authStore.clearAuthState();
  localStorage.clear(); 
  router.push('/');
};

watch(() => authStore.member.imageUrl, (newImageUrl) => {
  imageUrl.value = newImageUrl;
})
</script>

<template>
  <nav class="bg-white shadow-md p-4 rounded-xl max-w-9xl mt-4 mx-auto mb-16">
    <div class="max-w-7.5xl mx-auto flex justify-between items-center">
      <router-link to="/" class="flex items-center">
        <img src="/src/assets/logo.png" alt="Company Logo" class="h-8 w-auto" />
      </router-link>

      <div v-if="memberId" class="flex space-x-20">
        <router-link to="/test/start">소비 심리 테스트</router-link>
        <router-link to="/analysis">소비 습관 분석</router-link>
        <router-link to="/challenge">돈과의 전쟁</router-link>
      </div>

      <div v-if="memberId" class="flex items-center">
        <img class="w-8 h-8 rounded-full mr-2" :src="`https://fingertips-bucket-local.s3.ap-northeast-2.amazonaws.com/${imageUrl}`" alt="Profile Image">
        {{ memberName }}님&nbsp;&nbsp;&nbsp;
        <router-link v-if="memberId" to="/mypage" class="mr-2">
          마이페이지
        </router-link>
        <button
          @click="logout"
          class="bg-customBlue py-1.5 px-2.5 text-white rounded-md text-xs"
        >
          로그아웃
        </button>
      </div>

      <div v-else>
        <div class="flex space-x-4">
          <router-link to="/login" class="gray">로그인</router-link>
          <span class="gray">|</span>
          <router-link to="/join" class="gray">회원가입</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>
