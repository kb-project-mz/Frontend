<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const id = computed(() => authStore.member.id);
const memberName = computed(() => authStore.member.memberName);

const logout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<template>
  <nav class="bg-white shadow-md p-4 rounded-xl max-w-9xl mt-4 mx-auto mb-16">
    <div class="max-w-7.5xl mx-auto flex justify-between items-center">
      <router-link to="/" class="flex items-center">
        <img src="/src/assets/logo.png" alt="Logo" class="h-8 w-auto" />
      </router-link>

    <div v-if="id">
      <router-link to="/mypage">
        {{ memberName }}님
      </router-link>
      <button @click="logout" class="bg-navy ml-2 py-1.5 px-2.5 text-white rounded-md text-xs">로그아웃</button>
    </div>

    <div v-else>
      <div class="flex space-x-4">
      <router-link to="/login" class="flex items-center">
        <a href="#" class="gray">로그인</a>
      </router-link>
      <span class="gray">|</span>
      <router-link to="/join" class="flex items-center">
        <a href="#" class="gray">회원가입</a>
      </router-link>
    </div>
    </div>
    </div>
  </nav>
</template>

<style scoped>
.bg-navy {
  background-color: #0B1573;
}
</style>
